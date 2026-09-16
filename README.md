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
