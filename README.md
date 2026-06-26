# Centrage Aéroclub du Béarn

PWA de calcul de masse et centrage, installable sur écran d'accueil (mobile/tablette), hors-ligne.
Quatre aéronefs, répartis dans des onglets sur deux lignes groupées par type :

- **DR400** — F-HPYR · F-HAFF
- **DR401** — F-HCOY · F-HNDI

## Fonctions

- Saisie du chargement (CDB, passagers, bagages, carburant), modèle généralisé multi-réservoirs.
- Calcul par équilibre des moments : masse au décollage, CG, masse sans carburant (ZFW) et son CG.
- Verdict **Conforme / Hors limites** : enveloppe certifiée (point dans le polygone) + MTOW.
- Abaque graphique : enveloppe + point au décollage + point ZFW + vecteur carburant.
- Contrôle des limitations (MTOW, carburant par réservoir, bagages, bornes CG).
- Hors-ligne (service worker), installable, persistance des saisies par avion (localStorage).
- Impression A4 portrait sur une page (bouton « Imprimer »).
- Bannière de mise à jour qui glisse en haut quand une nouvelle version est disponible.

## Fichiers du repo

```
index.html                 application autonome (logo embarqué en base64)
sw.js                      service worker (hors-ligne + mises à jour)
manifest.json              identité PWA (Android / Chrome)
icon-192.png               icône Android + favicon
icon-512.png               icône Android
icon-maskable-512.png      icône Android maskable (crop rond/squircle)
apple-touch-icon.png       icône écran d'accueil iPhone/iPad (180×180, opaque)
README.md                  ce fichier
```

> `logo.png` n'est pas nécessaire (le logo de l'UI est embarqué dans `index.html`).
> Rôle des fichiers : `manifest.json` + `icon-*` servent **Android/Chrome** ; `apple-touch-icon.png`
> sert **iOS**. Garder tout le jeu assure le fonctionnement cross-plateforme (et le hors-ligne :
> `sw.js` met ces fichiers en cache via `caches.addAll`, qui échoue si l'un d'eux manque).

## Déploiement GitHub Pages

1. Déposer tous les fichiers ci-dessus à la racine du repo.
2. **Settings → Pages → Deploy from a branch → `main` → `/ (root)`**.
3. URL : `https://<utilisateur>.github.io/<repo>/`. Sur mobile : « Ajouter à l'écran d'accueil ».

> HTTPS requis pour le service worker et le manifest — GitHub Pages le fournit.
> Noms de fichiers **sensibles à la casse**.

## Mises à jour

À **chaque** modification de l'app : incrémenter la constante `CACHE` en haut de `sw.js`
(`centrage-dr400-vN` → `v(N+1)`). C'est le seul déclencheur : le navigateur ne compare que `sw.js`.
À l'ouverture, si une nouvelle version est détectée, une bannière propose « Recharger ».

Sur iOS, si une app déjà sur l'écran d'accueil reste bloquée sur une ancienne version : supprimer le
raccourci, rouvrir la page dans Safari, puis ré-ajouter à l'écran d'accueil. Ensuite la bannière prend le relais.

## Ajouter / corriger un avion

Tout est dans l'objet `AIRCRAFT` en haut du `<script>` de `index.html` : dupliquer un bloc et remplir
`empty` (masse/bras), `stations[]` (bras de chaque poste), `fuels[]` (réservoirs : bras, capacité, densité),
`limits` et les sommets `envelope`. Le moteur de calcul est commun ; aucune autre modification nécessaire.

## Avertissement

Outil d'aide à la préparation. Toujours recouper avec la fiche de pesée et de centrage officielle de l'aéronef.
