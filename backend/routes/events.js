var express = require('express');
var router = express.Router();

var eventfulKey = 'rd6RC8JknxGKq89Q';
const eventful = require('eventful-node');
const client = new eventful.Client(eventfulKey);

router.get('/', function (req, res, next) {
    var options = {
        keywords: req.query.keywords,
        date: 'Next Week',
        location: req.query.location,
        page_size: 25
    };

    client.searchEvents(options, function (err, data) {
        if(err)
        {
            res.send(err);
        }
        else
        {
            var resultEvents = data.search.events.event;
            console.log('Found ' + data.search.total_items + ' events');
            console.log('Events:');
            var events = [];
            for(var i=0; i<resultEvents.length; i++)
            {
                console.log('title: ' + resultEvents[i].title);
                var event = {
                    title: resultEvents[i].title,
                    start_time: resultEvents[i].start_time,
                    venue_name: resultEvents[i].venue_name,
                    venue_address: resultEvents[i].venue_address,
                    description: resultEvents[i].description,
                    city_name: resultEvents[i].city_name
                };
                events.push(event);
            }
            res.send(events);
        }
    });
});

module.exports = router;