# Nerone Basket Anzio

Sito statico per risultati, classifiche, roster, calendario e notizie delle squadre Amatori UISP Platinum e Gold.

## Sviluppo locale

```powershell
cd site
npm install
npm run dev
```

Il sito viene pubblicato automaticamente su GitHub Pages quando le modifiche arrivano sul branch `main`.

I dati modificabili si trovano in `site/data`; gli articoli in `site/content/news`.

Le stagioni e i campionati disponibili sono dichiarati in `site/data/competitions.yaml`. I risultati sono salvati in `site/data/games/<stagione>/<campionato>.csv`; quando è disponibile una classifica ufficiale completa può essere inserita in `site/data/standings/<stagione>/<campionato>.csv` mantenendo l'ordine ufficiale.

Le classifiche dei play-in e i riferimenti alle partite del bracket sono salvati in `site/data/postseason/<stagione>/<campionato>.yaml`.

I loghi della stagione 2025/26 sono generati con `site/scripts/process-logos.py`: lo script elimina i margini trasparenti, centra ogni marchio in un quadrato e lo esporta in WebP.

## Graphic Generator 2026

Aprire `/graphic_generator_26` sul sito. La pagina non compare nella navigazione ed è esclusa dall'indicizzazione, ma l'URL da solo non limita l'accesso: se serve un'area davvero privata occorre aggiungere autenticazione a livello di hosting.

Il generatore crea in locale nel browser PNG 1080 × 1350 per Calendario, Week, Matchday e Risultato. Week può anche esportare una storia 1080 × 1920. Le foto caricate non vengono salvate sul server. In Week ogni GLASS ha una partita indipendente, selezionabile dal calendario o compilabile a mano, con titolo, squadre, loghi, campionato, data e indirizzo propri. La foto di sfondo può avere una leggera sfocatura; il soggetto viene isolato nel browser e ogni GLASS può stare davanti o dietro di lui. Si può anche caricare un PNG trasparente delle stesse dimensioni della foto originale. Lo scontorno automatico usa `@imgly/background-removal` (licenza AGPL); al primo utilizzo il browser scarica il modello e i file WASM di IMG.LY. Il calendario può importare le partite pubblicate nel sito o un CSV con colonne `club,date,time,opponent,at_home`; il pulsante «Scarica CSV sito» fornisce un file compatibile. Per mantenere leggibile un singolo post, il Calendario ospita al massimo sei appuntamenti per squadra.

Gli asset dei template sono in `site/public/assets/elementi_social/`; i sample sono esclusi da Git. I loghi mono bianchi disponibili per Risultato sono in `site/public/assets/teams/2026-27/mono_white/`. I font Google (Bebas Neue, Arimo, Anton, DM Sans e Archivo Black come alternativa ad Aharoni) richiedono la rete al primo caricamento.
