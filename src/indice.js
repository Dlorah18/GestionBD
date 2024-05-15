const bodyParser = require ('body-parser');
//es una librería de Node. js que se utiliza con Express para analizar y procesar los datos de solicitudes HTTP
const express=require('express');
const helmet=require('helmet')

const puerto = express();
//puerto.use(helmet)
const exphbs = require('express-handlebars')
//la librería Proporciona mecanismos para: Escritura de manejadores de peticiones con diferentes verbos HTTP en diferentes caminos URL (rutas)
const path=require('path');
//ruta especifica
require('./database');
const index=require('./rutas/index');

//configurar el puerto
puerto.set('escuchar',8081);
puerto.use(express.json());
//puerto-use(bodyParser.json());
puerto.use(bodyParser.urlencoded({extended:true}));


//configurar el engine

puerto.set('views',path.join(__dirname,'./vistas'));

console.log(puerto.get('views'))
puerto.engine(
    //
    "hbs",
    exphbs.engine({
        extname: "hbs",
        defaultLayout: false,
        layoutsDir : 'views\layouts'
        //layoutsDir : path.join(puerto.get('views'), 'layouts')

    })
);



puerto.set('view engine','.hbs');
//console.log("ruta: ",path.join(puerto.get('views'), 'layouts'),)

puerto.listen(puerto.get('escuchar'),()=>{
    console.log('servidor conectado', puerto.get('escuchar'));
});

puerto.use(index);