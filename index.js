//Probando Node para leer archivos txt y xls por consola 
const fs = require('fs')
const rutaArchivo = './archivo.xls'
// const rutaArchivo = './archivo.txt'
const resultado = fs.readFileSync(rutaArchivo)

console.log(resultado.toString())