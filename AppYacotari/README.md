# AppYacotari

Aplicacion web de reservas y comprobantes para Recreo Yacotari.

## Archivos principales

- `codigo.gs`: logica backend de Google Apps Script
- `Index.html`: interfaz principal
- `pago_total.html`: plantilla HTML usada para comprobantes
- `appsscript.json`: manifiesto minimo del proyecto

## Notas

- El proyecto usa Google Sheets como base operativa temporal.
- Los PDFs y comprobantes se gestionan desde Google Drive.
- La configuracion principal vive en `CONFIG` dentro de `codigo.gs`.
