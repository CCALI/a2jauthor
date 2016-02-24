const he = require('he');
const url = require('url');
const path = require('path');
const ssr = require('can-ssr');
const feathers = require('feathers');
const wkhtmltopdf = require('wkhtmltopdf');
const XHR = require('can-ssr/lib/middleware/xhr');
const filenamify = require('../util/pdf-filename');

const router = feathers.Router();

const render = ssr({
  main: 'caja/server.stache!done-autorender',
  config: path.join(__dirname, '..', '..', 'package.json!npm')
});

// middleware to validate the presence of either `guideId` or
// `fileDataUrl`, during document assembly one of those two
// properties is needed to retrieve the template's data.
const checkPresenceOf = function(req, res, next) {
  const { guideId, fileDataUrl } = req.body;

  if (!guideId && !fileDataUrl) {
    return res.status(400)
      .send('You must provide either guideId or fileDataUrl');
  }

  next();
};

router.post('/', checkPresenceOf, function(req, res) {
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const headerFooterUrl = url + '/header-footer?content=';

  const pdfOptions = {
    'header-spacing': 5,
    'footer-spacing': 5
  };

  const toPdf = function(filename, html) {
    if (!html) {
      res.status(500)
        .send('There was a problem generating the document, try again later.');
    }

    const { header, hideHeaderOnFirstPage } = req.body;
    const { footer, hideFooterOnFirstPage } = req.body;

    res.set({
      status: 201,
      'Content-Type': 'application/pdf',
      'Access-Control-Allow-Origin': '*',
      'Content-Disposition': `attachment; filename=${filename}`
    });

    if (header) {
      const h = encodeURIComponent(header);
      const hofp = encodeURIComponent(hideHeaderOnFirstPage);

      pdfOptions['header-html'] = `${headerFooterUrl}${h}&hideOnFirstPage=${hofp}`;
    }

    if (footer) {
      const f = encodeURIComponent(footer);
      const hofp = encodeURIComponent(hideFooterOnFirstPage);

      pdfOptions['footer-html'] = `${headerFooterUrl}${f}&hideOnFirstPage=${hofp}`;
    }

    // finally call wkhtmltopdf with the html generated from the can-ssr call
    // and pipe it into the response object.
    wkhtmltopdf(html, pdfOptions).pipe(res);
  };

  const onSuccess = function(result) {
    const title = req.body.guideTitle;
    toPdf(filenamify(title), he.decode(result.html));
  };

  const onFailure = function(error) {
    res.status(500).send(error);
  };

  XHR.base = req.protocol + '://' + req.get('host');
  render(req).then(onSuccess, onFailure);
});

router.get('/header-footer', function(req, res) {
  var query = url.parse(req.originalUrl, true).query;

  if (query.page === '1' && query.hideOnFirstPage === 'true') {
    res.status(200).send('<!DOCTYPE html>');
  } else {
    res.status(200).send('<!DOCTYPE html>' + query.content);
  }
});

module.exports = router;
