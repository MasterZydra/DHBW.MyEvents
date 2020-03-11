var express = require('express');
let axios = require('axios');
var router = express.Router();
const config = require("../config");
var seperator = '||';
const eventful = require('eventful-node');
const client = new eventful.Client(config.eventful.eventfulKey);

router.get('/', function (req, res, next) {
    let location = req.query.location == null ? 'Germany' : req.query.location;
    translateText(location).then(function (translation) {
        location = translation;

        var options = fillOptions(req.query.keywords, location);
        console.log(options);

        client.searchEvents(options, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                let events = fillEvents(data);
                res.send(events);
            }
        });
    })
    .catch(function (error) {
        res.send(error);
    });
});

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

function fillOptions(keywords, location) {
    keywords = keywords.split(seperator);
    var options;
    if (keywords.length === 1) {
        options = {
            keywords: keywords[0],
            date: 'Next Week',
            location: location,
            page_size: 25
        };
    } else {
        var q = '';
        keywords.forEach(item => {
            q = q.concat('tag:' + item + ' || ');
        });
        q = q.substring(0, q.length - 3);

        options = {
            keywords: q,
            date: 'Next Week',
            location: location,
            page_size: 25
        };
    }
    return options;
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

module.exports = router;