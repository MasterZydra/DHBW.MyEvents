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
        return Promise.resolve({
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token
        });
    }).catch(function (error) {
        return Promise.reject(error);
    });
}

async function refreshToken(refresh_token) {
    let data = 'refresh_token=' + refresh_token + '&grant_type=refresh_token';
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

router.post('/refresh', function (req, res, next) {
    refreshToken(req.body.refresh_token).then(function (access_token) {
        res.send(access_token);
    }).catch(function (error) {
        res.sendStatus(error.response.status);
    })
});

module.exports = {
    router
};