const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


//mongoose.Schema: Define la estructura del documento en MongoDB.
const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
//pre('save', async function(next)): Ejecuta una función antes de guardar el documento.
/*UserSchema.pre('save', async function (next) {
    //bcrypt.genSalt(15): Genera un "sal" aleatorio para encriptar la contraseña.
    bcrypt.genSalt(15).then(salts => {
        //await bcrypt.hash(this.password, salts): Encripta la contraseña usando el sal generado.
        bcrypt.hash(this.password, salts).then(hash => {
            //this.password = hash: Asigna el hash de la contraseña encriptada al campo de la contraseña.
            this.password = hash;
            console.log("this.password ",this.password)
            //next(): Indica que la función pre-save ha terminado.
            next();
        }).catch(error => next());
    }).catch(error => next());

});*/

UserSchema.pre('save', async function (next) {
    try {
      // Genera un "sal" aleatorio para encriptar la contraseña.
      const salt = await bcrypt.genSalt(15);
  
      // Encripta la contraseña usando el sal generado.
      const hash = await bcrypt.hash(this.password, salt);
  
      // Asigna el hash de la contraseña encriptada al campo de la contraseña.
      this.password = hash;
  
      // Imprime el valor de la contraseña encriptada.
      console.log("this.password ", this.password);
  
      // Indica que la función pre-save ha terminado.
      next();
    } catch (error) {
      // Manejar el error
      next(error);
    }
  });
  
//mongoose.model('clientes', UserSchema): Crea un modelo de Mongoose para interactuar con la colección de usuarios en MongoDB.
const User = mongoose.model('clientes', UserSchema);

module.exports = User;
