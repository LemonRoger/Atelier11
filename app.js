
const { urlencoded } = require('express');
var express = require('express');
const { get } = require('http');
var app = express();

app.set('view engine', 'ejs');


var moduleStates = [0,0,0,0,0,0];

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1:1883');


client.on('connect', function () {
    client.subscribe('MODULE/#');
    client.publish('MODULE', 'le serveur js vous dit bonjour');
    console.log("MQTT connecté !");
});
client.on('message', function (topic, message) {
    console.log(topic.toString());
    console.log(message.toString());
  });
  



app.get('/', function(req,res,next){
    res.render('pages/index').status(200);
});

//route simple
app.get('/contact', function(req,res,next){
    res.render('pages/pageContact').status(200);
});

app.get('/btn/:id', function(req,res,next){
    if(moduleStates[(req.params.id) - 1] == 1)
    {
        moduleStates[(req.params.id) - 1] = 0;
    }
    else
    {
        moduleStates[(req.params.id) - 1] = 1;
    }
    res.redirect(302,'/modules');
    next();
});
app.get('/Reset', function(req,res,next){
    for(var i = 0 ; i < 6 ; i++)
    {
        moduleStates[i] = 0;
    }
    res.redirect(302,'/modules');
    next();
});


app.get('/modules', function(req,res,next){
    res.render('pages/pageModules',{mod1:moduleStates[0],mod2:moduleStates[1],mod3:moduleStates[2],mod4:moduleStates[3],mod5:moduleStates[4],mod6:moduleStates[5]}).status(200);
});

//Route dynamique
app.get('/module/:id', function(req,res,next){
    if(req.params.id <= 6)
    {

        if(moduleStates[(req.params.id) - 1] ==1)
        {
            moduleStates[(req.params.id) - 1] = 0; 
        }
        else
        {
            moduleStates[(req.params.id) - 1] =1; 
        }
        
        res.render('./pages/pageModuleSimple', {id: req.params.id, state:moduleStates[(req.params.id) - 1]});
    }
    res.render('./pages/pageModuleSimple', {id: req.params.id, state:moduleStates[(req.params.id) - 1]});

});

app.use(function(req,res,next){
    res.status(404).send('<h1>' + 'Erreur 404' + '</h1>');
});


app.listen(8080);
console.log("Lab03 - Serveur lancé - 8080");