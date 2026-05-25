# Sistema IoT — Gerenciamento de Sensores

Sistema web para gerenciamento de dispositivos sensores IoT. Permite que usuários cadastrem sensores, visualizem os dados enviados por eles e gerenciem seus dispositivos.

## Tecnologias

- Node.js + Express
- MongoDB (Atlas)
- JWT (autenticação)
- HMAC-SHA256 (criptografia de senhas)

## Como rodar

**1. Instale as dependências**
```bash
npm install
```

**2. Inicie o servidor**
```bash
node app.js
```

O servidor sobe na porta **7000**. Acesse `http://localhost:7000`.

## Simulando um sensor

Após cadastrar um sensor pelo painel web, você receberá um `deviceID` e um `devicePWD`. Use-os para rodar o simulador:

```bash
node sensor.js <deviceID> <devicePWD>
```

O sensor enviará valores aleatórios ao servidor a cada 5 segundos.

## Rotas da API

| Método | Rota | Autenticação | Descrição |
|--------|------|-------------|-----------|
| POST | `/criaConta` | Pública | Cadastra novo usuário |
| POST | `/login` | Pública | Autentica e retorna token JWT |
| GET | `/logoff` | Token JWT | Encerra sessão |
| POST | `/cadastraSensor` | Token JWT | Cadastra novo sensor |
| GET | `/meusSensores` | Token JWT | Lista sensores do usuário |
| PUT | `/editaSensor` | Token JWT | Edita apelido de um sensor |
| DELETE | `/removeSensor` | Token JWT | Remove um sensor |
| POST | `/enviaDados` | deviceID + devicePWD | Sensor envia valor |

Rotas protegidas exigem o token no header: `x-access-token: <token>`

## Estrutura do projeto

```
├── app.js               # Servidor Express
├── routes/
│   └── index.js         # Rotas da API
├── src/
│   └── meu_db.js        # Funções de acesso ao MongoDB
├── public/              # Frontend (HTML/JS)
├── sensor.js            # Simulador de sensor
└── cadastra_usuarios.js # Script para cadastro via terminal
```

## .gitignore recomendado

```
node_modules/
```
