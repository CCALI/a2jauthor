var he = require('he');
var url = require('url');
var path = require('path');
var ssr = require('can-ssr');
var express = require('express');
var wkhtmltopdf = require('wkhtmltopdf');
var _kebabCase = require('lodash/kebabCase');

var router = express.Router();

var render = ssr({
  main: 'caja/server.stache!done-autorender',
  config: path.join(__dirname, '..', '..', 'package.json!npm')
});

var filename = function(guideTitle) {
  return _kebabCase(guideTitle || 'document') + '.pdf';
};

router.post('/', function(req, res) {
  var guideTitle = req.body.guideTitle;
  var url = req.protocol + '://' + req.get('host') + req.originalUrl;
  var headerFooterUrl = url + '/header-footer?content=';

  var pdfOptions = {
    'header-spacing': 5,
    'footer-spacing': 5
  };

  var toPdf = function(html) {
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

  var onSuccess = function(result) {
    toPdf(he.decode(result.html));
  };

  var onFailure = function(error) {
    res.status(500).send(error);
  };

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
