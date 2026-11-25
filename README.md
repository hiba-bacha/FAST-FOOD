# FAST-FOOD — Mode Famille

Prototype React d'une borne tactile de commande pour le projet d'adaptation des IHM.

## Parcours

1. Accueil et catalogue standard : choisir les menus adultes et enfants.
2. À partir d'au moins **un menu adulte et un menu enfant**, une proposition facultative apparaît une seule fois.
3. **Accepter** : ouvrir un Espace Famille distinct, avec **15 % sur les menus** et des packs à prix réduit (desserts **8 € → 6 €**, boissons **7 € → 5 €**).
4. **Refuser** : garder le panier et poursuivre en mode standard sans nouvelle relance.
5. Panier, récapitulatif, paiement simulé et confirmation.

Les packs sont ajoutés **uniquement par action du client**. Si le panier ne contient plus de menu adulte + enfant, les prix et remises se recalculent. Il s'agit de tarifs fictifs utilisés dans le prototype.

## Lancement

Installer Node.js, puis dans le dossier du projet :

```bash
npm install
npm run dev
```

Ouvrir ensuite `http://localhost:5173`.

## Tester sur iPhone

- Connecter l'iPhone et l'ordinateur au **même Wi-Fi**.
- Lancer `npm run dev` sur l'ordinateur.
- Sur l'iPhone, ouvrir Safari à l'adresse **Network** indiquée par Vite (ex. `http://192.168.1.20:5173`).
- Si l'accès échoue, vérifier le pare-feu et que le serveur est accessible depuis le réseau local.

## Développement

```bash
npm run build
```

Le paiement et le numéro de commande sont simulés : aucun achat réel. Interface responsive pour borne et smartphone.
