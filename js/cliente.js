const data = localStorage.getItem("tasacion_cliente");

if (!data) {
  document.body.innerHTML = "<h2>Informe no disponible</h2>";
  throw "Sin datos de tasación";
}

const resultado = JSON.parse(data);

document.getElementById("sup").innerText = resultado.superficie;
document.getElementById("minimo").innerText = `$ ${resultado.minimo.toLocaleString()}`;
document.getElementById("sugerido").innerText = `$ ${resultado.sugerido.toLocaleString()}`;
document.getElementById("maximo").innerText = `$ ${resultado.maximo.toLocaleString()}`;
