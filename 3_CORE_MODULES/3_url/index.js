const url = require("url");
const address = "https://www.meusite.com.br/catalogo?produtos=cadeira";

const parseUrl = new url.URL(address);

console.log("host: ", parseUrl.host);
console.log("pathname: ", parseUrl.pathname);
console.log("search: ", parseUrl.search);
console.log("searchParams: ", parseUrl.searchParams);
console.log("produtos: ", parseUrl.searchParams.get("produtos"));
console.log("href: ", parseUrl.href);
