# Dati del sito

- `games`: una riga per ogni partita del campionato. Per le partite senza il Nerone bastano risultato, data e squadre.
- `player-stats`: una riga per ogni giocatore del Nerone impiegato nella partita. I campi `three_pointers_made`, `two_pointers_made` e `free_throws_made` indicano rispettivamente T3, T2 e tiri liberi realizzati.
- `rosters.csv`: collega un giocatore a campionato, stagione, numero e ruolo.
- `players`: un file YAML per giocatore. Il percorso sportivo resta discorsivo dentro `bio`; non esiste un campo `career`.
- `content/news`: articoli in Markdown.
- `home-social.json`: i tre post Instagram promossi nella home, mostrati nell'ordine indicato nel file.

Gli ID non vanno cambiati dopo la pubblicazione, perché collegano pagine, statistiche e notizie nel tempo.
