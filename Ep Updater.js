function updateStatusFromAPI() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("LIVE"); // Replace "LIVE" with your sheet name
  var data = sheet.getDataRange().getValues();
  var token = ""; // Replace with your access token

  for (var i = 2; i < data.length; i++) {
    // Starting from the second row (index 1) to skip the header
    var id = data[i][1]; // Assuming the IDs are in column B
    var url =
      "https://gis-api.aiesec.org/v2/people/" + id + "?access_token=" + token;

    try {
      var response = UrlFetchApp.fetch(url);
      var json = response.getContentText();
      var apiData = JSON.parse(json);

      if (
        apiData &&
        apiData.cover_photo_urls &&
        apiData.cover_photo_urls.record
      ) {
        var status = apiData.cover_photo_urls.record.status; // Extract the "Status" from the API response

        if (status !== "open") {
          // Only update the spreadsheet if the status is not "open"
          // Update the "Status" in column H (index 7) of the corresponding row
          sheet.getRange(i + 1, 8).setValue(status); // i + 1 to account for the header row

          // Log the progress
          console.log("Row " + (i + 1) + " updated with Status: " + status);
        } else {
          // Log that the status is "open" and no update was performed
          console.log(
            "Row " + (i + 1) + " has an 'open' status. No update performed."
          );
        }
      } else {
        // Handle the case where the API response doesn't contain the expected data
        // You may want to log an error or take other actions here.
        console.log("Error: Unexpected API response for Row " + (i + 1));
      }
    } catch (error) {
      // Handle any errors that occur during the API request
      // You may want to log the error or take other actions here.
      console.log("Error: API request failed for Row " + (i + 1));
    }
  }
}
