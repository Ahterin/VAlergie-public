# Vojteska Food Profile

Static one-person webpage with:
- allergies
- safe foods
- disliked foods
- hover tooltip with additional info
- CZ/EN language switch
- dark mode

## Data setup (simple, not scalable by design)

`people.json` is the only food data source.
It contains one profile split into three lists:
- `allergies`
- `safeFoods`
- `dislikes`

Each item has:
- `id`
- `name.cs` + `name.en`
- `info.cs` + `info.en`

Example:

```json
{
  "allergies": [
    {
      "id": "lepek",
      "name": { "cs": "lepek", "en": "Gluten" },
      "info": { "cs": "...", "en": "..." }
    }
  ],
  "safeFoods": [],
  "dislikes": []
}
```

`locales/*.json` now holds only UI labels (not food data).

## Run

```bash
python3 -m http.server 8000 --bind 0.0.0.0
```

Open `http://localhost:8000`.
