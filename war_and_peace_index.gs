// Function to handle HTTP GET requests
function doGet(e) {
  const indexData = getLatestWarAndPeaceIndex(); // Get the latest index
  return ContentService.createTextOutput(JSON.stringify(indexData)) // Return the index value as JSON
    .setMimeType(ContentService.MimeType.JSON);
}

// Function to get the latest index from the spreadsheet
function getLatestWarAndPeaceIndex() {
  const spreadsheetId = "*****"; // Blurred: Spreadsheet ID
  const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet(); // Get the active sheet
  const lastRow = sheet.getLastRow(); // Get the last row
  const index = sheet.getRange(lastRow, 2).getValue(); // Extract the index value from the second column (where it is stored)
  return {
    index: index, // Return the index value
  };
}

// Function to generate the War and Peace Index
function generateWarAndPeaceIndex() {
  const rssUrl = "*****"; // Blurred: RSS feed URL

  try {
    // Fetching RSS data
    const response = UrlFetchApp.fetch(rssUrl);
    const xml = response.getContentText();
    const document = XmlService.parse(xml);
    const root = document.getRootElement();
    const channel = root.getChild("channel");
    const items = channel.getChildren("item");

    // Extracting news headlines
    const headlines = items.map(item => item.getChild("title").getText());

    // Analyzing headlines
    const warKeywords = ["war", "conflict", "attack", "threat"];
    const peaceKeywords = ["peace", "resolution", "agreement", "truce"];

    let warCount = 0, peaceCount = 0;
    headlines.forEach(headline => {
      if (new RegExp(warKeywords.join("|"), "i").test(headline)) {
        warCount++;
      } else if (new RegExp(peaceKeywords.join("|"), "i").test(headline)) {
        peaceCount++;
      }
    });

    // Generating the index
    const total = warCount + peaceCount || 1; // Avoid division by 0
    const index = Math.round((peaceCount / total) * 100);

    // Access the Google Sheets spreadsheet
    const spreadsheet = SpreadsheetApp.openById("*****"); // Blurred: Spreadsheet ID
    const sheet = spreadsheet.getActiveSheet();

    // Write data to the spreadsheet
    const date = new Date();
    sheet.appendRow([date, index, warCount, peaceCount, total]);

    Logger.log(`War and Peace Index generated: ${index}/100`);

  } catch (error) {
    Logger.log("An error occurred: " + error.message);
    throw new Error("Error during execution: " + error.message);
  }
}
