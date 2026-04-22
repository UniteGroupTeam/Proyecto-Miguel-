/**
 * Instrucciones:
 * 1. Abre un Google Sheet nuevo.
 * 2. Ve a 'Extensiones' -> 'Apps Script'.
 * 3. Borra todo y pega este código.
 * 4. Cambia 'SHEET_NAME' por el nombre de tu pestaña (ej. 'Sheet1').
 * 5. Haz clic en 'Implementar' -> 'Nueva implementación'.
 * 6. Selecciona 'Aplicación web'.
 * 7. En 'Quién tiene acceso', selecciona 'Cualquiera'.
 * 8. Copia la URL de la aplicación web y pégala en js/app.js (WEBHOOK_URL).
 */

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  var data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.folio,
    data.nombre,
    data.telefono,
    data.marca,
    data.modelo,
    data.color,
    data.talla,
    data.servicios,
    data.punto,
    data.estado
  ]);
  
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}
