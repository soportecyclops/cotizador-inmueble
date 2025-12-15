// Valor m² base (temporal hasta unir comparables)
let valorM2Base = 1850.74;

// Ajuste acumulado por factores cualitativos
let ajusteCualitativo = 0;

export function setAjusteCualitativo(valor) {
  ajusteCualitativo = valor;
  calcularComposicion();
}

export function calcularComposicion() {
  const inputs = document.querySelectorAll(".m2");
  let total = 0;

  const valorM2Ajustado = valorM2Base * (1 + ajusteCualitativo);

  inputs.forEach(input => {
    const m2 = parseFloat(input.value) || 0;
    const factor = parseFloat(input.dataset.factor);
    const homologado = m2 * factor;
    const subtotal = homologado * valorM2Ajustado;

    total += subtotal;

    const fila = input.closest("tr");
    fila.children[3].textContent = homologado.toFixed(2);
    fila.children[4].textContent = `$ ${valorM2Ajustado.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
    fila.children[5].textContent = subtotal > 0
      ? `$ ${subtotal.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
      : "—";
  });

  document.getElementById("totalTasacion").textContent =
    total > 0
      ? `$ ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`
      : "—";
}
