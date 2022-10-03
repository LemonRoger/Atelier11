
const { urlencoded } = require('express');
var express = require('express');
const { get } = require('http');
var app = express();

app.set('view engine', 'ejs');


var moduleStates = [0,0,0,0,0,0];

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://127.0.0.1:1883');


client
.on('connect', function () {
    client.subscribe('MODULE/#');
    client.publish('MODULE', 'le serveur js vous dit bonjour');
    console.log("MQTT connecté !");
})
.on('message', function (topic, message) {
    var sujet = topic.toString();
    var msg = message.toString();
    console.log(sujet);
    console.log(msg);
    if(sujet.startsWith("MODULE"))
    { 
        var id = sujet[sujet.length - 1]; 
        if(((id <= '6') && (id >= '0')) && (msg == "ON"))
        { 
            moduleStates[Number(id)-1] = 1;
        }
        else if(((id <= '6') && (id >= '0')) && (msg == "OFF"))
        {
            moduleStates[Number(id)-1] = 0;
        }

    }
        

});
  


//////////////////////////////////////////  GESTION DU SERVEUR
app
.get('/', function(req,res,next){
    res.render('pages/index');
})
.get('/contact', function(req,res,next){///////////////Page Cotancts
    res.render('pages/pageContact');
})
.get('/btn/:id', function(req,res,next){//////////////Boutons on/off
    moduleStates[(req.params.id) - 1] ^= 1;
    res.redirect(302,'/modules');
    next();
})
.get('/Reset', function(req,res,next){/////////////Bouton reset
    for(var i = 0 ; i < 6 ; i++)
        moduleStates[i] = 0;
    res.redirect(302,'/modules');
    next();
})
.get('/modules', function(req,res,next){////////////////////////////////PAGE MODULES/CONTROLE
    res.render('pages/pageModules',{modules:moduleStates}).status(200);
})
.get('/module/:id', function(req,res,next){////////////////PAGE MODULE SIMPLE
    if((req.params.id >= 0) && (req.params.id <= 6))
        moduleStates[(req.params.id) - 1] ^= 1;
    res.render('./pages/pageModuleSimple', {id: req.params.id, state:moduleStates[(req.params.id) - 1]});
})
.use(function(req,res,next){///////////////////////////////PAGE ERREUR
    res.status(404).send('<h1>' + 'Erreur 404' + '</h1>');
})
.listen(8080);
console.log("Atelier - Serveur lancé - 8080");