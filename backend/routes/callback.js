var express = require('express');
var axios = require('axios');
var router = express.Router();
const genre = require('../genres/genre.js');
const config = require("../config");
// var client_id = '905baa9c4a8c41b8868f961e19b1cc71';
// var client_secret = '0085f87a56cb4e40a6a15e556c01ade9';
// var frontendUrl;

router.get('/', function (req, res, next) {
    let code = req.query.code;

    let frontendUrl = req.headers.referer ? req.headers.referer : config.apiUrl;

    getSpotifyAccessToken(code).then(function (access_token) {
        console.log(frontendUrl);
        return getTopArtists(access_token);
    }).then(function (artists) {
        let genres = getGenresFromArtists(artists);
        console.log(genres);
        res.send(genres);
    }).catch(function (error) {
        res.send(error);
    });
});

async function getSpotifyAccessToken(code) {
    let data = 'code=' + code + '&redirect_uri=' + config.spotify.redirect_uri + '&grant_type=authorization_code';
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

        // let options = {
        //     method: 'get',
        //     url: 'https://api.spotify.com/v1/me',
        //     headers: { 'Authorization': 'Bearer ' + access_token },
        //     json: true
        // };

        // axios(options)
        //     .then(response => {console.log(response.data)})
        //     .catch(error => {console.log(error)});
    }).catch(function (error) {
        return Promise.reject(error);
        // console.log(error);
        // res.redirect(config.apiUrl);
    });
}

async function getTopArtists(access_token) {
    let artists_options = {
        method: 'get',
        url: 'https://api.spotify.com/v1/me/top/artists',
        qs: {limit: 20,
            offset: 0,
            time_range: 'medium_term'},
        headers: { 'Authorization': 'Bearer ' + access_token },
        json: true
    };

    return await axios(artists_options).then(function (response) {
        return Promise.resolve(response.data.items);
    }).catch(function (error) {
        return Promise.reject(error);
    });
}

function getGenresFromArtists(artists) {
    let artistsGenres = [];
    if(artists == null || artists.length === 0) {
        return artistsGenres;
    }
    artists.forEach(function(artist, index, array) {
        artist.genres.forEach(function (genre, index, array) {
            if(!artistsGenres.includes(genre)) {
                artistsGenres.push(genre);
            }
        });
    });
    console.log(artistsGenres);

    console.log(genres);
    var search = [];
    genres.forEach(item => {
        let newItem = null;
        // TODO: isInEventful funktioniert korrekt? Keine Genres zurückbekommen
        if (genre.isInEventful(item)) {
            newItem = item;
        } else {
            newItem = genre.getMain(item);
        }
        if (!newItem) {
            console.log("not adding " + item + " as a genre param");
        } else if(!search.includes(newItem)){
            search.push(newItem);
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

    console.log(genres);
    return genres;
}

module.exports = router;