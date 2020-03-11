var express = require('express');
var request = require('request');
var router = express.Router();
const genre = require('../genres/genre.js');
var client_id = '905baa9c4a8c41b8868f961e19b1cc71';
var client_secret = '0085f87a56cb4e40a6a15e556c01ade9';
var access_token;
var refresh_token;

let callback = function (req, res, next) {
    var code = req.query.code;

    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: 'http://localhost:3000/callback',
            grant_type: 'authorization_code'
        },
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function (error, response, body) {
        if(error || response.statusCode !== 200)
        {
            console.log(error);
            res.redirect('http://localhost:3000');
        }
        else
        {
            access_token = body.access_token;
            refresh_token = body.refresh_token;

            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            request.get(options, function (error, response, body) {
                console.log(body);
                res.redirect('/callback/loggedIn');
            });
        }
    });
}

router.get('/loggedIn', function(req, res, next){
    console.log('access_token:');
    console.log(access_token);

    var artists_options = {
        url: 'https://api.spotify.com/v1/me/top/artists',
        qs: {limit: 20,
            offset: 0,
            time_range: 'medium_term'},
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };

    request.get(artists_options, function(error, response, body) {
        if(error || response.statusCode !== 200)
        {
            console.log(error);
            res.redirect('http://localhost:3000');
        }
        else {
            var artists = body.items;
            var genres = [];
            artists.forEach(function(item, index, array)
            {
                item.genres.forEach(function (genre, index, array) {
                    if(!genres.includes(genre))
                    {
                        genres.push(genre);
                    }
                });
            });

            console.log(genres);
            var search = [];
            genres.forEach(item => {
                var main = genre.getMain(item);
                if(main == null)
                {
                    console.log("main is undefined for " + item);
                }
                else if(!search.includes(main))
                {
                    search.push(main);
                }
            });

            console.log(search);
            if(search.length === 0)
            {
                res.send('Error. No genres found');
            }

            var keywords = '';
            search.forEach(function (item) {
                keywords = keywords.concat(item, '||');
            });

            keywords = keywords.substring(0, keywords.length-2);
            var location = 'Germany';
            res.redirect('http://localhost:3000/events?keywords=' + keywords + '&location=' + location);
        }
    });
});

router.get('/', function(req, res, next){
    callback(req, res, next)
});

module.exports = {
    get: function(req, res, next){
        callback(req, res, next)
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
