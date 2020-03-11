var express = require('express');
var router = express.Router();
const config = require("../config");

let authenticate = function(req, res, next) {
    res.redirect('http://accounts.spotify.com/authorize' +
    '?response_type=code' +
    '&client_id=' + config.spotify.client_id +
    ('&scope=' + encodeURIComponent(config.spotify.scope)) +
    // '&redirect_uri=' + encodeURIComponent(req.headers.referer+"/events"));
    '&redirect_uri=' + encodeURIComponent(config.spotify.redirect_uri));
}

router.get('/', function(req, res, next){
    authenticate(req, res, next)
});

module.exports = {
    get: function(req, res, next){
        authenticate(req, res, next)
    },
    router
};

module.exports.get.apiDoc = {
    summary: 'Returns worlds by name.',
    operationId: 'getWorlds',
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