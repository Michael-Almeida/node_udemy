const path = require("path");

console.log(path.resolve("teste.txt"));

//formar path
const midFolder = "relatorios";
const fileName = "michael.txt";

const finalPath = path.join("/", "arquivos", midFolder, fileName);

console.log(finalPath);
