# Option Probability Calculator

Calculateur de probabilités d'expiration OTM/ITM et de prix théorique d'options, basé sur le modèle Black-Scholes.

## Fonctionnalités

- Calcul de la probabilité d'expiration OTM et ITM.
- Estimation du prix théorique d'un CALL ou PUT.
- Prise en compte de la volatilité implicite (IV).
- Prise en compte du taux sans risque et du rendement du dividende.
- Calcul automatique à chaque modification des paramètres.

## Technologies

- React
- JavaScript
- Vite
- Bootstrap 5

## Installation

Cloner le repository :

```bash
git clone https://github.com/charly010/option-probability-calculator.git
cd option-probability-calculator
```

Installer les dépendances :

```bash
npm install
```

Lancer le serveur de développement :

```bash
npm run dev
```

Compiler le projet :

```bash
npm run build
```

## Déploiement

Le projet est conçu pour être hébergé gratuitement sur GitHub Pages.

Le déploiement est automatisé via GitHub Actions à chaque mise à jour de la branche `main`.

## Modèle mathématique

Les calculs reposent sur le modèle Black-Scholes et une approximation de la fonction de répartition de la loi normale.

Les résultats sont des estimations théoriques et ne constituent pas des prévisions de marché ni des conseils en investissement.
