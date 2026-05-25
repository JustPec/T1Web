const { MongoClient } = require("mongodb");

var db;
var users;

async function conecta() {
  var client = new MongoClient("mongodb+srv://admin:admin123@cluster0.7hwaab6.mongodb.net");
  await client.connect();
  db = client.db("DB_prof");
  users = db.collection("users");  
  console.log("Conectou no banco de dados");
}

async function criaConta(dados) {
  try {
    let a = await users.insertOne({
      _id:      dados.email,
      nome:    dados.nome,
      password: dados.passwd,
    });
    return "sucesso";
  } catch (e) {
    return "erro";
  }
}

async function login(dados) {
  let a = await users.findOne({ _id: dados._id, password: dados.password });
  if (a == null) return "failure";
  return "success";
}

async function listaSensores(email) {
  if (!users) return [];
  let user = await users.findOne({ _id: email });
  if (!user) return [];
  return user.sensores || [];
}

async function editaSensor(email, deviceID, novoApelido) {
  await users.updateOne(
    { _id: email, "sensores.deviceID": deviceID },
    { $set: { "sensores.$.apelido": novoApelido } }
  );
  return "sucesso";
}

async function removeSensor(email, deviceID) {
  await users.updateOne(
    { _id: email },
    { $pull: { sensores: { deviceID: deviceID } } }
  );
  return "sucesso";
}

async function atualizaValor(deviceID, devicePWD, valor) {
  let result = await users.updateOne(
    { "sensores.deviceID": deviceID, "sensores.devicePWD": devicePWD },
    { $set: { "sensores.$.valor": valor } }
  );
  if (result.modifiedCount === 0) return "erro";
  return "sucesso";
}

async function cadastraSensor(dados) {
  try {
    await users.updateOne(
      { _id: dados.email },
      { $push: { sensores: {
        deviceID:  dados.deviceID,
        devicePWD: dados.devicePWD,
        apelido:   dados.apelido,
        unidade:   dados.unidade,
        valor:     null
      }}}
    );
    return "sucesso";
  } catch (e) {
    return "erro";
  }
}

module.exports = { conecta, criaConta, login, cadastraSensor, listaSensores, editaSensor, removeSensor, atualizaValor };
