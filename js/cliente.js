// Datos que normalmente vendrían del asesor o backend
// (por ahora simulados)

const resultado = {
  minimo: 95000,
  sugerido: 100000,
  maximo: 105000,
  superficie: 100
};

document.getElementById("sup").innerText = resultado.superficie;
document.getElementById("minimo").innerText = `$ ${resultado.minimo.toLocaleString()}`;
document.getElementById("sugerido").innerText = `$ ${resultado.sugerido.toLocaleString()}`;
document.getElementById("maximo").innerText = `$ ${resultado.maximo.toLocaleString()}`;
