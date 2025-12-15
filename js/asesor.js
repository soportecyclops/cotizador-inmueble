import { calcularTasacion } from "./motor.js";

const tabla = document.getElementById("tablaComparables");

document.getElementById("agregarComparable").addEventListener("click", () => {
  const tr = document.createElement("tr");

  tr.innerHTML = `
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

  tabla.appendChild(tr);
});

document.getElementById("calcular").addEventListener("click", () => {

  try {
    const sujeto = {
      cubierta: Number(document.getElementById("supCubierta").value),
      estado: Number(document.getElementById("estado").value),
      calidad: Number(document.getElementById("calidad").value)
    };

    const comparables = [];

    document.querySelectorAll("#tablaComparables tr").forEach(tr => {
      comparables.push({
        precio: Number(tr.querySelector(".precio").value),
        superficie: Number(tr.querySelector(".superficie").value),
        estado: Number(tr.querySelector(".estado").value),
        calidad: Number(tr.querySelector(".calidad").value),
        tipo: tr.querySelector(".tipo").value,
        antiguedadMeses: Number(tr.querySelector(".antiguedad").value)
      });
    });

    const resultado = calcularTasacion({ sujeto, comparables });

    localStorage.setItem("tasacion_cliente", JSON.stringify({
      superficie: sujeto.cubierta,
      minimo: resultado.minimo,
      sugerido: resultado.sugerido,
      maximo: resultado.maximo,
      fecha: new Date().toISOString()
    }));

    window.open("index.html", "_blank");

  } catch (e) {
    alert("Error: " + e);
  }
});
