# A2J Doc

This document describes the API between the client and server for A2J Doc.

## Contents
- Endpoints
- Custom Types

## Endpoints
These are the available endpoints for the client to use.

### Upload a PDF file

`POST /api/a2j-doc/pdfs`

This endpoint accepts a single PDF under the key name `pdf`.
Note that Content-Type must be `multipart/form-data`.
An example upload form (assuming authentication):

```html
<form method="post" action="/api/a2j-doc/pdfs">
  <input name="pdf" type="file" accept="application/pdf" />
</form>
```

##### Response
The response from the API is JSON which has the shape:

```js
{
  ok: Boolean,
  error: Error, // if ok is false
  pdfId: String // if ok is true
}
```

### Retrieve a PDF file
`GET /api/a2j-doc/pdfs/:pdfId`

##### URL Parameters
| Param | Type | Description |
| ----- | ---- | ----------- |
| `pdfId` | String | The ID of the PDF to retrieve

##### Response
The PDF file.

### Delete a PDF file
`DELETE /api/a2j-doc/pdfs/:pdfId`

##### URL Parameters
| Param | Type | Description |
| ----- | ---- | ----------- |
| `pdfId` | String | The ID of the PDF to retrieve

##### Response
```js
{
  ok: Boolean,
  error: Error, // if ok is false
  pdfId: String // if ok is true
}
```

### Overlay on a PDF file
`POST /api/a2j-doc/overlay/apply`

##### Body Parameters
| Param | Type | Description |
| ----- | ---- | ----------- |
| `pdfId` | String | The ID of the PDF to retrieve
| `overlay` | `Overlay` | The overlay to apply to the PDF

##### Response
```js
{
  ok: Boolean,
  error: Error, // if ok is false
  pdfId: String // if ok is true
}
```

### List supported fonts
`GET /api/a2j-doc/overlay/supported-fonts`

The fonts used to render PDFs must exist on the server.
Use this approved list of fonts for the overlay `fontName` option.

##### Response specification
```js
{
  ok: Boolean,
  error: Error, // if ok is false
  fonts: Array(String) // if ok is true
}
```

##### Response example
```json
{
  "ok": true,
  "fonts": [
    "Arial",
    "Times New Roman"
  ]
}
```

## Custom Types
In the above endpoint descriptions, some types need clarification.

### Error
The Error type is an alias for String.

### Overlay
The Overlay type is complex and is best described as an array of individual "patches." Each patch has its own shape.

##### Type Specification
The living specification is in `pdf/overlayer/validate`.

##### Examples
The following overlay will add a text node in the top-left corner of the new PDF.

```json
{
  "patches": [{
    "type": "text",
    "content": "Hello world",
    "area": {
      "top": 0,
      "left": 0,
      "width": 300,
      "height": 40
    },
    "text": {
      "fontSize": 11,
      "fontName": "Lato",
      "textColor": "#000000",
      "textAlign": "left"
    }
  }]
}
```
