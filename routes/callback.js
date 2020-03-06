var express = require('express');
var request = require('request');
var router = express.Router();
var client_id = '905baa9c4a8c41b8868f961e19b1cc71';
var client_secret = '0085f87a56cb4e40a6a15e556c01ade9';
var access_token;
var refresh_token;
var searchGenres = ['pop', 'schlager', 'rock', 'metal', 'rap', 'hip hop', 'country', 'jazz', 'classic'];

router.get('/', function (req, res, next) {
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
});

router.get('/loggedIn', function(req, res, next){
    console.log('access_token:');
    console.log(access_token);

    var artists_options = {
        url: 'https://api.spotify.com/v1/me/top/artists',
        qs: {limit: 20,
            offset: 0,
            time_range: 'short_term'},
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
                item.genres.forEach(function (item, index, array) {
                    if(!genres.includes(item))
                    {
                        genres.push(item);
                    }
                });
            });

            console.log(genres);

            var search = [];
            genres.forEach(function (item) {
                searchGenres.forEach(function (element) {
                    if(item.includes(element) && !search.includes(element))
                    {
                        search.push(element);
                    }
                });
            });

            console.log(search);
            res.send(search);
        }
    });
});

module.exports = router;