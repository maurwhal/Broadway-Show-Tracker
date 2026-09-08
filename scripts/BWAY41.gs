// ⚠️ CUSTOMIZE: Replace with your spreadsheet ID
// Find your ID in the sheet URL: docs.google.com/spreadsheets/d/YOUR_ID/edit
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// ⚠️ CUSTOMIZE: Replace with your Parse.bot API key
// Get your key from Parse.bot account settings
const API_KEY = 'YOUR_API_KEY';

// ⚠️ NOTE: Tab names must match your sheet exactly
// If you rename tabs, update these values:
const MASTER_TAB = 'BWAY 41';

// Parse.bot API endpoint for Broadway shows
const API_URL = 'https://api.parse.bot/scraper/cb718659-681b-4a4c-ac0f-8fe7b8d0618e/list_broadway_shows?status=all';

______________________________________________________________________________________________________________________

function updateCurrentAndUpcomingShows() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const masterSheet = ss.getSheetByName(MASTER_TAB);
    
    if (!masterSheet) {
      Logger.log(`Error: "${MASTER_TAB}" sheet not found`);
      return;
    }
    
    // Fetch Broadway data
    const broadwayData = fetchBroadwayData();
    
    if (!broadwayData) {
      Logger.log('Error: Could not fetch Broadway data');
      return;
    }
    
    // Create maps
    const currentShowMap = {};
    const upcomingShowMap = {};
    
    broadwayData.forEach(show => {
      const theatre = show.theater;
      
      if (show.status === 'current') {
        currentShowMap[theatre] = show.title;
      } else if (show.status === 'upcoming') {
        if (!upcomingShowMap[theatre]) {
          upcomingShowMap[theatre] = [];
        }
        const dateStr = formatDate(show.first_preview_date);
        upcomingShowMap[theatre].push(`${show.title} (${dateStr})`);
      }
    });
    
    // Get theatre range B2:B42
    const theatreRange = masterSheet.getRange('B2:B42');
    const theatres = theatreRange.getValues();
    
    // Prepare data for F2:F42 (Current Show)
    const currentShowData = theatres.map(row => {
      const theatre = row[0];
      return [currentShowMap[theatre] || 'EMPTY'];
    });
    
    // Prepare data for G2:G42 (Upcoming)
    const upcomingShowData = theatres.map(row => {
      const theatre = row[0];
      const upcomingShows = upcomingShowMap[theatre];
      const upcomingStr = (upcomingShows && upcomingShows.length > 0) ? upcomingShows.join(', ') : '';
      return [upcomingStr];
    });
    
    // Write to F2:F42
    masterSheet.getRange('F2:F42').setValues(currentShowData);
    Logger.log('Updated F2:F42 (Current Shows)');
    
    // Write to G2:G42
    masterSheet.getRange('G2:G42').setValues(upcomingShowData);
    Logger.log('Updated G2:G42 (Upcoming Shows)');
    
    Logger.log('Done!');
  } catch (error) {
    Logger.log(`Error: ${error.toString()}`);
  }
}

function fetchBroadwayData() {
  try {
    const options = {
      method: 'get',
      headers: {
        'X-API-Key': API_KEY
      },
      muteHttpExceptions: true
    };
    
    const response = UrlFetchApp.fetch(API_URL, options);
    const result = JSON.parse(response.getContentText());
    
    if (result.status === 'success' && result.data && result.data.shows) {
      Logger.log(`Fetched ${result.data.shows.length} shows`);
      return result.data.shows;
    } else {
      Logger.log('API returned unexpected format: ' + response.getContentText());
      return null;
    }
  } catch (error) {
    Logger.log(`Fetch error: ${error.toString()}`);
    return null;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}
