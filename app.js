var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var path = require('path');

var app = express();


app.use(bodyParser.urlencoded({
    extended: true
}));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.set('port', process.env.PORT || 3000);
var routes = require('./routes/index');
app.use('/', routes);


var server=app.listen(app.get('port'), function() {
	console.log('Express server listening on port ' + server.address().port);
});

module.exports = app;
