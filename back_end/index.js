const express = require('express');/* recupere la variable express dans la boite express */
const mongoose  = require('mongoose'); //gere link api base de donnees
require('dotenv').config();/* pour recuperer le fichier env */
var MongoClient = require('mongodb').MongoClient;
var cors = require('cors') //configuration des differentes requettes pour acceder aux ressources

const routes = require('./routes/routes');


const databaseLink = process.env.DATABASE_URL/* permet de recuperer le lien de la base de donnée */

mongoose.connect(databaseLink);/* permet d'avoir access à la base mongodb */
const database = mongoose.connection

const app = express(); /* express sert a ecouté les ports et à envoyer des données */

app.use(cors({origin:'*'}));/*   */

app.use(express.json());/* affiche les fichiers au format json */

app.use('/api', routes);

database.on('error', (error)=> {

console.log(error)

})

//Creation server socket 
const http = require('http').Server(app);

const io = require('socket.io')(http);

database.once('connected', ()=> {
    
console.log('Database Connected')

})

var fs = require('fs');

const { SerialPort } = require('serialport');
var { ReadlineParser } = require("@serialport/parser-readline")
const router = require('./routes/routes');

var port = new SerialPort({ path:'/dev/ttyACM0',
    baudRate: 9600,
    dataBits: 8,
    parity: 'none',
    stopBits: 1,
    flowControl: false
}); 


var parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

var url = "mongodb+srv://fadalba:Thiaroye44@cluster0.daoknxe.mongodb.net/test/";


var temoin = '0'

io.on('connection', function(socket) {
    
    console.log('Node is listening to port');
    socket.on("active", (arg) => {
        console.log(arg); // world
        temoin = arg;
      });
    
});
// ...

// Définissez le gestionnaire d'événement pour les données série
// parser.on('data', function(data) {
//     // Traitez les données ici
//   //  console.log('Données reçues depuis la carte:', data);

//     // Si les données sont au format JSON, vous pouvez les analyser comme suit
//     try {
//         const jsonData = JSON.parse(data);
//         console.log('Données au format JSON:', jsonData);

//         // Émettez les données via Socket.io à tous les clients connectés
//         io.emit('serialData', jsonData);
//     } catch (error) {
//         console.error('Erreur lors de l\'analyse des données JSON:', error);
//     }
// });

// ...

// ...

// ...

// Définissez le gestionnaire d'événement pour les données série
parser.on('data', function (data) {
    // Supposons que les données sont séparées par une virgule
    const dataArray = data.split('/');

    // Vérifiez si les éléments existent avant d'essayer de les accéder
    const valeur1 = dataArray[0];
    var valeur2 = dataArray[1];
//  console.log(data);
    // Affichez les valeurs séparées dans la console à des fins de débogage
    console.log('Valeur 1:', valeur1);
    console.log('Valeur 2:', valeur2);
    io.emit('data',{"valeur2":valeur2},{'valeur1':valeur1},);
     io.emit('valeur2',valeur2);
     io.emit('valeur1',valeur1);

});

// ...

// ...




    const fetchMovies = (socket) => {
        data.findAll()
            .then(data => io.emit('fetchMovies', data))
            .catch(logError)
    }
   

  http.listen(3001, ()=>{
    console.log('server started at ${3001}')/* apres avoir ecouter le port 3000 affiche les données */
})

