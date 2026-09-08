// ⚠️ CUSTOMIZE: Replace with your spreadsheet ID
// Find your ID in the sheet URL: docs.google.com/spreadsheets/d/YOUR_ID/edit
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// ⚠️ NOTE: Tab names must match your sheet exactly
// If you rename tabs, update these values:
const SHOWS_BOOKED_TAB = 'Shows Booked';
const MASTER_TAB = 'BWAY 41';

function updateShowsFromBookedToMaster() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const bookedSheet = ss.getSheetByName(SHOWS_BOOKED_TAB);
    const masterSheet = ss.getSheetByName(MASTER_TAB);
    
    if (!bookedSheet || !masterSheet) {
      Logger.log('Error: Required sheets not found');
      return;
    }
    
    // Get data
    const bookedData = bookedSheet.getDataRange().getValues();
    const masterData = masterSheet.getDataRange().getValues();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Organize shows by theatre
    const showsByTheatre = {};
    
    for (let i = 1; i < bookedData.length; i++) {
      const row = bookedData[i];
      const theatre = row[1];      // Column B
      const show = row[2];         // Column C
      const showDate = row[3];     // Column D
      
      if (!theatre || !show || !showDate) continue;
      
      if (!showsByTheatre[theatre]) {
        showsByTheatre[theatre] = {
          shows: [],
          showCounts: {},
          dates: []
        };
      }
      
      showsByTheatre[theatre].shows.push(show);
      showsByTheatre[theatre].showCounts[show] = (showsByTheatre[theatre].showCounts[show] || 0) + 1;
      showsByTheatre[theatre].dates.push(new Date(showDate));
    }
    
    // Update master sheet
    for (let i = 1; i < masterData.length; i++) {
      const masterRow = masterData[i];
      const masterTheatre = masterRow[1]; // Column B
      
      if (!masterTheatre) continue;
      
      const theatreData = showsByTheatre[masterTheatre];
      if (!theatreData) continue;
      
      // Column C - Check ONLY if unchecked AND date has passed
      if (masterRow[2] !== true) {
        const anyDatePassed = theatreData.dates.some(date => {
          const checkDate = new Date(date);
          checkDate.setDate(checkDate.getDate() + 1); // Check day after show
          return checkDate <= today;
        });
        
        if (anyDatePassed) {
          masterSheet.getRange(i + 1, 3).setValue(true);
          Logger.log(`Checked C for ${masterTheatre}`);
        }
      }
      
      // Column D - Check ONLY if unchecked
      if (masterRow[3] !== true) {
        masterSheet.getRange(i + 1, 4).setValue(true);
        Logger.log(`Checked D for ${masterTheatre}`);
      }
      
      // Column E - Add unique shows (only if empty)
      if (!masterRow[4] || masterRow[4].trim() === '') {
        const uniqueShows = [...new Set(theatreData.shows)].join(', ');
        masterSheet.getRange(i + 1, 5).setValue(uniqueShows);
        Logger.log(`Updated E for ${masterTheatre}: ${uniqueShows}`);
      }
      
      // Column H - Add multiples (only if empty)
      if (!masterRow[7] || masterRow[7].trim() === '') {
        const multiplesArray = [];
        for (const [show, count] of Object.entries(theatreData.showCounts)) {
          if (count > 1) {
            multiplesArray.push(`${show} (x${count})`);
          }
        }
        
        if (multiplesArray.length > 0) {
          const multiplesStr = multiplesArray.join(', ');
          masterSheet.getRange(i + 1, 8).setValue(multiplesStr);
          Logger.log(`Updated H for ${masterTheatre}: ${multiplesStr}`);
        }
      }
    }
    
    Logger.log('Done!');
  } catch (error) {
    Logger.log(`Error: ${error.toString()}`);
  }
}
