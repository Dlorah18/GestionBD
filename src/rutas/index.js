const { Router } = require("express")
const express = require('express')
const archivo = express.Router();
const User = require('../modelado/registro')
const orden = require('../modelado/crear_pedidos')
const moment = require('moment');
const path=require('path');
const mediaserver = require('mediaserver');
const fs = require('fs');




//const passport =require('passport')


const bcrypt = require('bcrypt')

/*GET*/
archivo.get('/', (req, res, next) => {
    res.render('inicio');
})


archivo.get('/inicioSesion', (req, res, next) => {
    res.render('inicioSesion')
}
)

archivo.get('/formulario', (req, res, next) => {
    res.render('formulario')
})


archivo.get('/crear_pedido', (req, res, next) => {
    res.render('crear_pedido')
})

archivo.get('/consultar_pedido', (req, res, next) => {
    res.render('consultar_pedido')
})

archivo.get('/update_pedido', (req, res, next) => {
    res.render('update_pedido')
})

archivo.get('/delete_pedido', (req, res, next) => {
    res.render('delete_pedido')
})

/*POST*/

archivo.post('/formulario', async (req, res) => {
    //Asigno una constantes y asignarles y asignarles los valores correspondiente al objeto req.body
    const { email, password, date } = req.body;

    /*Declarar la constante E y asignarle el valor obtenido de la función User.findOne con el filtro {email}
     await : Esta palabra clave se utiliza para indicar que la línea de código debe esperar a que la función User.findOne termine de ejecutarse antes de continuar.*/
    const E = await User.findOne({ email })

    if (E) {
        res.send('el email ya existe')
    } else {
        const nuevoU = new User({ email, password, date })
        await nuevoU.save()
        res.send('el documento se guardo satisfactoriamente')
    }
})

archivo.post('/inicioSesion', async (req, res) => {
    // Extraemos los datos del cuerpo de la solicitud
    const { email, password, date } = req.body;

    // Buscamos un usuario en la base de datos con el email proporcionado
    const user = await User.findOne({ email });

    // Verificamos si se encontró un usuario con el email proporcionado
    if (user) {
        // Si el usuario existe, comparamos la contraseña proporcionada con la contraseña almacenada en la base de datos
        var clavex = req.body.password; // Contraseña proporcionada en la solicitud
        var p = user.password; // Contraseña almacenada en la base de datos para el usuario encontrado

        // Comparamos las contraseñas utilizando bcrypt
        bcrypt.compare(clavex, p, function (error, isMatch) {
            // Manejamos cualquier error que pueda ocurrir durante la comparación
            if (error) {
                throw error;
            } else if (!isMatch) {
                // Si las contraseñas no coinciden, enviamos un mensaje indicando que la contraseña no es correcta
                res.send("La contraseña no es correcta");
            } else {
                // Si las contraseñas coinciden, redirigimos al usuario a la página de inicio (home)
                res.render('home');
            }
        });
    } else {
        // Si no se encuentra un usuario con el email proporcionado, redirigimos al usuario a un formulario de inicio de sesión
        res.render('formulario');
    }
});


archivo.post('/crear_pedido', async (req, res) => {
    // Extraemos los datos del pedido del cuerpo de la solicitud
    const { id_pedido, comprador, valor, articulo, descripcion, date } = req.body;

    // Buscamos si ya existe un pedido con el mismo id_pedido
    const pedidoExistente = await orden.findOne({ id_pedido });

    // Verificamos si el pedido ya existe en la base de datos
    if (pedidoExistente) {
        // Si el pedido ya existe, enviamos un mensaje indicando esto al cliente
        res.send('El pedido ya existe');
    } else {
        // Si el pedido no existe, creamos un nuevo objeto de pedido
        const nuevoPedido = new orden({ id_pedido, comprador, valor, articulo, descripcion, date });

        // Guardamos el nuevo pedido en la base de datos
        await nuevoPedido.save();

        // Enviamos un mensaje indicando que el pedido fue guardado satisfactoriamente
        res.send('El pedido fue guardado satisfactoriamente');
    }
});


archivo.post('/consultar_pedido', async (req, res) => {
    // Extraemos el id_pedido del cuerpo de la solicitud
    const { id_pedido } = req.body;

    // Buscamos en la base de datos un pedido con el id_pedido proporcionado
    const Cp = await orden.findOne({ id_pedido });

    // Verificamos si el pedido existe en la base de datos
    if (Cp) {
        // Si el pedido existe, realizamos otra consulta para obtener más detalles del pedido
        // y ordenamos los resultados por la fecha de creación en orden descendente
        const resultado = await orden.findOne(
            { id_pedido }, // Filtro para encontrar el pedido
            { // Proyección para seleccionar solo los campos necesarios
                "id_pedido": 1,
                "comprador": 1,
                "valor": 1,
                "articulo": 1,
                "descripcion": 1,
                "date": 1
            }
        ).sort('-created'); // Ordenamos por fecha de creación descendente

        // Enviamos el resultado al cliente
        res.render('pedidoTable', {
            id_pedido: resultado.id_pedido,
            comprador: resultado.comprador,
            valor: resultado.valor,
            articulo: resultado.articulo,
            descripcion: resultado.descripcion,
            date: moment(resultado.date).format('D/M/YYYY')
        });
    } else {
        // Si el pedido no existe, enviamos un mensaje indicando esto al cliente
        res.send('El pedido no existe');
    }
});

archivo.post('/update_pedido', async (req, res) => {
    // Extraemos el id_pedido, comprador, valor, articulo y descripcion del cuerpo de la solicitud
    const { id_pedido, comprador, valor, articulo, descripcion } = req.body;
    try {
        // Buscamos en la base de datos un pedido con el id_pedido proporcionado
        const update_p = await orden.findOne({ id_pedido });

        // Verificamos si el pedido existe en la base de datos
        if (update_p) {
            let body=req.body
            // Actualizamos los detalles del pedido
            const info = await orden.updateOne({ id_pedido }, {
                $set: {
                    descripcion:body.descripcion,
                    //comprador:body.comprador,
                    //valor:body.valor,
                    //articulo:body.articulo,
                }
            });

            // Enviamos una respuesta indicando el éxito de la operación junto con la información actualizada
            res.json({
                resultado: true,
                info
            });

        } else {
            // Si el pedido no existe, enviamos un mensaje indicando esto al cliente
            res.send('El pedido no existe');
        }
    } catch (error) {
        // Si ocurre algún error durante la actualización, respondemos con un mensaje de error
        res.json({
            resultado: false,
            msg: "No se pudo realizar la actualizacion",
            error
        });
    }
});


archivo.post('/delete_pedido', async (req, res) => {
    // Extraemos el id_pedido del cuerpo de la solicitud
    const { id_pedido } = req.body;
   
        // Buscamos en la base de datos un pedido con el id_pedido proporcionado
        const delete_p = await orden.findOne({ id_pedido });

        // Verificamos si el pedido existe en la base de datos
        if (delete_p) {
            // Si el pedido existe, lo eliminamos de la base de datos
            const info = await orden.deleteOne({ id_pedido });
            // Enviamos una respuesta indicando que el pedido fue eliminado correctamente
            //res.redirect('http://localhost:8081/audio/RegistroActualizado.mp3')
            
            res.redirect('https://gestionbd-2686-harold.up.railway.app/audio/RegistroActualizado.mp3')
        

        } else {
            //res.redirect('http://localhost:8081/audio/RegistroNoExiste.mp3')
            res.redirect('https://gestionbd-2686-harold.up.railway.app/audio/RegistroNoExiste.mp3')
        }
    
});

  archivo.get('/audio/:mp3', (req, res) => {
    // Ruta al archivo de audio MP3
    const audioFilePath = path.join(__dirname, 'audio',req.params.mp3);
  
    // Verificar si el archivo existe
    fs.access(audioFilePath, fs.constants.F_OK, (err) => {
      if (err) {
        // Si hay un error, devolver un error 404
        res.status(404).send('Archivo no encontrado');
        return;
      }
  
      // Si el archivo existe, establecer los encabezados de la respuesta
      res.set({
        'Content-Type': 'audio/mpeg',
      });
  
      // Leer el archivo de audio y enviarlo como respuesta
      fs.createReadStream(audioFilePath).pipe(res);
    });
  });
module.exports = archivo;

