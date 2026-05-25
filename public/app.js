function O(id) {
  return document.getElementById(id);
}

function mostraTela1() {
  O('tela1').style.display = 'block';
  O('tela2').style.display = 'none';
}

function mostraTela2() {
  O('tela2').style.display = 'block';
  O('tela1').style.display = 'none';
}

function abrirModal() {
  O('modal-overlay').style.display = 'block';
  O('msg-cadastro').textContent = '';
}

function fecharModal() {
  O('modal-overlay').style.display = 'none';
}

async function cadastrar() {
  let dados = {
    email:  O('novo-email').value,  
    nome:   O('novo-nome').value,    
    passwd: O('novo-passwd').value,
  };

  try {
    let res = await axios.post('/criaConta', dados);
    O('msg-cadastro').textContent = 'Conta criada com sucesso!';
    O('msg-cadastro').style.color = 'green';
    setTimeout(fecharModal, 1500);
  } catch (err) {
    O('msg-cadastro').textContent = err.response.data.message;
    O('msg-cadastro').style.color = 'red';
  }
}

function botao() {
  let username = O("id").value;
  let password = O("passwd").value;

  axios.post('/login', { email: username, password: password })
    .then(function (res) {
      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
         axios.defaults.headers.common['x-access-token'] = res.data.token;
        window.location.href = '/painel.html';
}
    })
    .catch(function (err) {
      alert('Nao autorizado');
    });
}

async function fazLogoff(tela) {
  await fetch('/logoff');
  axios.defaults.headers.common['x-access-token'] = '';
  tela();
}

