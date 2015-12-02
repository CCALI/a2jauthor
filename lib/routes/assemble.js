var path = require('path');
var ssr = require("can-ssr");
var express = require('express');
var wkhtmltopdf = require('wkhtmltopdf');

var router = express.Router();

var render = ssr({
	main: 'caja/server.stache!done-autorender',
  config: path.join(__dirname, '..', '..', 'package.json!npm'),
  paths: {
		'$css': path.join(__dirname, '..', 'less-plugin.js')
	}
});

router.get('/', function(req, res, next) {
	var toPdf = function(html) {
		if (html) {
			res.set({
				'status': 201,
				'Content-Type': 'application/pdf',
				'Access-Control-Allow-Origin': '*',
				'Content-Disposition': 'attachment; filename=document.pdf'
			});

		  wkhtmltopdf(html).pipe(res);
		} else {
		  res.sendStatus(400);
		}
	}

	render('/').then(function(result) {
		toPdf(result.html);
	});
});

module.exports = router;
