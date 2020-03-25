const express = require('express');
const axios = require('axios');
const router = express.Router();
const config = require("../config");
const eventful = require('eventful-node');
const client = new eventful.Client(config.eventful.eventfulKey);

async function translateText(text) {
    let url = 'https://translation.googleapis.com/language/translate/v2?'
        // target language english:
        + 'target=en'
        // text to be translated
        + '&q=' + encodeURIComponent(text)
        // google application key to translate
        + '&key=' + config.google.translationKey;

    return await axios.get(url).then(function (data) {
        // select first translation as result
        return Promise.resolve(data.data.data.translations[0].translatedText);
    }).catch(function (error) {
        return Promise.reject(error);
    });
}

function fillEvents(data) {
    let resultEvents = data.search.events.event;
    console.log('Found ' + data.search.total_items + ' events');
    if (parseInt(data.search.total_items) === 0) {
        // if no results are found, no further action is required
        return {events: resultEvents};
    } else {
        console.log('Events:');
        let events = [];

        // write all events found in an array
        for (let i = 0; i < resultEvents.length; i++) {
            console.log('title: ' + resultEvents[i].title);

            // read performers: they can be either a single performer, an array of performers or they can be empty
            let performers = Array.isArray(resultEvents[i].performers.performer) ?
                // if it's an array, create an array of names
                resultEvents[i].performers.performer.map(p => p.name) :
                // if it's not an array, check if there is a performer
                (resultEvents[i].performers.hasOwnProperty("performer")) ?
                    // if there is a performer, save the name in an array
                    [resultEvents[i].performers.performer.name] :
                    // otherwise an empty array
                    [];

            // if there is a link, save the url, otherwise an empty string
            let links = resultEvents[i].links.link.url ? resultEvents[i].links.link.url : "";
            
            // decode URI components in the title
            let title = !resultEvents[i].title.includes("\"") ?
                decodeURIComponent(JSON.parse('"' + resultEvents[i].title + '"'))  :
                resultEvents[i].title;

            // if there is an image, replace "small" with "large" to get a larger image, otherwise save an empty string
            let image = resultEvents[i].image.url ? resultEvents[i].image.url.replace('small', 'large') : "";

            // create a new event with the properties title, start_time, venue_name, venue_address, description, performers, city_name, image and links
            let event = {
                title,
                start_time: resultEvents[i].start_time,
                venue_name: resultEvents[i].venue_name,
                venue_address: resultEvents[i].venue_address,
                description: resultEvents[i].description,
                performers,
                city_name: resultEvents[i].city_name,
                image,
                links
            };

            // add the event to the array
            events.push(event);
        }

        // return the array of events
        return events;
    }
}

router.post('/', function(req, res, next){
    // if a location has been given, take this location, otherwise set "Germany" as default value
    let location = req.body.location == null ? 'Germany' : req.body.location;
    // translate the location
    translateText(location).then(function (translation) {
        location = translation;
        // read keywords and link them if necessary (if more than one)
        let keywords = (req.body.genres.length === 1) ? req.body.genres[0] : req.body.genres.map(g => "tag: \""+g + "\"").join(' || ');
        console.log(keywords);

        // fil options with keywords, date ("Next week" as default), location, page_size (25 as default) and include: 'links' (the optional sections links should be included)
        let options = {
            keywords,
            date: req.body.date || 'Next week',
            location,
            page_size: req.body.page_size || 25,
            include: 'links'
        };

        client.searchEvents(options, function (err, data) {
            if (err) {
                res.send(err);
            } else {
                // fill events from the result
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