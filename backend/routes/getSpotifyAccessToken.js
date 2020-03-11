var express = require('express');
var axios = require('axios');
var router = express.Router();
const config = require("../config");

let execute = function (req, res, next) {
    getSpotifyAccessToken(req.body.code, req.body.redirect_uri).then(function (access_token) {
        res.send(access_token);
    }).catch(function (error) {
        console.log(error);
        res.status(error.response.status).send(error.response.statusText);
    });
};

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
    execute(req, res, next);
});

module.exports = {
    post: function(req, res, next){
        execute(req, res, next);
    },
    router
};

module.exports.post.apiDoc = {
    summary: 'Returns worlds by name.',
    operationId: 'postWorlds',
    parameters: [
        {
            in: 'query',
            name: 'worldName',
            required: true,
            type: 'string'
        }
    ],
    responses: {
        200: {
            description: 'A list of worlds that match the requested name.',
            schema: {
                type: 'array',
                items: {
                    $ref: '#/definitions/World'
                }
            }
        },
        default: {
            description: 'An error occurred',
            schema: {
                additionalProperties: true
            }
        }
    }
};