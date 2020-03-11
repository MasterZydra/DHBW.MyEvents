const express = require('express');
const axios = require('axios');
const router = express.Router();
const config = require("../config");
const eventful = require('eventful-node');
const client = new eventful.Client(config.eventful.eventfulKey);

async function translateText(text) {
    let url = 'https://translation.googleapis.com/language/translate/v2?'
        + 'target=en'
        + '&q=' + encodeURIComponent(text)
        + '&key=' + config.google.translationKey;

    return await axios.get(url).then(function (data) {
        return Promise.resolve(data.data.data.translations[0].translatedText);
    }).catch(function (error) {
        return Promise.reject(error);
    });
}

function fillEvents(data) {
    let resultEvents = data.search.events.event;
    console.log('Found ' + data.search.total_items + ' events');
    if (parseInt(data.search.total_items) === 0) {
        return {events: resultEvents};
    } else {
        console.log('Events:');
        let events = [];
        for (let i = 0; i < resultEvents.length; i++) {
            console.log('title: ' + resultEvents[i].title);
            let event = {
                title: resultEvents[i].title,
                start_time: resultEvents[i].start_time,
                venue_name: resultEvents[i].venue_name,
                venue_address: resultEvents[i].venue_address,
                venue_type: resultEvents[i].venue_type,
                description: resultEvents[i].description,
                performers: resultEvents[i].performers,
                city_name: resultEvents[i].city_name
            };
            events.push(event);
        }
        return events;
    }
}

router.post('/', function(req, res, next){
    let location = req.body.location == null ? 'Germany' : req.body.location;
    translateText(location).then(function (translation) {
        location = translation;
        let keywords = (req.body.genres.length === 1) ? req.body.genres[0] : req.body.genres.map(g => "tag: \""+g + "\"").join(' || ');
        console.log(keywords);
        let options = {
            keywords,
            date: req.body.date || 'Next week',
            location,
            page_size: req.body.page_size || 25
        };

        client.searchEvents(options, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                let events = fillEvents(data);
                res.send(events);
            }
        });
    }).catch(function (error) {
        res.send(error);
    });
});

module.exports = {
    router
};