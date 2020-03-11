const express = require('express');
const axios = require('axios');
let router = express.Router();
const genre = require('../genres/genre.js');
const config = require("../config");

router.get('/', function (req, res, next) {
    let access_token = req.body.access_token;

    getTopArtists(access_token).then(function (artists) {
        let genres = getGenresFromArtists(artists);
        res.send(genres);
    }).catch(function (error) {
        res.send(error);
    });
});

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

    let genres = [];
    artistsGenres.forEach(item => {
        let newItem = null;
        if (genre.isInEventful(item)) {
            newItem = item;
        } else {
            newItem = genre.getMain(item);
        }
        if (!newItem) {
            console.log("not adding " + item + " as a genre param");
        } else if(!genres.includes(newItem)){
            genres.push(newItem);
        }
    });
    return genres;
}

module.exports = router;