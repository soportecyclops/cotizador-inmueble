import { calcularTasacion } from "./motor.js";

document.addEventListener("DOMContentLoaded", () => {

  /* ================= FACTORES ================= */

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
  const btnAgregar = document.getElementById("agregarComparable");
  const btnCalcular = document.getElementById("calcular");

  /* ================= COMPARABLES ================= */

  if (btnAgregar && tabla) {
    btnAgregar.addEventListener("click", () => {
      const tr = document.createElement("tr");
      const uid = Date.now();

      let factoresHTML = "";
      FACTORES.forEach(f => {
        factoresHTML += `
          <div class="factor">
            <span>${f}</span>
            <label><input type="radio" name="${f}_${uid}" value="inferior">Inf</label>
            <label><input type="radio" name="${f}_${uid}" value="similar" checked>Sim</label>
            <label><input type="radio" name="${f}_${uid}" value="superior">Sup</label>
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
  }

  /* ================= CALCULAR TASACIÓN ================= */

  if (btnCalcular && tabla) {
    btnCalcular.addEventListener("click", () => {
      try {
        const sujeto = {
          cubierta: Number(document.getElementById("sujeto_sup")?.value || 0)
        };

        const comparables = [];

        tabla.querySelectorAll("tr").forEach(tr => {
          const ajustes = {};

          FACTORES.forEach(f => {
            const seleccionado = tr.querySelector(`input[name^="${f}_"]:checked`);
            ajustes[f] = seleccionado ? seleccionado.value : "similar";
          });

          comparables.push({
            precioUSD: Number(tr.querySelector(".precio")?.value || 0),
            superficieCubierta: Number(tr.querySelector(".supCub")?.value || 0),
            superficieDescubierta: Number(tr.querySelector(".supDesc")?.value || 0),
            antiguedadMeses: Number(tr.querySelector(".antig")?.value || 0),
            ajustes
          });
        });

        const resultado = calcularTasacion({ sujeto, comparables });

        localStorage.setItem("tasacion_cliente", JSON.stringify(resultado));

        alert("Tasación generada correctamente");

      } catch (e) {
        alert("Error: " + e.message);
      }
    });
  }

  /* ================= GOOGLE MAPS ================= */

  const btnMapa = document.getElementById("verMapa");

  if (btnMapa) {
    btnMapa.addEventListener("click", () => {
      const direccion = document.getElementById("direccion")?.value || "";
      const ciudad = document.getElementById("ciudad")?.value || "";

      if (!direccion && !ciudad) {
        alert("Ingresá al menos una dirección o ciudad");
        return;
      }

      const query = encodeURIComponent(`${direccion}, ${ciudad}`);
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${query}`,
        "_blank"
      );
    });
  }

});
