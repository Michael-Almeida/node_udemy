const http = require("http");

const port = 3000;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Contenty-type", "text/html");
  res.end(
    "<h1>Olá, este é meu primeiro server com html</h1><p>Testando atualização</p>"
  );
});

server.listen(port, () => {
  console.log(`Servidor conectado na porta ${port}`);
});
