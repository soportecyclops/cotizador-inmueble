import { calcularTasacion } from "./motor.js";

const FACTORES = [
  "ubicacion",
  "calidadConstruccion",
  "expectativaVida",
  "estadoMantenimiento",
  "superficieCubierta",
  "superficieDescubierta",
  "estacionamiento",
  "factibilidadComercial",
  "distribucion",
  "orientacionVistas"
];

const tabla = document.getElementById("tablaComparables");

document.getElementById("agregarComparable").addEventListener("click", () => {
  const tr = document.createElement("tr");

  let factoresHTML = "";
  FACTORES.forEach(f => {
    factoresHTML += `
      <div class="factor">
        <span>${f}</span>
        <label><input type="radio" name="${f}_${Date.now()}" value="inferior">Inf</label>
        <label><input type="radio" name="${f}_${Date.now()}" value="similar" checked>Sim</label>
        <label><input type="radio" name="${f}_${Date.now()}" value="superior">Sup</label>
      </div>
    `;
  });

  tr.innerHTML = `
    <td><input type="number" class="precio"></td>
    <td><input type="number" class="supCub"></td>
    <td><input type="number" class="supDesc"></td>
    <td><input type="number" class="antig"></td>
    <td class="factores">${factoresHTML}</td>
  `;

  tabla.appendChild(tr);
});

document.getElementById("calcular").addEventListener("click", () => {
  try {
    const sujeto = {
      cubierta: Number(document.getElementById("sujeto_sup").value)
    };

    const comparables = [];

    tabla.querySelectorAll("tr").forEach(tr => {
      const ajustes = {};

      FACTORES.forEach(f => {
        const seleccionado = tr.querySelector(`input[name^="${f}_"]:checked`);
        ajustes[f] = seleccionado ? seleccionado.value : "similar";
      });

      comparables.push({
        precioUSD: Number(tr.querySelector(".precio").value),
        superficieCubierta: Number(tr.querySelector(".supCub").value),
        superficieDescubierta: Number(tr.querySelector(".supDesc").value),
        antiguedadMeses: Number(tr.querySelector(".antig").value),
        ajustes
      });
    });

    const resultado = calcularTasacion({ sujeto, comparables });

    localStorage.setItem(
      "tasacion_cliente",
      JSON.stringify(resultado)
    );

    alert("Tasación generada correctamente");

  } catch (e) {
    alert("Error: " + e.message);
  }
});
