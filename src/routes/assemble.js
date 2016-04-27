const he = require('he');
const url = require('url');
const path = require('path');
const ssr = require('done-ssr');
const XHR = require('done-ssr-middleware/lib/xhr');
const feathers = require('feathers');
const wkhtmltopdf = require('wkhtmltopdf');
const filenamify = require('../util/pdf-filename');
const forwardCookies = require('../util/cookies').forwardCookies;
const through = require('through2');

const debug = require('debug')('A2J:assemble');
const util = require('util');

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

router.post('/', checkPresenceOf, forwardCookies, function(req, res, next) {
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

  const onFailure = function(error) {
    res.status(500).send(error);
  };

  var renderStream = render(req);
  renderStream.pipe(through(function(buffer){
    const html = buffer.toString();
    const title = req.body.guideTitle;

    toPdf(filenamify(title), he.decode(html));
  }));

  renderStream.on('error', function(err){
    debug(err);
  })
});

router.get('/header-footer', forwardCookies, function(req, res) {
  var query = url.parse(req.originalUrl, true).query;

  if (query.page === '1' && query.hideOnFirstPage === 'true') {
    res.status(200).send('<!DOCTYPE html>');
  } else {
    res.status(200).send('<!DOCTYPE html>' + query.content);
  }
});

module.exports = router;
