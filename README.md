# Broadway-Show-Tracker

A Google Sheets and Google Calendar automation tool for tracking Broadway shows. Pull live show data from APIs, log personal attendance, and automatically sync events to your Google Calendar.

## Features

- 📋 **Templated Google Sheet** — Pre-built tracking sheet for all 41 Broadway theatres
- 📅 **Automatic Calendar Sync** — Adds show events to Google Calendar (3-hour duration, public, yellow)
- 🎭 **Live Show Data** — Pulls current and upcoming Broadway shows from Parse.bot API
- ✅ **Attendance Tracking** — Mark theatres as visited, log shows seen, track repeat visits
- 🔄 **Fully Automated** — Daily/weekly triggers keep your data fresh

## Quick Start

### 1. Copy the Template

[**Open the Broadway-Show-Tracker Template →**](https://docs.google.com/spreadsheets/d/1JSkcN7KjiUQ6ezgjsCS0jrn7aD6MFKuXKpBRxqvqZnU/edit?usp=sharing)

Then:
- Click **File → Make a copy**
- Rename it to your preference
- You now have your own editable version

### 2. Get a Parse.bot API Key

- Go to [Parse.bot](https://parse.bot)
- Sign up (free)
- Navigate to Account Settings → API Keys
- Copy your full API key (you'll need this in step 4)

### 3. Set Up Google Apps Script

**Create the project:**
- Open your copied Google Sheet
- Click **Extensions → Apps Script**
- Delete the default `myFunction()`

**Add three script files:**
- `Google_Calendar_Update.gs` — Calendar event creation
- `Sheet_BWAY_Update.gs` — Master sheet updates
- `BWAY41.gs` — API data sync

Copy each script from this repository.

### 4. Customize and Deploy

**Replace placeholders in each script:**

```javascript
// In Google_Calendar_Update.gs and Sheet_BWAY_Update.gs:
const ss = SpreadsheetApp.openById('1JSkcN7KjiUQ6ezgjsCS0jrn7aD6MFKuXKpBRxqvqZnU');

// In BWAY41.gs:
const apiKey = 'YOUR_API_KEY';
const url = 'https://api.parse.bot/scraper/YOUR_SCRAPER_ID/list_broadway_shows?status=all';
```

Find these values:
- **Spreadsheet ID**: In your sheet's URL — `docs.google.com/spreadsheets/d/**1ABC123xyz**/edit`
- **API Key**: From Parse.bot account settings (get your own!)
- **Scraper ID**: From Parse.bot (default: `cb718659-681b-4a4c-ac0f-8fe7b8d0618e`)

### 5. Set Up Triggers

In Apps Script, click **Triggers** (clock icon) and create three:

| Function | Schedule | Time |
|----------|----------|------|
| `createShowEvents` | Daily | 12:00 AM |
| `updateShowsFromBookedToMaster` | Daily | 12:15 AM |
| `updateCurrentAndUpcomingShows` | Weekly | Your choice |

### 6. Start Tracking!

- Add shows to the **"Shows Booked"** tab with date, time, and theatre
- Events auto-create in your Google Calendar
- Master sheet updates daily with your attendance history

## How It Works

### The Three Scripts

**Google_Calendar_Update.gs** — `createShowEvents()`
- Reads shows from "Shows Booked" tab
- Creates Google Calendar events (3 hours, yellow, public)
- Marks each row as "Created" to prevent duplicates
- Runs daily at midnight

**Sheet_BWAY_Update.gs** — `updateShowsFromBookedToMaster()`
- Syncs your personal show attendance to "BWAY 41" master sheet
- Checks Column C (2026) when date passes (day after show)
- Checks Column D (Ever) once per theatre
- Populates Column E (shows seen) and Column H (multiples)
- Runs daily at 12:15 AM

**BWAY41.gs** — `updateCurrentAndUpcomingShows()`
- Fetches live Broadway show data from Parse.bot API
- Populates Column F (Current Show) and Column G (Coming Soon)
- Overwrites weekly with fresh data
- Runs weekly on your schedule

### Sheet Structure

**BWAY 41 Tab** — Main tracker

| Col | Name | Purpose |
|-----|------|---------|
| A | Address | Theatre address |
| B | Theatre | Theatre name |
| C | 2026 | Seen as NYC resident (auto-checked after date) |
| D | Ever? | Ever seen here (auto-checked once) |
| E | Show(s) seen | List of shows you've seen (auto-populated) |
| F | Current Show | What's playing now (auto-updated weekly) |
| G | Coming Soon | Upcoming shows (auto-updated weekly) |
| H | Multiples | Shows you've seen 2+ times (auto-populated) |

**Shows Booked Tab** — Personal attendance log

| Col | Name | Purpose |
|-----|------|---------|
| A | Address | Theatre address |
| B | Theatre | Theatre name |
| C | Show | Show name |
| D | Date | Date of performance |
| E | Time | Show time (e.g., 7:00 PM) |
| F | Ticket Source | Where you bought tickets |
| L | Created | Auto-marked when calendar event created |

## Reference

See template structure in CSV format:
- [`Broadway-Show-Tracker_Template - BWAY 41.csv`](templates/Broadway-Show-Tracker_Template%20-%20BWAY%2041.csv)
- [`Broadway-Show-Tracker_Template - Shows Booked.csv`](templates/Broadway-Show-Tracker_Template%20-%20Shows%20Booked.csv)

## FAQ

**Q: Do I need to manually update current/upcoming shows?**
A: No! Columns F and G update automatically every week from the Parse.bot API.

**Q: What if a show gets rescheduled?**
A: Just update the date in Shows Booked. The script will check the new date and update accordingly.

**Q: Can I change when triggers run?**
A: Yes! Click Triggers and edit the schedule. Just avoid running all three at the same time.

**Q: What if the API goes down?**
A: Your sheet continues working. Columns F/G will show old data until the API is back.

**Q: Can I share this with friends?**
A: Absolutely! Each person should get their own Parse.bot API key and customize the placeholders in their copy.

**Q: Why does Column C check the day after the show?**
A: So you can mark it complete the next day. If you see a show on October 25th, the checkbox activates October 26th.

## Troubleshooting

**Calendar events not creating?**
- Verify "Shows Booked" sheet exists and has data
- Check that Column L is empty for new shows
- Check Apps Script Executions log for errors

**Master sheet not updating?**
- Confirm spreadsheet ID is correct
- Check that theatres in "Shows Booked" match theatre names in "BWAY 41" exactly
- Review Executions log for errors

**API data not showing?**
- Verify your API key is valid (copy the full key from Parse.bot)
- Check that the Parse.bot scraper URL is correct
- Review Apps Script Executions for fetch errors

**Triggers not running?**
- Go to Triggers and confirm they're enabled
- Check Authorization — approve when prompted
- Review Executions log for failures

## Limitations

- Pulls data from Parse.bot (Broadway-specific)
- Updates run on Google's schedule — may be a few minutes late
- Maximum 41 theatres (Broadway theatres only)
- Requires a free Parse.bot account

## Credits

Built with:
- [Google Apps Script](https://script.google.com)
- [Google Calendar API](https://developers.google.com/calendar)
- [Parse.bot](https://parse.bot) for Broadway data

## License

MIT License — feel free to use, modify, and share!

---

**Found a bug or have a suggestion?** Open an issue or submit a pull request!
