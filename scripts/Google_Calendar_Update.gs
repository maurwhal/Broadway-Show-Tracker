// ⚠️ CUSTOMIZE: Replace with your spreadsheet ID
// Find your ID in the sheet URL: docs.google.com/spreadsheets/d/YOUR_ID/edit
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID';

// ⚠️ NOTE: Tab names must match your sheet exactly
// If you rename tabs, update these values:
const SHOWS_BOOKED_TAB = 'Shows Booked';

// ⚠️ CUSTOMIZE: Change "Maura" to your name (or leave as is for generic "Show")
const YOUR_NAME = 'Maura';
__________________________________________________________________________________

function createShowEvents() {
  try {
    // Open your spreadsheet
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(SHOWS_BOOKED_TAB);
    
    if (!sheet) {
      Logger.log(`Error: "${SHOWS_BOOKED_TAB}" sheet not found`);
      return;
    }
    
    // Get all data
    const data = sheet.getDataRange().getValues();
    
    // Get default calendar
    const calendar = CalendarApp.getDefaultCalendar();
    const calendarId = calendar.getId();
    
    Logger.log(`Processing ${data.length - 1} rows`);
    
    // Loop through rows (start at index 1 to skip headers)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Check if already created (column L, index 11)
      if (row[11] === 'Created') {
        continue;
      }
      
      // Get column values
      const address = row[0];      // Column A
      const theatre = row[1];      // Column B
      const show = row[2];         // Column C
      const dateValue = row[3];    // Column D
      const timeValue = row[4];    // Column E
      const ticketSource = row[5]; // Column F
      
      // Skip empty rows
      if (!show || !dateValue) {
        continue;
      }
      
      // Handle date
      let startDate = new Date(dateValue);
      
      // Handle time - check if it's already a Date object from Sheets
      let hours = 0;
      let minutes = 0;
      
      if (timeValue instanceof Date) {
        // It's a Date object, extract hours and minutes
        hours = timeValue.getHours();
        minutes = timeValue.getMinutes();
      } else if (typeof timeValue === 'string') {
        // Parse time string (e.g., "7:00 PM")
        const timeStr = timeValue.trim();
        const timeParts = timeStr.match(/(\d+):(\d+)\s?(AM|PM)/i);
        
        if (timeParts) {
          hours = parseInt(timeParts[1]);
          minutes = parseInt(timeParts[2]);
          const period = timeParts[3].toUpperCase();
          
          if (period === 'PM' && hours !== 12) hours += 12;
          if (period === 'AM' && hours === 12) hours = 0;
        }
      }
      
      startDate.setHours(hours, minutes, 0, 0);
      
      // End time is 3 hours later
      const endDate = new Date(startDate);
      endDate.setHours(endDate.getHours() + 3);
      
      // Create event title
      const title = `${YOUR_NAME} Show (${show})`;
      
      // Create location
      const location = `${address}, ${theatre}`;
      
      // Create calendar event
      const event = calendar.createEvent(title, startDate, endDate, {
        location: location,
        description: `Ticket Source: ${ticketSource}`
      });
      
      // Set as public and yellow
      try {
        const eventId = event.getId();
        Calendar.Events.patch({
          visibility: 'public',
          colorId: '5'
        }, calendarId, eventId);
      } catch (e) {
        Logger.log(`Event created but color not set: ${title}`);
      }
      
      // Mark row as created
      sheet.getRange(i + 1, 12).setValue('Created');
      Logger.log(`Created: ${title} at ${hours}:${minutes.toString().padStart(2, '0')}`);
    }
    
    Logger.log('Done!');
  } catch (error) {
    Logger.log(`Error: ${error.toString()}`);
  }
}
