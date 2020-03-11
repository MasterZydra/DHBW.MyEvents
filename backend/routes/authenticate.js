var express = require('express');
var router = express.Router();
var my_client_id = '905baa9c4a8c41b8868f961e19b1cc71';

let authenticate = function(req, res, next) {
    var scopes = 'user-read-private user-read-email user-top-read';
    res.redirect('http://accounts.spotify.com/authorize' +
        '?response_type=code' +
        '&client_id=' + my_client_id +
        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
        '&redirect_uri=' + encodeURIComponent('http://localhost:3000/callback'));
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