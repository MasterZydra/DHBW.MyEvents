const express = require('express');
const router = express.Router();
const config = require("../config");

router.get('/', function(req, res, next){
    if (req.query.hasOwnProperty("redirect_uri")) {
        res.redirect('http://accounts.spotify.com/authorize' +
            '?response_type=code' +
            '&client_id=' + config.spotify.client_id +
            '&scope=' + encodeURIComponent(config.spotify.scope) +
            '&redirect_uri=' + encodeURIComponent(req.query.redirect_uri));
    } else {
        res.status(400).send({error: "redirect_uri missing"});
    }
});

module.exports = {
    router
};