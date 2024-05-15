// Importa la librería mongoose
const mongoose = require('mongoose');

// Extrae el objeto Schema de mongoose
const { Schema } = mongoose;

// Define el esquema del modelo para la colección de pedidos
const UserSchema = new Schema({
    // Define los campos del esquema:
    id_pedido: { type: String, required: true }, // Campo para el ID del pedido, de tipo String y obligatorio
    comprador: { type: String, required: true }, // Campo para el comprador, de tipo String y obligatorio
    valor: { type: Number, required: true }, // Campo para el valor, de tipo Number y obligatorio
    articulo: { type: String, required: true }, // Campo para el artículo, de tipo String y obligatorio
    descripcion: { type: String, required: true }, // Campo para la descripción, de tipo String y obligatorio
    date: { type: Date, default: Date.now } // Campo para la fecha, de tipo Date y con valor por defecto la fecha actual
});

// Exporta el modelo definido, asociándolo a la colección 'pedidos'
module.exports = mongoose.model('pedidos', UserSchema);
