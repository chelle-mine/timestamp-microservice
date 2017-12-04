const expect = require('chai').expect;
const request = require('request');

const host = 'http://localhost:3000';
describe('Handling various parameters', () => {
	describe('Handling string parameters', () => {
		it('Handles "natural language dates"', (done) => {
			request(host + '/' + encodeURI('September 18, 2012'), (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.equal('{"unix": 1347926400, "natural": "September 18, 2012"}');
			});
			request(host + '/' + encodeURI('Sep 18 2012'), (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.equal('{"unix": 1347926400, "natural": "September 18, 2012"}');
			});
			request(host + '/' + encodeURI('09-18-2012'), (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.equal('{"unix": 1347926400, "natural": "September 18, 2012"}');
			});
			done();
		});

		it('Returns null for non-date strings', (done) => {
			request(host + '/' + encodeURI('Borderlands 2 Release'), (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.equal('{"unix": null, "natural": null}');
			});
			done();
		});
	});

	describe('Handling number parameters', () => {
		it('Handles integer values', (done) => {
			request(host + '/1347926400', (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.equal('{"unix": 1347926400, "natural": "September 18, 2012"}');
			});
			request(host + '/-1347926400', (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.equal('{"unix": null, "natural": null}');
			});
			done();
		});


		it('Returns null for non-integer values', (done) => {
			request(host + '/13479264.00', (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.equal('{"unix": null, "natural": null}');
			});
			request(host + '/2e56', (err, res, body) => {
				expect(res.statusCode).to.equal(200);
				expect(res.body).to.equal('{"unix": null, "natural": null}');
			});
			done();
		});
	});
});
