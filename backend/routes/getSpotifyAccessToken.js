const express = require('express');
const axios = require('axios');
const router = express.Router();
const config = require("../config");

async function getSpotifyAccessToken(code, redirect_uri) {
    let data = 'code=' + code + '&redirect_uri=' + redirect_uri + '&grant_type=authorization_code';
    let authOptions = {
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        data: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (new Buffer(config.spotify.client_id + ':' + config.spotify.client_secret).toString('base64'))
        },
        json: true
    };

    return await axios(authOptions).then(function (response) {
        return Promise.resolve(response.data.access_token);
    }).catch(function (error) {
        return Promise.reject(error);
    });
}

router.post('/', function(req, res, next) {
    getSpotifyAccessToken(req.body.code, req.body.redirect_uri).then(function (access_token) {
        res.send(access_token);
    }).catch(function (error) {
        console.log(error);
        res.status(error.response.status).send(error.response.statusText);
    });
});

module.exports = {
    router
};