const he = require('he');
const url = require('url');
const path = require('path');
const ssr = require('can-ssr');
const feathers = require('feathers');
const wkhtmltopdf = require('wkhtmltopdf');
const _kebabCase = require('lodash/kebabCase');
const XHR = require('can-ssr/lib/middleware/xhr');

const router = feathers.Router();

const render = ssr({
  main: 'caja/server.stache!done-autorender',
  config: path.join(__dirname, '..', '..', 'package.json!npm')
});

const filename = function(guideTitle) {
  return _kebabCase(guideTitle || 'document') + '.pdf';
};

router.post('/', function(req, res) {
  const guideTitle = req.body.guideTitle;
  const url = req.protocol + '://' + req.get('host') + req.originalUrl;
  const headerFooterUrl = url + '/header-footer?content=';

  const pdfOptions = {
    'header-spacing': 5,
    'footer-spacing': 5
  };

  const toPdf = function(html) {
    if (html) {
      res.set({
        status: 201,
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': 'attachment; filename=' + filename(guideTitle)
      });

      pdfOptions['header-html'] = [
        headerFooterUrl,
        encodeURIComponent(req.body.header),
        '&hideOnFirstPage=',
        encodeURIComponent(req.body.hideHeaderOnFirstPage)
      ].join('');

      pdfOptions['footer-html'] = [
        headerFooterUrl,
        encodeURIComponent(req.body.footer),
        '&hideOnFirstPage=',
        encodeURIComponent(req.body.hideFooterOnFirstPage)
      ].join('');

      wkhtmltopdf(html, pdfOptions).pipe(res);
    } else {
      res.sendStatus(400);
    }
  };

  const onSuccess = function(result) {
    toPdf(he.decode(result.html));
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
