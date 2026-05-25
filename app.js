const PORTA = 7000;

var express = require("express");
var app = express();

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use("/", require("./routes"));

app.use(function (err, request, response, next) {
  next(err);
});

app.use(function (err, request, response, next) {
  response.status(err.status || 500).json({
    err: err.message,
  });
});

app.listen(PORTA, function () {
  console.log("servidor rodando. Atendendo requisições na porta " + PORTA);
});
