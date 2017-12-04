const chrono = require('chrono-node');
const express = require('express');
const app = express();

// Set view
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('home', {
    domainName: req.protocol + '://' + req.get('host') + '/',
    date: encodeURI('September 18, 2012')
}));

app.param('dateIn', (req, res, next, dateIn) => {
    // object properties null by default
    req.date = {
        unix: null,
        natural: null
    };

    // if `dateIn` is an int, presume UNIX timestamp
    if (dateIn.match(/^\d+$/)) {
        const d = new Date(parseInt(dateIn) * 1000);

        if (!isNaN(d.getTime())) {
            // convert to UTC for consistency
            const utc = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getUTCHours());

            req.date.unix = d.getTime() / 1000;
            req.date.natural = utc.toLocaleString('en-us', {month: 'long', day: '2-digit', year: 'numeric'});
        }
    }

    // see if chrono-node can parse dateIn
    else if (chrono.parseDate(dateIn)) {
        // remove timezone offset
        let result = chrono.parse(dateIn)[0];
        result.start.assign('timezoneOffset', 0);

        const d = result.start.date();
        
        req.date.unix = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 1000;
        req.date.natural = d.toLocaleString('en-us', {month: 'long', day: '2-digit', year: 'numeric'});
    }
    
    next();
});

app.use('/:dateIn', (req, res) => {
    res.send(JSON.stringify(req.date));
});

app.listen(3000, () => console.log('Listening on port 3000...'));
