const mongoose = require('mongoose');

const { database } = require('./keys');
// Destructura el objeto para acceder únicamente a él.

mongoose.connect(database.URI, {useNewUrlParser: true}).then((value) => {
    console.log(`Conectado a la base de datos`)
}).catch((reason) => {
    console.log(`Error en la conexión ${reason}`)
});