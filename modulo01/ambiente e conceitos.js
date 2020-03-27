const express = require("express");
const server = express();

server.use(express.json());

// Query params OK
// Route params Em progresso passo 2
// Request body

const users = [
  "Dunga",
  "Atchim",
  "Dengoso",
  "Mestre",
  "Feliz",
  "Zangado",
  "Soneca"
];

//middleware:
server.use((req, res, next) => {
  console.time("request");
  console.log("middleware ok");
  console.log(`Metodo:  ${req.method} URL: ${req.url}`);
  next();
  console.timeEnd("request");
});

function verificaSeNomeExiste(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "Necessário informar name" });
  }
  next();
}

function verificaNomeEmArray(req, res, next) {
  if (!users[req.params.index]) {
    return res.status(400).json({ error: "Usuário não existe." });
  }

  return next();
}
//end - middleware

server.get("/users", (req, res) => {
  return res.json(users);
});

server.get("/users/:index", (req, res) => {
  const { index } = req.params;

  return res.json(users[index]);
});

server.post("/users", verificaSeNomeExiste, (req, res) => {
  const { name } = req.body;

  users.push(name);

  console.log(users);
  return res.json(users);
});

server.put("/users/:index", verificaSeNomeExiste, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;
  users[index] = name;
  return res.json(users);
});

server.delete("/users/:index", verificaNomeEmArray, (req, res) => {
  const { index } = req.params;
  if (users[index]) {
    users.splice(index, 1);
    return res.json({ mensagem: "Usuário removido" });
  } else {
    return res.json({ mensagem: "Usuário não encontrado" });
  }
});

server.listen(3000);
