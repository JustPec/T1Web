function O(id) {
  return document.getElementById(id);
}

document.addEventListener('DOMContentLoaded', function () {
  let token = localStorage.getItem('token');
  if (!token) {
    window.location.href = '/index.html';
    return;
  }
  axios.defaults.headers.common['x-access-token'] = token;
  carregaSensores(); 
  setInterval(carregaSensores, 5000);
});



async function carregaSensores() {
  let res = await axios.get('/meusSensores');
  let lista = O('lista-sensores');
  lista.innerHTML = '';

  if (res.data.length === 0) {
    lista.innerHTML = '<p>Nenhum sensor cadastrado.</p>';
    return;
  }

  res.data.forEach(function (sensor) {
    lista.innerHTML += `
      <div style="border:1px solid #ccc; padding:10px; margin:10px 0;">
        <b>${sensor.apelido}</b> — ${sensor.unidade}<br>
        DeviceID: ${sensor.deviceID}<br>
        Valor atual: ${sensor.valor ?? 'Aguardando dados...'}<br><br>
        <button onclick="editar('${sensor.deviceID}', '${sensor.apelido}')">Editar</button>
        <button onclick="remover('${sensor.deviceID}')">Remover</button>
      </div>
    `;
  });
}

async function editar(deviceID, apelidoAtual) {
  let novoApelido = prompt('Novo apelido:', apelidoAtual);
  if (!novoApelido) return;

  await axios.put('/editaSensor', { deviceID, apelido: novoApelido });
  carregaSensores();
}

async function remover(deviceID) {
  if (!confirm('Tem certeza que deseja remover este sensor?')) return;

  await axios.delete('/removeSensor', { data: { deviceID } });
  carregaSensores();
}

function abrirModal() {
  O('modal-sensor').style.display = 'block';
  O('msg-sensor').textContent = '';
}

function fecharModal() {
  O('modal-sensor').style.display = 'none';
}

async function confirmarCadastro() {
  let dados = {
    apelido: O('sensor-apelido').value,
    unidade: O('sensor-unidade').value,
  };

  try {
    let res = await axios.post('/cadastraSensor', dados);
    O('msg-sensor').style.color = 'green';
    O('msg-sensor').textContent = 'Sensor cadastrado! DeviceID: ' + res.data.deviceID;
    carregaSensores(); 
    setTimeout(fecharModal, 3000);
  } catch (err) {
    O('msg-sensor').style.color = 'red';
    O('msg-sensor').textContent = 'Erro ao cadastrar sensor.';
  }
}

function logout() {
  localStorage.removeItem('token');
  axios.defaults.headers.common['x-access-token'] = '';
  window.location.href = '/index.html';
}