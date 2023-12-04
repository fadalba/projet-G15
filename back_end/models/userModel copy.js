const mongoose = require('mongoose');

const data1Schema = new mongoose.Schema({
temperature: {
type: String
},
humidite: {
type: String
},
temperature_THC_C: {
    type:String
},
temperature_THC_F: {
    type:String
},
Photorésistance_XG: {
    type: String
},
Photorésistance_XD: {
    type: String
},
Date: {
type: String
},
Heure: {
type: String
}
})


module.exports = mongoose.model('climat', data1Schema);/* users nom de la collection */