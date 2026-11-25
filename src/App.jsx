import { useEffect, useMemo, useState } from 'react';
import './styles.css';

const MENUS = [
  { id: 'classic', name: 'Menu Classic', type: 'adult', price: 9.9, emoji: '🍔', subtitle: 'Burger, frites et boisson', color: '#ffe4c7' },
  { id: 'chicken', name: 'Menu Chicken', type: 'adult', price: 10.9, emoji: '🍗', subtitle: 'Poulet, frites et boisson', color: '#fff0c6' },
  { id: 'veggie', name: 'Menu Veggie', type: 'adult', price: 9.5, emoji: '🥬', subtitle: 'Burger veggie, frites et boisson', color: '#e6f3d9' },
  { id: 'kid-burger', name: 'Menu Enfant Burger', type: 'child', price: 5.9, emoji: '🧒', subtitle: 'Mini burger, frites et jus', color: '#fce4e7' },
  { id: 'kid-nuggets', name: 'Menu Enfant Nuggets', type: 'child', price: 5.9, emoji: '🍗', subtitle: 'Nuggets, frites et jus', color: '#f6e6ff' },
];

const PACKS = [
  { id: 'desserts', name: 'Pack de 4 desserts', emoji: '🍨', regular: 8, family: 6, subtitle: '4 douceurs à partager' },
  { id: 'drinks', name: 'Pack de 4 boissons', emoji: '🥤', regular: 7, family: 5, subtitle: '4 boissons au choix' },
];

const euros = (value) => value.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

function calcMenuTotal(cart) {
  return MENUS.reduce((sum, item) => sum + item.price * (cart[item.id] || 0), 0);
}
function qtyOfType(cart, type) {
  return MENUS.filter(item => item.type === type).reduce((sum, item) => sum + (cart[item.id] || 0), 0);
}
function calcPackTotal(packs, family) {
  return PACKS.reduce((sum, pack) => sum + (packs[pack.id] || 0) * (family ? pack.family : pack.regular), 0);
}

export default function App() {
  const [page, setPage] = useState('welcome');
  const [cart, setCart] = useState({});
  const [packs, setPacks] = useState({});
  const [family, setFamily] = useState(false);
  const [offerSeen, setOfferSeen] = useState(false);
  const [showOffer, setShowOffer] = useState(false);
  const [category, setCategory] = useState('all');

  const adults = qtyOfType(cart, 'adult');
  const children = qtyOfType(cart, 'child');
  const eligible = adults >= 1 && children >= 1;
  const totalQty = Object.values(cart).reduce((a, b) => a + b, 0) + Object.values(packs).reduce((a, b) => a + b, 0);
  const menuTotal = calcMenuTotal(cart);
  const discount = family && eligible ? Math.round(menuTotal * 0.15 * 100) / 100 : 0;
  const packTotal = calcPackTotal(packs, family && eligible);
  const total = Math.round((menuTotal - discount + packTotal) * 100) / 100;
  const savingsOnPacks = family && eligible ? PACKS.reduce((sum, item) => sum + (packs[item.id] || 0) * (item.regular - item.family), 0) : 0;

  // On ne propose le mode Famille qu'une seule fois par commande.
  useEffect(() => {
    if (eligible && !family && !offerSeen && page !== 'welcome') {
      setOfferSeen(true);
      setShowOffer(true);
    }
  }, [eligible, family, offerSeen, page]);

  const visibleMenus = useMemo(
    () => MENUS.filter(item => category === 'all' || item.type === category),
    [category]
  );

  function changeQty(id, delta) {
    setCart(previous => {
      const next = { ...previous, [id]: Math.max(0, (previous[id] || 0) + delta) };
      return next;
    });
  }
  function changePack(id, delta) {
    setPacks(previous => ({ ...previous, [id]: Math.max(0, (previous[id] || 0) + delta) }));
  }
  function acceptFamily() {
    setFamily(true);
    setShowOffer(false);
    setPage('family');
  }
  function declineFamily() {
    setShowOffer(false);
  }
  function reset() {
    setPage('welcome');
    setCart({});
    setPacks({});
    setFamily(false);
    setOfferSeen(false);
    setShowOffer(false);
    setCategory('all');
  }

  const menuEntries = MENUS.filter(item => cart[item.id] > 0);
  const packEntries = PACKS.filter(item => packs[item.id] > 0);

  return (
    <div className="app">
      <div className="kiosk">
        <header className="header">
          <button className="brand" onClick={() => setPage('welcome')} aria-label="Retour à l'accueil">🍔 <span>FastFood</span></button>
          {page !== 'welcome' && page !== 'done' && (
            <div className="header-right">
              {family && <span className="family-label">👨‍👩‍👧 Mode Famille</span>}
              <button className="cart-icon" onClick={() => setPage('cart')} aria-label="Afficher le panier">🛒 <b>{totalQty}</b></button>
            </div>
          )}
        </header>

        {page === 'welcome' && (
          <main className="welcome">
            <div className="hero-icon">🍟</div>
            <p className="eyebrow">BIENVENUE CHEZ FASTFOOD</p>
            <h1>Une petite faim ?</h1>
            <p>Composez votre repas en quelques étapes.</p>
            <button className="primary big" onClick={() => setPage('catalogue')}>Commencer ma commande <span>→</span></button>
            <p className="fineprint">Une borne pour tous, avec des offres qui s'adaptent à votre commande.</p>
          </main>
        )}

        {page === 'catalogue' && (
          <main className="content">
            <div className="page-title"><p className="eyebrow">ÉTAPE 1 · CHOIX DES PRODUITS</p><h1>Nos menus</h1><p>Choisissez ce qui vous fait plaisir.</p></div>
            <div className="tabs" role="group" aria-label="Filtrer les menus">
              {[['all', 'Tous'], ['adult', 'Adultes'], ['child', 'Enfants']].map(([value, label]) => (
                <button key={value} className={category === value ? 'active' : ''} onClick={() => setCategory(value)}>{label}</button>
              ))}
            </div>
            <section className="menu-grid">
              {visibleMenus.map(item => (
                <article key={item.id} className="product-card">
                  <div className="food-visual" style={{ background: item.color }}>{item.emoji}</div>
                  <div className="product-text"><span className="type-tag">{item.type === 'child' ? 'Menu enfant' : 'Menu adulte'}</span><h2>{item.name}</h2><p>{item.subtitle}</p><strong>{euros(item.price)}</strong></div>
                  <div className="qty">
                    {(cart[item.id] || 0) > 0 && <><button aria-label={`Retirer un ${item.name}`} onClick={() => changeQty(item.id, -1)}>−</button><span>{cart[item.id]}</span></>}
                    <button aria-label={`Ajouter un ${item.name}`} className="add" onClick={() => changeQty(item.id, 1)}>+</button>
                  </div>
                </article>
              ))}
            </section>
          </main>
        )}

        {page === 'family' && (
          <main className="content">
            <div className="family-hero">
              <span className="pill">✨ OFFRES EXCLUSIVES</span>
              <h1>Votre Espace Famille</h1>
              <p>Vos menus sont conservés. Profitez maintenant de tarifs réservés aux familles !</p>
            </div>
            <div className="discount-card">
              <div><p className="eyebrow">AVANTAGE ACTIVÉ</p><h2>−15 % sur vos menus</h2><p>La remise se calcule directement dans votre panier.</p></div>
              <span className="discount-number">−15%</span>
            </div>
            <div className="section-heading"><h2>Nos packs Famille</h2><p>Ajoutez uniquement ce dont vous avez envie.</p></div>
            <div className="packs-grid">
              {PACKS.map(pack => (
                <article className="pack-card" key={pack.id}>
                  <div className="pack-emoji">{pack.emoji}</div>
                  <h3>{pack.name}</h3>
                  <p>{pack.subtitle}</p>
                  <div className="prices"><del>{euros(pack.regular)}</del><strong>{euros(pack.family)}</strong></div>
                  <div className="pack-qty"><button onClick={() => changePack(pack.id, -1)} disabled={!packs[pack.id]}>−</button><b>{packs[pack.id] || 0}</b><button onClick={() => changePack(pack.id, 1)}>+</button></div>
                </article>
              ))}
            </div>
            <button className="back-link" onClick={() => setPage('catalogue')}>← Ajouter d'autres menus</button>
          </main>
        )}

        {page === 'cart' && (
          <main className="content">
            <div className="page-title"><p className="eyebrow">ÉTAPE 2 · RÉCAPITULATIF</p><h1>Mon panier</h1><p>Vérifiez votre commande avant de payer.</p></div>
            {!totalQty && <div className="empty"><span>🛒</span><h2>Votre panier est vide</h2><button className="secondary" onClick={() => setPage('catalogue')}>Choisir mes menus</button></div>}
            {menuEntries.map(item => (
              <article key={item.id} className="cart-row"><span className="cart-emoji">{item.emoji}</span><div className="cart-info"><strong>{item.name}</strong><small>{euros(item.price)} / menu</small></div><div className="cart-controls"><button onClick={() => changeQty(item.id, -1)}>−</button><span>{cart[item.id]}</span><button onClick={() => changeQty(item.id, 1)}>+</button></div><b>{euros(item.price * cart[item.id])}</b></article>
            ))}
            {packEntries.map(item => (
              <article key={item.id} className="cart-row"><span className="cart-emoji">{item.emoji}</span><div className="cart-info"><strong>{item.name}</strong><small>{euros(family && eligible ? item.family : item.regular)} / pack</small></div><div className="cart-controls"><button onClick={() => changePack(item.id, -1)}>−</button><span>{packs[item.id]}</span><button onClick={() => changePack(item.id, 1)}>+</button></div><b>{euros((family && eligible ? item.family : item.regular) * packs[item.id])}</b></article>
            ))}
            {family && !eligible && <div className="notice warning">La remise Famille nécessite au moins un menu adulte et un menu enfant.</div>}
            {family && eligible && <div className="notice success">✓ Mode Famille actif · Vos réductions sont appliquées.</div>}
            {totalQty > 0 && <div className="summary">
              <div><span>Sous-total des menus</span><b>{euros(menuTotal)}</b></div>
              {family && eligible && <div className="saved"><span>Remise Famille (15 %)</span><b>−{euros(discount)}</b></div>}
              {packEntries.length > 0 && <div><span>Packs</span><b>{euros(packTotal)}</b></div>}
              {savingsOnPacks > 0 && <p className="saved">Vous économisez aussi {euros(savingsOnPacks)} sur les packs !</p>}
              <div className="total"><strong>Total</strong><strong>{euros(total)}</strong></div>
            </div>}
            <button className="back-link" onClick={() => setPage(family ? 'family' : 'catalogue')}>← {family ? "Retour aux offres Famille" : "Ajouter d'autres produits"}</button>
          </main>
        )}

        {page === 'payment' && (
          <main className="content payment">
            <p className="eyebrow">ÉTAPE 3 · PAIEMENT</p><h1>Paiement</h1><p>Choisissez votre moyen de paiement.</p>
            <div className="payment-choice">💳 <span>Carte bancaire ou sans contact</span><span className="check">✓</span></div>
            <div className="summary"><div className="total"><strong>À régler</strong><strong>{euros(total)}</strong></div></div>
            <p className="fineprint">Prototype étudiant : aucun paiement réel n'est effectué.</p>
          </main>
        )}

        {page === 'done' && (
          <main className="done"><div className="done-icon">✓</div><h1>Commande validée !</h1><p>Merci pour votre commande. Bon appétit !</p><div className="confirmation">Commande n° F128<br /><strong>En préparation</strong></div><button className="primary" onClick={reset}>Nouvelle commande</button></main>
        )}

        {page !== 'welcome' && page !== 'done' && <footer className="footer">
          <div><span>Total de la commande</span><strong>{euros(total)}</strong></div>
          {page === 'catalogue' && <button className="primary" onClick={() => setPage('cart')} disabled={totalQty === 0}>Voir mon panier →</button>}
          {page === 'family' && <button className="primary" onClick={() => setPage('cart')}>Voir mon panier →</button>}
          {page === 'cart' && <button className="primary" onClick={() => setPage('payment')} disabled={totalQty === 0}>Passer au paiement →</button>}
          {page === 'payment' && <button className="primary" onClick={() => setPage('done')}>Confirmer (simulation) →</button>}
        </footer>}

        {showOffer && !family && <div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-labelledby="offer-heading">
          <div className="modal-icon">👨‍👩‍👧</div><p className="eyebrow">UNE OFFRE POUR VOUS</p><h2 id="offer-heading">Vous commandez en famille ?</h2>
          <p>Votre panier contient un menu adulte et un menu enfant. Profitez d'avantages réservés aux familles.</p>
          <div className="modal-deals"><div><strong>−15 %</strong><span>sur les menus éligibles</span></div><div><strong>6 €</strong><span>le pack desserts (au lieu de 8 €)</span></div></div>
          <p className="modal-note">Votre panier reste inchangé. Cette offre est entièrement facultative.</p>
          <button className="primary" onClick={acceptFamily}>Activer le mode Famille →</button>
          <button className="secondary" onClick={declineFamily}>Non merci, continuer normalement</button>
        </div></div>}
      </div>
    </div>
  );
}
