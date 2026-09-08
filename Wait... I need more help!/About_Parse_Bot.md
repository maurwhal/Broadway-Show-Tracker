# About Parse.bot (The API We Use)

## What is Parse.bot?

[Parse.bot](https://parse.bot/) is a web scraping API that turns websites into structured data. Instead of manually copying show information, Parse.bot automatically pulls data from Broadway websites and formats it for us.

## How Broadway-Show-Tracker Uses Parse.bot

In this project, we use Parse.bot to:

**Automatically fetch current Broadway shows:**
- Pulls what show is playing at each theatre RIGHT NOW
- Updates every week so your sheet stays current

**Automatically fetch upcoming shows:**
- Pulls what shows are opening soon
- Includes opening dates
- Updates weekly

**Populates columns F & G:**
- Column F: "Current Show" — what's playing now (or "EMPTY")
- Column G: "Coming Soon" — upcoming shows with dates

Without Parse.bot, you'd have to manually copy show info every week. Now it happens automatically.

## Getting Your Parse.bot API Key

1. Go to [Parse.bot](https://parse.bot/)
2. Sign up (free account)
3. Go to Account Settings → API Keys
4. Copy your full API key
5. Paste it into `BWAY41.gs` where it says `YOUR_API_KEY`

That's it! You're connected.

## Why Parse.bot?

- **No coding needed** — Parse.bot handles the scraping
- **Free** — works with a free account
- **Reliable** — Broadway data updates automatically
- **Simple** — one API call per week

The script runs weekly and keeps your sheet fresh with live Broadway data.
