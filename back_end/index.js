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
const userModelCopy = require('./models/userModel copy');

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
    

      socket.on('RotationPlus', () =>{
        port.write("1")
        });

      socket.on('RotationMoin', () =>{
      port.write("2")
      });
});

let totalRempli = 0;

// Définissez le gestionnaire d'événement pour les données série
parser.on('data', function (data) {
    // Supposons que les données sont séparées par une virgule
    const dataArray = data.split('/');

    // Vérifiez si les éléments existent avant d'essayer de les accéder
    var valeur1 = dataArray[1];
    var valeur2 = dataArray[0];
    var valeur3 = dataArray[2];
    var valeur4 = dataArray[3];
    var valeur5 = dataArray[4];
    var valeur6 = dataArray[5];
    var valeur7 = dataArray[6];
//  console.log(data);
    // Affichez les valeurs séparées dans la console à des fins de débogage
    console.log('Valeur 1:', valeur1);
    console.log('Valeur 2:', valeur2);
    console.log('Valeur 3:', valeur3);
    console.log('Valeur 4:', valeur4);
    console.log('valeur5:', valeur5);
    console.log('valeur6:', valeur6);
    console.log('valeur7:', valeur7);
    io.emit('data',{"valeur2":valeur2},{'valeur1':valeur1},{"valeur3":valeur3},{'valeur4':valeur4},{'valeur5':valeur5},{'valeur6':valeur6},{'valeur7':valeur7});
     io.emit('valeur2',valeur2);
     io.emit('valeur1',valeur1);
     io.emit('valeur3',valeur3);
     io.emit('valeur4',valeur4);
     io.emit('valeur5',valeur5);
     io.emit('valeur6',valeur6);
     io.emit('valeur7',valeur7);


   

     var datHeure = new Date();
var min = datHeure.getMinutes();
var heur = datHeure.getHours(); //heure
var sec = datHeure.getSeconds(); //secondes
var mois = datHeure.getDate(); //renvoie le chiffre du jour du mois
var numMois = datHeure.getMonth() + 1; //le mois en chiffre
var laDate = datHeure.getFullYear(); // me renvoie en chiffre l'annee
if (numMois < 10) { numMois = '0' + numMois; }
if (mois < 10) { mois = '0' + mois; }
if (sec < 10) { sec = '0' + sec; }
if (min < 10) { min = '0' + min; }
var heureInsertion = heur + ':' + min + ':' + sec;
var heureEtDate = laDate  + '-' + numMois + '-' +  mois;

     var tempEtHum = { 'Date': heureEtDate, 'Heure': heureInsertion , 
     "temperature": valeur2, "humidite": valeur1,
      'temperature_THC_C':valeur3, 'temperature_THC_F':valeur4,
    'Photoresistance_XG':valeur5, 'Photoresistance_XD':valeur6}; 

       if ((heur == 8 && min == 0 && sec == 0) 
       || (heur == 12 && min == 0 && sec == 0) 
    || (heur == 18 && min == 42 && sec == 30)) { 
         //Connexion a mongodb et insertion Temperature et humidite
         MongoClient.connect(url, { useUnifiedTopology: false }, function(err, db) {
            if (err) throw err;
            var dbo = db.db("test");
            dbo.collection("donnees").insertOne(tempEtHum, function(err, res) 

            {
                if (err) throw err;
                db.close();
            });
            console.log("1 document inserted");

        })
    }
  
    });
    
  http.listen(3001, ()=>{
    console.log('server started at ${3001}')/* apres avoir ecouter le port 3000 affiche les données */
})

