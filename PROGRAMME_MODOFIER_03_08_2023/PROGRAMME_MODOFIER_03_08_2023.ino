#include <max6675.h>
#include <Servo.h>
#include <DHT.h>

#define NB_BIT           8       // Nombre de tansistors
#define NB_COMBINAISON   (int)pow(2,NB_BIT)// Nombre de combinaison possible
#define ATTENTE          1    // Attente après chaque commutation microseconde

#define I_ANG_POS_0   0 // Index de l'angle du servomoteur dans le tableau (position par défaut) 
#define I_ANG_POS_1   1 // Index de l'angle du servomoteur dans le tableau
#define I_ANG_POS_2   2 // Index de l'angle du servomoteur dans le tableau
#define I_ANG_POS_3   3 // Index de l'angle du servomoteur dans le tableau
int angle[4] = {40,60,90,120};

// Pins utilisés
#define BOUTON_T      2 // permet de déclancher la commutation des transistors
#define PIN_SERVO_RX  11
#define PIN_DHT       12
#define PIN_PHOTO_X_G A3 // Photorésistance à gauche et contrôle la rotation suivant RX
#define PIN_PHOTO_X_D A4 // Photorésistance à Droite et contrôle la rotation suivant RX
const int tab[NB_BIT] = {3,4,5,6,7,8,9,10};// Pins de commutation des transistors NPN
// Pins thermocouple
#define thermoDO   A2
#define thermoCS   A1
#define thermoCLK  A0
int lampe = A5;
int global_i;
Servo rxPos;
DHT dht(PIN_DHT, DHT11);
MAX6675 thermocouple(thermoCLK, thermoCS, thermoDO);

bool etat = false; // Active ou pas la commutation
 
// Prototypes
void clique(void);
void temperatureDHT11(void);
void temperatureThermocouple(void);
void gestionServo(int etat);
int autoRotationX(void); 


void setup(){
    Serial.begin(9600);
    dht.begin();
   // Serial.println("NB combinaison : " + String(NB_COMBINAISON));
    // Initialisation des pins
    for(int i = 0; i < NB_BIT; ++i){
       pinMode(tab[i], OUTPUT);
       pinMode(lampe, OUTPUT);
    } 
    pinMode(PIN_PHOTO_X_G,INPUT);
    pinMode(PIN_PHOTO_X_D,INPUT);

    // Servomoteur
    rxPos.attach(PIN_SERVO_RX);
    rxPos.write(angle[I_ANG_POS_0]);

    pinMode(BOUTON_T, INPUT_PULLUP);
    delay(1000);
    attachInterrupt(digitalPinToInterrupt(BOUTON_T), clique, FALLING);
}


void loop(){
  temperatureDHT11(); // Appel à la fonction
  temperatureThermocouple();

	if(etat == true){
    for (int i = (I_ANG_POS_0 - 1); i <= I_ANG_POS_3; ++i){
      if(i == (I_ANG_POS_0 - 1))
        gestionServo(autoRotationX());// Appel à la fonction
      else
        gestionServo(angle[i]);// Position initiale

  		for(int l = 0; l < NB_COMBINAISON; ++l){
        temperatureDHT11(); // Appel à la fonction
        temperatureThermocouple();
        Serial.println("Ligne : " + String(l));
        
        for(int c = 0; c < NB_BIT; ++c){
          digitalWrite(tab[c], bitRead(l,c));
          Serial.print(bitRead(l,c));
        }

        if(etat == false){
          gestionServo(angle[I_ANG_POS_0]);// Position initiale
          break;
        }
        Serial.println();
        delayMicroseconds(ATTENTE);
      }
      // Fin boucle
      if(etat == false)
        break;

      delay(2000);
	  } 
    
    gestionServo(angle[I_ANG_POS_0]);// Position initiale
    etat = false;

  }

	else{// on désactive tout
    for(int c = 0; c < NB_BIT; ++c){
      digitalWrite(tab[c],LOW);
    }
    gestionServo(angle[I_ANG_POS_0]);// Position initiale
  }// fin else   

  delay(1000);

        //INTERFACE APPLICATION WEB ******************
                if (Serial.available() > 0) { // Si des données sont disponibles sur le port série
                   char condition = Serial.read();
                   temperatureDHT11(); // Appel à la fonction
                   temperatureThermocouple();
                if(condition == '1'){
                   etat = true;
                 if(etat == true){
                   for (int i = (I_ANG_POS_0 - 1); i <= I_ANG_POS_3; ++i){
                     digitalWrite(lampe,HIGH);
                    if(i == (I_ANG_POS_0 - 1))
                     gestionServo(autoRotationX());// Appel à la fonction
                      else
                     gestionServo(angle[i]);// Position initiale
                        for(int l = 0; l < NB_COMBINAISON; ++l){
                     temperatureDHT11(); // Appel à la fonction
                     temperatureThermocouple();
                   //Serial.println("Ligne : " + String(l));
                     for(int c = 0; c < NB_BIT; ++c){
                     digitalWrite(tab[c], bitRead(l,c));
                   //  Serial.print(bitRead(l,c));
                  }

                      if(etat == false){
                     gestionServo(angle[I_ANG_POS_0]);// Position initiale
                     break;
                     digitalWrite(lampe,LOW);
                  }
                   // Serial.println();
                    delayMicroseconds(ATTENTE);
                              }
                  // Fin boucle
                   digitalWrite(lampe,LOW);
                    //Serial.print(i);
                    global_i = i;                  //  etat = false;
              
                 if(etat == false)
                  break;
                 delay(2000);
                } 
                etat = false;
                   digitalWrite(lampe,LOW);
                gestionServo(angle[I_ANG_POS_0]);// Position initiale
                etat = false;
               }
                 else{// on désactive tout
                  for(int c = 0; c < NB_BIT; ++c){
               digitalWrite(tab[c],LOW);
              }
               gestionServo(angle[I_ANG_POS_0]);// Position initiale
              }
   
              }
      
}

}// Fin loop()


void clique(){
  etat=!etat;
}


void temperatureDHT11(){
 // Serial.print("Température dht 11 : "+ String(dht.readTemperature()));
 Serial.print(int(dht.readTemperature()));
  Serial.print("/");
 // Serial.print("Humidité dht 11: "+ String(dht.readHumidity()));
 Serial.print(int(dht.readHumidity()));
 //Serial.println();
   Serial.print("/");


}


void temperatureThermocouple(void){
  //Serial.print("thermocouple : " + String(thermocouple.readCelsius()));
 Serial.print(int(thermocouple.readCelsius()));
   Serial.print("/");
 Serial.print(int(thermocouple.readFahrenheit()));
  //Serial.println(" °C");
  //Serial.print("thermocouple : " + String(thermocouple.readFahrenheit()));
  //Serial.println(" F");
   Serial.print("/");
   Serial.print(map(analogRead(PIN_PHOTO_X_G),0,1023,0,100));
   Serial.print("/");
   Serial.print(map(analogRead(PIN_PHOTO_X_D),0,1023,0,100));
   Serial.print("/");
  Serial.println(global_i);
}


void gestionServo(int etat){
  // Décrémentation de l'angle
  if(etat < rxPos.read()){
    for (int i= rxPos.read(); i >= etat ; --i){
      rxPos.write(i);
      delay(10);
    } 
   //Serial.println("\nPosition servo : "+ String(rxPos.read())); 
    return;
  }
  // Incrémentation de l'angle
  else if(etat > rxPos.read()){
    for (int i = rxPos.read(); i <= etat ; ++i){
      rxPos.write(i);
      delay(10);
    } 
   //Serial.println("\nPosition servo : "+ String(rxPos.read())); 
    return;
  }
}

int autoRotationX(){
  int valueXg = map(analogRead(PIN_PHOTO_X_G),0,1023,0,180);
int valueXd = map(analogRead(PIN_PHOTO_X_G),0,1023,0,180);
int value   = (valueXd+valueXg)/2;
  
  if(value < 50)
    value = 50 ; // angle minimum
  if(value > 120)
    value = 120 ;// angle maximum
  //Serial.println(value);
  return value;
}
