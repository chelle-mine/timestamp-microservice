const chrono = require('chrono-node');
const express = require('express');
const app = express();

// Set view
app.set('views', __dirname + '/views');
app.set('view engine', 'pug');

app.get('/', (req, res) => res.render('index', {
	domainName: req.protocol + '://' + req.get('host') + '/',
	date: encodeURI('September 18, 2012')
}));

app.param('dateIn', (req, res, next, dateIn) => {
	req.date = {
		unix: null,
		natural: null
	};
	// if `dateIn` is an int, presume UNIX timestamp
	if (Number.isInteger(parseInt(dateIn))) {
		dateIn = new Date(parseInt(dateIn) * 1000).toString();
	}

	// see if chrono-node can parse dateIn
	if (chrono.parseDate(dateIn)) {
		// pass in parsed date to a new Date obj
		const d = new Date(chrono.parseDate(dateIn));
		// assign to properties in req obj
		req.date.unix = d.getTime() / 1000;
		req.date.natural = d.toDateString();
	}
	
	next();
});

app.use('/:dateIn', (req, res) => {
	res.send(JSON.stringify(req.date));
});

app.listen(3000, () => console.log('Listening on port 3000...'));
