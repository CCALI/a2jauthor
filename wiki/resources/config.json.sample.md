This is a local dev sample of the config.json file read by A2J_DAT, the Document template
and assembly API server by NodeJS. It assumes serving the app from the `Sites/a2j`
folder on MacOS using `MAMP`, with default user and password of `root` for the database.
This is obviously not secure, and would be updated in a true production environment  

note: The `DRUPAL` variables are not used locally, but require a value
 to be entered.  
 
Replace usernames with proper values for your local paths

```json
{
  "CAJA_WS_URL": "http://localhost/a2j/author/CAJA_WS.php",
  "GUIDES_DIR": "/Users/mitch/Sites/a2j/userfiles/",
  "GUIDES_URL": "/a2j/userfiles/",
  "isProductionServer": false,
  "LOCAL_USER": 45,
  "DB_NAME": "caja",
  "DB_USER": "root",
  "DB_PASSWORD": "root",
  "DB_HOST": "localhost",
  "DB_PORT": 3306,
  "DRUPAL_ROOT_DIR": "",
  "WKHTMLTOPDF_PATH": "/usr/local/bin/wkhtmltopdf",
  "WKHTMLTOPDF_ZOOM": 1.6,
  "WKHTMLTOPDF_DPI": 300,
  "VIEWER_PATH": "/Users/mitch/Sites/a2j/viewer"
}
```
