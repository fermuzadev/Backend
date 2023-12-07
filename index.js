//Probando Node para leer archivos txt y xls por consola 
const fs = require('fs')
// const rutaArchivo = './archivo.xls'
const rutaArchivo = './archivo.txt'
const resultado = fs.readFileSync(rutaArchivo, 'utf-8')
const string = 'Texto que agrego por programacion'
console.log(resultado)

const resultado2 = fs.appendFileSync(rutaArchivo, string, 'utf-8')

console.log(resultado)