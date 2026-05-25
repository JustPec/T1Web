var express = require("express");
var jwt = require("jsonwebtoken");
var segredo = "123";
var router = express.Router();
const { createHmac, randomUUID } = require("node:crypto");
const DB = require("../src/meu_db");
DB.conecta().then(() => {
  console.log("Banco conectado e pronto!");
});

function auth(req, res, next) {
  var token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({ auth: false, message: "No token provided." });

  jwt.verify(token, segredo, function (err, decoded) {
    if (err)
      return res.status(401).json({ auth: false, message: "Failed to authenticate token." });
    req.username = decoded.username;
    next();
  });
}

router.post("/criaConta", async function (request, response, next) {
  const hash = createHmac("sha256", "oi mundo")
    .update(request.body.passwd)
    .digest("hex");
  let dados = {
    email:  request.body.email,
    nome:   request.body.nome,
    passwd: hash,
  };
  let resultado = await DB.criaConta(dados);
  if (resultado === "erro") {
    return response.status(400).json({ status: "erro", message: "Email já utilizado!" });
  }
  response.json({ status: "sucesso" });
});

router.post("/login", async function (req, res, next) {
  const hash = createHmac("sha256", "oi mundo")
    .update(req.body.password)
    .digest("hex");
  let a = await DB.login({ _id: req.body.email, password: hash });
  if (a == "success") {
    var token = jwt.sign({ username: req.body.email }, segredo, { expiresIn: 1000 });
    return res.json({ auth: true, token: token });
  } else {
    res.status(401).json({ message: "Login inválido!" });
  }
});

router.get("/logoff", auth, function (req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post("/cadastraSensor", auth, async function (req, res, next) {
  let deviceID  = randomUUID();
  let devicePWD = randomUUID();
  let dados = {
    email:     req.username,
    deviceID:  deviceID,
    devicePWD: devicePWD,
    apelido:   req.body.apelido,
    unidade:   req.body.unidade,
  };
  await DB.cadastraSensor(dados);
  res.json({ status: "sucesso", deviceID, devicePWD });
});

router.get("/meusSensores", auth, async function (req, res, next) {
  let sensores = await DB.listaSensores(req.username);
  res.json(sensores);
});

router.put("/editaSensor", auth, async function (req, res, next) {
  await DB.editaSensor(req.username, req.body.deviceID, req.body.apelido);
  res.json({ status: "sucesso" });
});

router.delete("/removeSensor", auth, async function (req, res, next) {
  await DB.removeSensor(req.username, req.body.deviceID);
  res.json({ status: "sucesso" });
});

router.post("/enviaDados", async function (req, res, next) {
  let resultado = await DB.atualizaValor(
    req.body.deviceID,
    req.body.devicePWD,
    req.body.valor
  );
  if (resultado === "sucesso") {
    res.json({ status: "sucesso" });
  } else {
    res.status(401).json({ status: "erro", message: "Dispositivo não autorizado" });
  }
});

module.exports = router;