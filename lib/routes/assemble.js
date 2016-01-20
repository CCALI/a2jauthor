var he = require('he');
var path = require('path');
var ssr = require('can-ssr');
var express = require('express');
var wkhtmltopdf = require('wkhtmltopdf');
var url = require('url');

var router = express.Router();

var render = ssr({
  main: 'caja/server.stache!done-autorender',
  config: path.join(__dirname, '..', '..', 'package.json!npm')
});

router.post('/', function(req, res) {
  var url = req.protocol + '://' + req.get('host') + req.originalUrl;

  var toPdf = function(html) {
    if (html) {
      res.set({
        status: 201,
        'Content-Type': 'application/pdf',
        'Access-Control-Allow-Origin': '*',
        'Content-Disposition': 'attachment; filename=document.pdf'
      });

      wkhtmltopdf(html, {
        'header-html': url + '/header-footer?content=' + encodeURIComponent(req.body.header),
        'header-spacing': 5,
        'footer-html': url + '/header-footer?content=' + encodeURIComponent(req.body.footer),
        'footer-spacing': 5
      }).pipe(res);
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
  res.status(200).send('<!DOCTYPE html>' + query.content);
});

module.exports = router;
