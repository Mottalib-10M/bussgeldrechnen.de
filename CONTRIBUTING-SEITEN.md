# Ajouter ou étoffer une page de Bußgeldrechnen (de-verkehr)

Notice pour les agents qui prolongent le site. À lire en entier avant d'écrire une ligne, avec `~/Documents/GitHub/RECETTE-SITE.md` : §0, §3, §6, §7, §9.3, §11, §17.4, §21, §26.

## Principe

Une page = **un fichier** :

- `src/content/guides/<id>.ts` pour un guide ;
- `src/content/outils/<id>.ts` pour une page outil (`tool:`).

Le fichier porte tout, en allemand (`de`) et en anglais (`en`) :

- slug, titres, description ;
- H1, chapeau, bloc citable, FAQ, corps ;
- sources, mini-simulateur, pages liées.

Le cœur du site lit ces fichiers seul : routes (`src/i18n/routes.ts`), menus et pied de page (`src/i18n/nav.ts`, groupés par `group`), sitemap, hreflang, schémas, cartes « pages associées ». **Ne modifiez aucun fichier du cœur pour ajouter une page.** Modèle : `src/content/guides/fahrverbot.ts`. Copiez sa structure, jamais ses phrases.

Un nouveau mini-simulateur = un fichier `src/lib/minis/<kind>.ts`, chargé automatiquement. Il appelle le moteur (`src/lib/engine/`), jamais un calcul refait à côté. Usines communes : `_speed.ts` (pages de vitesse) et `_kit.ts` (`T`, `eur`, `eur2`, `num`, `yn`, `fvTxt`, `probeTxt`).

## Les données

| Fichier | Contenu | Origine |
|---|---|---|
| `data-src/bkatv.xml` | Texte officiel de la Bußgeldkatalog-Verordnung | `https://www.gesetze-im-internet.de/bkatv_2013/xml.zip` |
| `src/data/bkat-2026.json` | 596 numéros (texte, Regelsatz, Fahrverbot, points, classe A/B, références) + tableaux 1, 2 et 4 | **généré** par `python3 scripts/bkat/build-bkat.py` |
| `src/data/bkat-slim.json`, `bkat-tables.json` | Version allégée pour le navigateur (534 numéros à montant fixe, tableaux) | **généré**, même script |
| `src/data/params-2026.json` | Frais § 107 OWiG, Toleranz, points, Probezeit, alcool, Kfz-Steuer, HU, GebOSt, vignette, **sources** | à la main, chaque valeur relue sur sa source |

Points et classes A/B : les listes de l'Anlage 13 et de l'Anlage 12 FeV sont codées dans `build-bkat.py` (`TWO`, `ONE`, `A_CLASS`). Le script s'arrête si un numéro cité manque au catalogue.

## Mise à jour annuelle (ou à chaque modification de la BKatV)

1. Retélécharger le zip de la BKatV, remplacer `data-src/bkatv.xml` et relancer `python3 scripts/bkat/build-bkat.py`.
2. Relire l'Anlage 13 et l'Anlage 12 FeV. Si elles ont changé, mettre à jour `TWO`, `ONE` et `A_CLASS`.
3. Relire chaque bloc de `params-2026.json` sur sa source, puis créer `params-<année>.json` et mettre à jour `retrieved_at`.
4. Rejouer la grille Kfz-Steuer contre le rechner du BMF : les cas sont dans `tests/engine.test.ts` (bloc « BMF »). Le script Playwright de relevé est décrit plus bas.
5. Lancer `npx vitest run`, puis tous les contrôles.

## Le moteur

| Fichier | Rôle |
|---|---|
| `src/lib/engine/bkat.ts` | Vitesse (Toleranz, Tabelle 1 a/b/c, Beharrlichkeit, Vorsatz), Abstand (Tabelle 2), Rotlicht, Handy, alcool et cannabis, Tabelle 4, frais § 107 OWiG, Verjährung, recherche plein texte |
| `src/lib/engine/punkte.ts` | Étapes § 4 StVG (avec l'abaissement de l'Abs. 6), séminaire, Tilgung § 29, Probezeit § 2a |
| `src/lib/engine/kfzsteuer.ts` | KraftStG : trois régimes Pkw, § 18 Abs. 4a, Elektro § 3d, moto, Wohnmobil, Anhänger, § 3a, arrondi § 11 Abs. 5 |
| `src/lib/engine/kosten.ts` | HU (Anlage VIII StVZO, GebOSt 413), retard (BKat 186.2), frais du permis (GebOSt), vignette autrichienne |

Tests : `tests/engine.test.ts` (cas lus dans les textes et 21 cas du BMF) et `tests/pages.test.ts` (forme des pages). Liste fermée des pages prévues : `tests/planned-ids.json`.

## Règles propres à ce site

- **Numéros pointés en allemand.** `typo-nbsp.mjs` réécrit « 132.3 » en « 132,3 » sur les pages allemandes, parce qu'il y voit une décimale.
  - Dans le **corps**, les numéros du catalogue et les numéros à trois chiffres de la GebOSt sont protégés par `markNr` (`src/lib/helpers.ts`), qui les place dans un `<code class="bkat-nr">`.
  - Dans le **titre, la description, le chapeau, le bloc citable et la FAQ** allemands, aucun numéro pointé : le test le refuse, car la FAQ passe aussi dans le JSON-LD.
  - Pour un décimal, utilisez `formatDecimal(x, 1, 'de')`.
- **Le mot « null »** dans un titre ou une description est pris pour un marqueur de gabarit par `check-snippets`. Écrivez « 0,0 Promille ».
- **Pas de conseil juridique individuel.** Information générale et calcul :
  - aucun « contestez », aucune recommandation d'avocat, d'expert ou d'auto-école ;
  - le Einspruch se présente comme un droit, avec son délai.
- **Pas de chiffre non vérifié.** Ne sont pas publiés, faute de source officielle lue :
  - le prix de la MPU (barème GebOSt supprimé) ;
  - le prix moyen d'une auto-école ;
  - l'Ersatzmaut autrichienne ;
  - une estimation d'alcoolémie à partir des boissons (aucune formule officielle).

  Les prix libres sont des **champs à remplir**.
- **Seuils pénaux de l'alcool** (0,3 et 1,1 ‰) : ils viennent de la jurisprudence. On les cite par la source de la police (`propk`), jamais comme texte de loi.

## Relevé BMF (Kfz-Steuer)

Le rechner du BMF (`https://www.bundesfinanzministerium.de/Web/DE/Service/Apps_Rechner/KfzRechner/KfzRechner.html`) se pilote avec Playwright en headless :

- `#ct1` : type de véhicule et période d'immatriculation, choisi par libellé ;
- `#ct3` : carburant (« Otto/Wankel » ou « Diesel ») ;
- `#ct4` : classe Euro avant 2009 ;
- `#ct6` : cylindrée, `#ct7` : CO2, `#ct9` : poids ;
- bouton `input[name=submitButton]`, résultat dans `#ResultView`.

Ce n'est pas le Chrome de l'éditeur : c'est un Chromium headless.

## Contrôles (tous à 0)

```bash
cd ~/Documents/GitHub/a-publier/Mottalib-10M/de-verkehr
export NODE_PATH=$(npm root -g):$PWD/node_modules
npm run build                       # inclut typo-nbsp et check-snippets (bloquant)
npx vitest run
python3 scripts/check-seo.py .
python3 scripts/check-trame.py .
python3 scripts/check-unique.py dist
python3 scripts/check-simulateurs.py .
python3 scripts/check-hreflang.py .
python3 scripts/check-anglais.py .
python3 scripts/check-regles.py .
python3 scripts/check-portefeuille.py .
python3 scripts/check-cookies.py .
python3 scripts/check-liens.py .
node scripts/check-legal.mjs .
node scripts/check-sources.mjs .
node scripts/check-contraste.mjs dist
node scripts/check-saisie.mjs dist --max=60
node scripts/check-nombres.mjs dist
node scripts/typo-nbsp.mjs dist --check
node scripts/check-url-propre.mjs dist
node scripts/check-layout.mjs dist > /tmp/layout-de-verkehr.log 2>&1 &
```

Serveur local : port 4402 (`npm run preview`). Pour l'arrêter : `lsof -ti tcp:4402 | xargs kill`.

## Ce qu'on ne fait pas

- Pas de dépôt GitHub, pas de push, pas de DNS sans validation de l'éditeur.
- Ne toucher ni à `_trame` ni à la RECETTE : les suggestions vont dans le compte rendu.
- Aucune identité personnelle : l'éditeur est Radif Partners.
- Aucun lien vers un autre site du portefeuille.
