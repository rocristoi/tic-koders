# Tic.koders.ro — Rezultate

![Banner](https://tic.koders.ro/og.png)

Acest repository încarcă și afișează date din fișierul `src/assets/rezultate.json`. Mai jos este descrisă precis structura și rolul fiecărui câmp, ca referință pentru cei care vor să contribuie.

**Top-level** (în rădăcina JSON)
- `meta`: metadate generale (ex: `competition`, `year`, `classes`, `counties`).
- `subjects`: obiect care conține pentru fiecare clasă (cheie: `IX`, `X`, `XI`, `XII`, `C#`) linkuri către subiecte și bareme și lista de întrebări.
- `counties`: array de obiecte, fiecare reprezentând un județ cu `name`, `website` și `results`.

Exemplu sumar:

```json
{
	"meta": { "competition": "OJTI", "year": 2026, "classes": ["IX","X","XI","XII","C#"] },
	"subjects": { /* ... */ },
	"counties": [ /* ... */ ]
}
```

**`meta`**
- `competition`: numele competiției.
- `year`: anul.
- `classes`: array cu denumiri de clase/sectiuni.
- `counties`: listă textuală a județelor (opțional utilă pentru validări).

**`subjects`** (cheie: numele clasei)
- `subject_link`: URL către fișierul cu subiecte.
- `barem_link`: URL către barem.
- `questions`: array de obiecte `{ "id": <numar>, "max_score": <numar> }`.

Exemplu pentru o clasă:

```json
"IX": {
	"subject_link": "https://.../Subiect.pdf",
	"barem_link": "https://.../Barem.pdf",
	"questions": [ { "id": 1, "max_score": 10 }, { "id": 2, "max_score": 5 } ]
}
```

**`counties`** (array de județe)
Fiecare element are forma:

```json
{
	"name": "NumeJudet",
	"website": "https://link-catre-site-isj",
	"results": {
		"IX": { "initial": [ /* candidați */ ], "contestations": [ /* dacă există */ ] },
		"X": { "initial": [ /* ... */ ], "contestations": [] },
		/* etc. pentru XI, XII, C# */
	}
}
```

Unde un candidat are structura:

```json
{
	"candidate_id": "CJ_09_001",
	"scores": [ <valori pentru fiecare întrebare> ],
	"total": 63
}
```

- `scores` poate fi un array gol sau conține valori numerice; `total` poate fi numeric sau string (`"ABSENT"`) dacă candidatul nu a fost prezent.

## Cum contribui 

- Adaugă sau actualizează un obiect în array-ul `counties` din `src/assets/rezultate.json`, respectând structura de mai sus.
- Include `website` (sursa) și păstrează `results` împărțite pe clase cu `initial` și `contestations`.

Pași practici (git):

```bash
git clone https://github.com/<username>/tic.koders.ro.git
cd tic.koders.ro
git checkout -b add-rezultate-<nume-judet>
# editează src/assets/rezultate.json respectând structura
git add src/assets/rezultate.json
git commit -m "Add results for <Județ>"
git push origin add-rezultate-<nume-judet>
```

Deschide apoi un Pull Request în repository-ul original și descrie sursa datelor (link către `website` sau PDF). Menționează dacă datele sunt inițiale sau conțin si contestații.


