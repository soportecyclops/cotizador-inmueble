function calcular() {
  let data = {
    direccion: document.getElementById("direccion").value,
    cubierta: Number(document.getElementById("cubierta").value),
    estado: Number(document.getElementById("estado").value)
  };

  let r = calcularTasacion(data);

  document.getElementById("interno").innerHTML = `
    Valor interno: USD ${r.sugerido}<br>
    Rango: ${r.min} – ${r.max}
  `;

  sessionStorage.setItem("tasacion", JSON.stringify({
    direccion: data.direccion,
    resultado: r
  }));

  document.getElementById("linkCliente").href = "cliente.html";
}
