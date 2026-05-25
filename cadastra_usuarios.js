const { MongoClient } = require("mongodb");

const { createHmac } = require("node:crypto");

var credenciais;
var db;
var client;

async function conecta() {
  client = new MongoClient("mongodb+srv://admin:admin123@cluster0.7hwaab6.mongodb.net");
  await client.connect();
  db = await client.db("DB_prof");
  credenciais = await db.collection("users");
}

async function inicio() {
  await conecta();
  let ID = process.argv[2];
  let password = createHmac("sha256", "oi mundo")
    .update(process.argv[3])
    .digest("hex");

  let idade = process.argv[4];
  let CPF = process.argv[5];

  await credenciais.insertOne({
    _id: ID,
    idade: idade,
    CPF: CPF,
    password: password,
  });
  await client.close();
}

console.log(process.argv.length);

if (process.argv.length == 6) {
  inicio();
} else {
  console.log("Forma de usar:   cadastra_usuarios ID senha idade CPF");
  console.log("Exemplo:         cadastra_usuarios frr teste123 46 123456");
}
