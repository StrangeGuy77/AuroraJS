const mongoose = require("mongoose");

const { database } = require("./keys");
mongoose.set("useFindAndModify", false);
mongoose
  .connect(database.URI, { useNewUrlParser: true })
  .then(() => {
    console.log(`Conectado a la base de datos`);
  })
  .catch(reason => {
    console.log(`Error en la conexión ${reason}`);
  });
