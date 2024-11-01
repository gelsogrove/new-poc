
- Creiamo l'embedding del PDF con Node.js e lo rappresentiamo come numeri e poi estrapoliamo il testo

- Salviamo l'embedding nel progetto (puoi avere più embedding se hai più PDF o sezioni).

Convertiamo la domanda dell'utente in numeri (embedding) per poterla confrontare.

Confrontiamo la domanda con gli embedding dei documenti usando un calcolo matematico (distanza coseno) per vedere se c'è una buona corrispondenza.

Se c'è una corrispondenza:
    Estriamo il testo rilevante dal PDF.
    Mandiamo questo testo all'API di OpenAI come contesto per generare una risposta.

Se non c'è una corrispondenza, rispondiamo con un messaggio generico come :
"Mi dispiace, non ho trovato informazioni rilevanti per questa domanda."
