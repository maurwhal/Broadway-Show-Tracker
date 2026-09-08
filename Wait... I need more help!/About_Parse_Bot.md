# About Parse.bot (The API We Use)

## What is Parse.bot?

[Parse.bot](https://parse.bot/) is a web scraping API that automatically extracts data from websites and returns it as structured JSON. We use it to pull Broadway show information.

## Our Data Source: Playbill.com

This project scrapes show data from **[Playbill.com](https://playbill.com/)**, specifically:
- [Now on Broadway](https://playbill.com/article/whats-currently-playing-on-broadway)
- [Upcoming on Broadway](https://playbill.com/shows/upcoming-broadway)

Parse.bot handles the scraping so we don't have to. The actual data lives on Playbill — Parse.bot just automates extracting it.

## The Endpoint We Use

https://api.parse.bot/scraper/cb718659-681b-4a4c-ac0f-8fe7b8d0618e/list_broadway_shows?status=all


**Parameters:**
- `status=all` — returns both current and upcoming shows
- `status=current` — current shows only
- `status=upcoming` — upcoming shows only

**Response includes ~50 shows total:**
- ~25 currently running on Broadway
- ~25 upcoming productions

## API Call Example

```bash
curl -X GET 'https://api.parse.bot/scraper/cb718659-681b-4a4c-ac0f-8fe7b8d0618e/list_broadway_shows?status=all' \
  -H 'X-API-Key: YOUR_API_KEY'
```

## Data Structure

Each show includes:
- `theater` — Venue name
- `title` — Show name
- `status` — "current" or "upcoming"
- `closing_date` — ISO date when show closes (null if open-ended)
- `first_preview_date` — ISO date for upcoming shows
- `opening_date` — Date for shows still in previews

## How We Use It

The `BWAY41.gs` script calls this endpoint once per week and populates:
- **Column F (Current Show):** Show currently playing at each theatre
- **Column G (Coming Soon):** Upcoming shows with first preview dates

Without this API, you'd manually copy show info every week from Playbill.

## Getting Your API Key

1. Go to [Parse.bot](https://parse.bot/)
2. Sign up (free account)
3. Click your profile → Settings → API Keys
4. Copy your full API key
5. Paste into `BWAY41.gs`: `const API_KEY = 'YOUR_API_KEY';`

## What If Parse.bot Goes Down?

Parse.bot is a dependency for automation. If it's unavailable:

**Short term:**
- Columns F & G won't auto-update
- Manually copy data from [Playbill.com](https://playbill.com/) instead
- The rest of your tracker (columns A-E, H) still works

**Long term:**
You can swap in an alternative data source by editing the `fetchBroadwayData()` function in `BWAY41.gs`:

### Alternative Data Sources

- **[Broadway.org](https://www.broadway.org/)** — Official Broadway League site (may have API)
- **[IBDB](https://www.ibdb.com/)** — Internet Broadway Database (comprehensive, historical)
- **Manual updates** — Copy-paste from Playbill weekly if needed

## Why Parse.bot?

- ✅ **Free** — no cost to get started
- ✅ **Simple** — one API call per week
- ✅ **Reliable** — Playbill data is consistent
- ✅ **No coding needed** — you don't need to build a scraper

It's a convenient middle ground between full manual updates and building custom infrastructure.

## Questions?

If Parse.bot stops working or you want to use different data, you can:
1. Fork this project and modify `fetchBroadwayData()` in `BWAY41.gs`
2. Point it to a different API endpoint
3. Keep everything else the same

The rest of your Broadway tracker will keep working regardless.
