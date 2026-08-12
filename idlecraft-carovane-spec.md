# IdleCraft — Sistema Carovane e Logistica

Spec di implementazione. Tutti i numeri in questo documento sono **valori di partenza tunabili**,
non costanti sacre: devono finire in un file di config, non sparsi nel codice.

---

## 0. Prima di scrivere codice

1. Esplora il repo e riporta: dove vivono lo stato di gioco, il salvataggio, il game loop,
   la definizione degli item, gli storage dei luoghi e la valuta.
2. Adatta nomi, stile e pattern a quelli già presenti nel progetto. Non introdurre nuove
   librerie o nuovi paradigmi di state management.
3. Fai queste domande prima di procedere se la risposta non è deducibile dal codice:
    - Il giocatore può trasportare risorse addosso quando si sposta tra luoghi?
    - Gli storage dei luoghi hanno una capacità massima? Espressa come?
    - Come si chiama la valuta di prestigio e dove è gestita?
    - Esiste già un sistema di azioni temporizzate con risoluzione offline da riusare?
4. Presenta un piano prima di modificare file.

---

## 1. Obiettivo

Il giocatore ha storage separati per luogo (stile EVE) e si sposta in pochi secondi.
Le carovane sono il modo di spostare risorse **in massa** tra luoghi.

Principio di design da rispettare in ogni decisione:

> **La velocità compra latenza. Gli slot comprano throughput.**
> Una carovana veloce non sposta più roba all'ora, la fa arrivare prima — e costa molto di più.

**Non c'è capacità massima.** Una carovana può portare qualsiasi quantità: il volume si paga
in oro e, in misura molto minore, in tempo. Questo evita di dover calibrare un tetto che
sarebbe sempre sbagliato per qualcuno (il giocatore che entra una volta al giorno accumula
ordini di grandezza più risorse di quello che gioca a sessioni brevi).

---

## 2. Modello di dominio

### Volume degli item

Ogni item ha un campo `volume` (float), separato dal valore economico.
Default per categoria se non specificato:

| Categoria                          | Volume |
| ---------------------------------- | ------ |
| Grezzo (minerale, legna, pesce)    | 1.0    |
| Raffinato (lingotti, assi, filati) | 0.3    |
| Finito (equipaggiamento, pozioni)  | 0.1    |

Questo rende **raffinare prima di spedire** una decisione reale e spinge il giocatore a
costruire catene di produzione locali. È intenzionale.

### Entità

```
Route          { fromId, toId, baseMinutes }
CaravanTier    { id, name, speed, tariffFlat, tariffPct, unlock }
Shipment       { id, tierId, fromId, toId, cargo: Map<itemId, qty>,
                 totalVolume, cargoValue, departAtMs, arriveAtMs,
                 costPaid, status: 'in_transit' | 'delivered' | 'returning' }
SharedStorage  { slots: Array<{ itemId | null, quantity }> }
```

`Route` è bidirezionale. Se il gioco ha già un grafo dei luoghi con distanze, riusalo e
deriva `baseMinutes` da lì invece di duplicare i dati.

### Tier di carovana

| id               | Nome            | speed | tariffFlat | tariffPct | Sblocco                                |
| ---------------- | --------------- | ----- | ---------- | --------- | -------------------------------------- |
| `heavy_cart`     | Carri pesanti   | 0.33  | 0.5        | 0.002     | iniziale                               |
| `standard`       | Carovana        | 1.0   | 2          | 0.005     | iniziale                               |
| `fast_courier`   | Corriere veloce | 3.0   | 8          | 0.02      | progressione                           |
| `arcane_courier` | Corriere arcano | 25.0  | —          | —         | prestigio, paga in valuta di prestigio |

Regola che tiene insieme la tabella: **ogni salto di tier è 3x velocità e 4x costo per unità
di volume.** Se aggiungi tier, mantieni la progressione geometrica.

### Rotte

`baseMinutes` è il tempo per il tier `standard` con carico di riferimento:

| Tipo    | baseMinutes |
| ------- | ----------- |
| Vicina  | 20          |
| Media   | 40          |
| Lontana | 80          |

---

## 3. Formule

```
VOLUME_REF     = 1000
TIME_EXPONENT  = 0.3

totalVolume = Σ (item.volume × qty)
cargoValue  = Σ (item.baseValue × qty)

durationMin = (route.baseMinutes / tier.speed)
              × max(1, (totalVolume / VOLUME_REF) ^ TIME_EXPONENT)

distanceFactor = route.baseMinutes / 20
cost = distanceFactor × (totalVolume × tier.tariffFlat + cargoValue × tier.tariffPct)
```

**Sul tempo:** l'esponente 0.3 significa che ogni 10x di carico il tempo raddoppia.
50x carico → ~3,3x tempo. Chi entra una volta al giorno spedisce un carico enorme e aspetta
qualche ora: per lui il tempo è gratis. Chi gioca attivamente sposta carichi piccoli e resta
vicino al tempo base. I due profili si bilanciano da soli.

**Sul costo:** la componente `tariffPct` sul valore del carico esiste per evitare che a fine
partita, con l'inflazione dell'oro, spedire diventi gratis. Sul carico cheap domina
`tariffFlat`, sui carichi preziosi domina la percentuale.

**Sanity check da mettere in un test:** carovana `standard`, rotta vicina, 50.000 volume →
~66 minuti. Con `heavy_cart` → ~200 minuti a un quarto del costo.

---

## 4. Regole comportamentali

Queste sono le parti che, se sbagliate, si notano solo dopo settimane di gioco. Trattale come
requisiti, non come suggerimenti.

- **La merce lascia l'origine alla partenza**, non all'arrivo. Il costo in oro si paga alla
  partenza. Niente duplicazione possibile.
- **Risoluzione offline obbligatoria.** Le spedizioni si salvano con timestamp assoluti
  (epoch ms), mai con contatori di tick o frame. Al caricamento, `resolveShipments(now)`
  risolve in ordine cronologico tutte quelle arrivate. Deve funzionare identico che il gioco
  sia stato chiuso 5 minuti o 3 giorni.
- **Clock che va indietro:** se `now < lastTickMs`, non risolvere nulla e riallinea. Non
  crashare, non regalare risorse.
- **Consegna in banchina.** La merce arriva in un buffer `dock` del luogo di destinazione che
  **non conta** verso la capacità di storage. Il giocatore scarica manualmente. Non perdere
  mai item per overflow.
- **Slot paralleli.** `caravanSlots` (default 2) limita le spedizioni contemporanee. È la leva
  di progressione principale, più della velocità.
- **Richiamo.** Una spedizione in volo può essere richiamata: genera un viaggio di ritorno di
  durata pari al tempo già trascorso, la merce torna all'origine, l'oro non si rimborsa.
- **Nessuna perdita casuale di carico.** Mai. Niente RNG distruttivo sulle spedizioni.

---

## 5. Storage condiviso (prestigio)

Sbloccabile con valuta di prestigio. Accessibile identico da ogni luogo.
NON DA IMPLEMENTARE ORA; PER SVILUPPI FUTURI

- Limitato **per slot, non per quantità**: 4 slot iniziali, espandibili fino a 12 con altra
  valuta di prestigio (costo crescente per slot).
- Ogni slot è vincolato a un solo `itemId` e ne contiene quantità illimitata.
- Cambiare l'item di uno slot richiede che lo slot sia vuoto.

Il vincolo sugli slot è deliberato: serve a impedire che lo storage condiviso renda le
carovane contenuto morto. Il giocatore ci mette le poche cose che vuole sempre disponibili
ovunque; il bulk continua a viaggiare in carovana.

---

## 6. Fasi

Implementa una fase alla volta e fermati per la revisione alla fine di ognuna.

**Fase 1 — Core** (nessuna UI)
Config, campo `volume` sugli item, entità, formule, `dispatch()`, `resolveShipments()`,
`recall()`, persistenza nel salvataggio, migrazione dei salvataggi esistenti.
Logica pura e testabile, separata dal rendering.

**Fase 2 — UI**
Schermata spedizione: scelta destinazione, selezione carico, scelta tier con anteprima live di
tempo e costo. Lista spedizioni in volo con timer e pulsante richiamo. Banchina con
"scarica tutto". Un pulsante **"spedisci tutto"** che precarica l'intero storage.

**Fase 3 — Prestigio e automazione**
Storage condiviso a slot. Rotte permanenti: una spedizione che riparte da sola ogni N minuti
con un carico definito, costo di mantenimento in oro al giorno.

---

## 7. Test richiesti (Fase 1)

- Il volume totale è calcolato correttamente da un cargo misto.
- Carico sotto `VOLUME_REF` → durata pari al tempo base (il `max(1, …)` fa da pavimento).
- 10x carico → ~2x durata; 50x carico → ~3,3x durata.
- Tempo e costo scalano correttamente tra i tier (3x velocità, 4x costo).
- La merce sparisce dall'origine alla partenza e compare in banchina all'arrivo.
- Oro insufficiente → dispatch rifiutato, nessuno stato modificato.
- **Offline:** tre spedizioni con arrivi scaglionati, salvataggio, caricamento 3 giorni dopo →
  tutte consegnate, in ordine, nessuna duplicazione.
- Clock all'indietro → nessuna risoluzione, nessun crash.
- Richiamo a metà viaggio → merce all'origine dopo la durata corretta.
- Round-trip di salvataggio con spedizioni in volo.

---

## 8. Vincoli

- Nessuna nuova dipendenza esterna.
- Nessun refactor di sistemi esistenti non richiesto in questa spec.
- Tutti i numeri della sezione 3 e delle tabelle in un unico file di config.
- Non toccare la logica di viaggio del giocatore.
