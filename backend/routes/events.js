var express = require('express');
var router = express.Router();
var seperator = '||';
var eventfulKey = 'rd6RC8JknxGKq89Q';
const eventful = require('eventful-node');
const client = new eventful.Client(eventfulKey);

router.get('/', function (req, res, next) {
    var keywords = req.query.keywords;
    keywords = keywords.split(seperator);
    var options;
    if(keywords.length===1)
    {
        options = {
            keywords: keywords[0],
            date: 'Next Week',
            location: req.query.location,
            page_size: 25
        };
    }
    else
    {
        var q = '';
        keywords.forEach(item => {
            q = q.concat('tag:' + item + ' || ');
        });
        q = q.substring(0, q.length-3);

        options = {
            keywords: q,
            date: 'Next Week',
            location: req.query.location,
            page_size: 25
        };
    }

    console.log(options);

    client.searchEvents(options, function (err, data) {
        if(err)
        {
            res.send(err);
        }
        else
        {
            var resultEvents = data.search.events.event;
            console.log('Found ' + data.search.total_items + ' events');
            if(parseInt(data.search.total_items) === 0)
            {
                res.send('Error. No Events found.');
            }
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
                    venue_type: resultEvents[i].venue_type,
                    description: resultEvents[i].description,
                    performers: resultEvents[i].performers,
                    city_name: resultEvents[i].city_name
                };
                events.push(event);
            }
            res.send(events);
        }
    });
});

module.exports = router;