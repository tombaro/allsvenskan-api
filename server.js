var express = require('express'),
app = express(),
port = process.env.PORT || 3000,
bodyParser = require('body-parser'),
path = require('path'),
ejs = require('ejs'),
axios = require('axios');

//Domain where API is hosted:
var domain = 'https://allsvenskan-api.herokuapp.com/';
if (app.get('env') === 'development') {
    domain = 'http://localhost:3000';
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var routes = require('./api/routes/standingsRoute');
routes(app);

app.use(express.static(path.join(__dirname, 'public')));

// Serve index page
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname + './public/index.html'));
});

var asData = {};
var asScorersData = {};
var elData = {};
var dasData = {};
var seData = {};

axios.get(domain + '/as')
    .then(function(res){asData = res.data;})

axios.get(domain + '/as/topscorers')
    .then(function(res){asScorersData = res.data;})
    
axios.get(domain + '/el')
    .then(function(res){elData = res.data;})
    
axios.get(domain + '/das')
    .then(function(res){dasData = res.data;})
    
axios.get(domain + '/se')
    .then(function(res){seData = res.data;})


app.get('/allsvenskan', function(req,res){
    res.render('tabell', {data: JSON.parse(asData)})
})

app.get('/elitettan', function(req,res){
    res.render('tabell', {data: JSON.parse(elData)})
})

app.get('/damallsvenskan', function(req,res){
    res.render('tabell', {data: JSON.parse(dasData)})
})

app.get('/superettan', function(req,res){
    res.render('tabell', {data: JSON.parse(seData)})
})

app.get('/allsvenskanbw', function(req,res){
    res.render('bw', {data: JSON.parse(asData)})
})

app.listen(port);

console.log('api RESTful API server started on: ' + port);