var express = require('express');
var router = express.Router();
const config = require("../config");

router.get('/', function(req, res, next) {
    res.redirect('http://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + config.spotify.client_id +
    ('&scope=' + encodeURIComponent(config.spotify.scope)) +
    // '&redirect_uri=' + encodeURIComponent(req.headers.referer+"/events"));
    '&redirect_uri=' + encodeURIComponent(config.spotify.redirect_uri));
});

module.exports = router;