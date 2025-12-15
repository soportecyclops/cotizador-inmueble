import { calcularTasacion } from "./motor.js";

const tablaBody = document.querySelector("#tablaComparables tbody");

document.getElementById("agregarComparable").addEventListener("click", () => {
  const fila = document.createElement("tr");
  fila.innerHTML = `
    <td><input type="number" class="precio"></td>
    <td><input type="number" class="superficie"></td>
    <td><input type="number" class="estado" min="1" max="5"></td>
    <td><input type="number" class="calidad" min="1" max="5"></td>
    <td>
      <select class="tipo">
        <option value="venta">Venta</option>
        <option value="oferta">Oferta</option>
      </select>
    </td>
    <td><input type="number" class="antiguedad"></td>
  `;
  tablaBody.appendChild(fila);
});

document.getElementById("calcular").addEventListener("click", () => {
  try {
    const sujeto = {
      cubierta: Number(document.getElementById("supCubierta").value),
      estado: Number(document.getElementById("estado").value),
      calidad: Number(document.getElementById("calidad").value)
    };

    const comparables = [];

    document.querySelectorAll("#tablaComparables tbody tr").forEach(fila => {
      comparables.push({
        precio: Number(fila.querySelector(".precio").value),
        superficie: Number(fila.querySelector(".superficie").value),
        estado: Number(fila.querySelector(".estado").value),
        calidad: Number(fila.querySelector(".calidad").value),
        tipo: fila.querySelector(".tipo").value,
        antiguedadMeses: Number(fila.querySelector(".antiguedad").value)
      });
    });

    const resultado = calcularTasacion({ sujeto, comparables });

    // 🔒 Guardar SOLO lo que verá el cliente
    const payloadCliente = {
      superficie: sujeto.cubierta,
      minimo: resultado.minimo,
      sugerido: resultado.sugerido,
      maximo: resultado.maximo,
      fecha: new Date().toISOString()
    };

    localStorage.setItem("tasacion_cliente", JSON.stringify(payloadCliente));

    // Abrir vista cliente
    window.open("index.html", "_blank");

  } catch (e) {
    alert("Error en la tasación: " + e);
  }
});
