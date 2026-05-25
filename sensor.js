const deviceID  = process.argv[2];
const devicePWD = process.argv[3];

if (!deviceID || !devicePWD) {
  console.log("Uso: node sensor.js <deviceID> <devicePWD>");
  process.exit(1);
}

async function enviaDados() {
  let valor = (Math.random() * 100).toFixed(2);

  try {
    let res = await fetch('http://localhost:7000/enviaDados', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceID, devicePWD, valor })
    });
    let data = await res.json();
    console.log('Valor enviado:', valor, '| Resposta:', data.status);
  } catch (err) {
    console.log('Erro ao enviar dados:', err.message);
  }
}

setInterval(enviaDados, 5000);
console.log('Sensor iniciado! Enviando dados a cada 5 segundos...');