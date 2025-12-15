import { calcularTasacion } from "./motor.js";
import { calcularComposicion, setAjusteCualitativo } from "./composicion.js";

/* ============================= */
/* INIT GENERAL */
/* ============================= */

document.addEventListener("DOMContentLoaded", () => {
  initComparables();
  initCalculo();
  initMapa();
  initAjustesCualitativos();
  initAutocomplete();
});

/* ============================= */
/* COMPARABLES */
/* ============================= */

function initComparables() {
  const tabla = document.getElementById("tablaComparables");
  const btnAgregar = document.getElementById("agregarComparable");

  if (!tabla || !btnAgregar) return;

  btnAgregar.addEventListener("click", () => {
    const tr = document.createElement("tr");
    const uid = Date.now();

    tr.innerHTML = `
      <td><input type="number" class="precio"></td>
      <td><input type="number" class="supCub"></td>
      <td><input type="number" class="supDesc"></td>
      <td><input type="number" class="antig"></td>
      <td>
        <div class="ajuste" data-factor="estado" data-valor="0">
          <button data-ajuste="-1" title="Inferior">👎</button>
          <button data-ajuste="0" title="Similar" class="active">➖</button>
          <button data-ajuste="1" title="Superior">👍</button>
        </div>
      </td>
    `;

    tabla.appendChild(tr);
    activarAjustes(tr);
  });
}

/* ============================= */
/* CALCULAR TASACIÓN */
/* ============================= */

function initCalculo() {
  const btnCalcular = document.getElementById("calcular");
  const tabla = document.getElementById("tablaComparables");

  if (!btnCalcular || !tabla) return;

  btnCalcular.addEventListener("click", () => {
    try {
      const sujeto = {
        cubierta: Number(document.getElementById("sujeto_sup")?.value || 0)
      };

      const comparables = [];

      tabla.querySelectorAll("tr").forEach(tr => {
        const ajusteNodo = tr.querySelector(".ajuste");

        comparables.push({
          precioUSD: Number(tr.querySelector(".precio")?.value || 0),
          superficieCubierta: Number(tr.querySelector(".supCub")?.value || 0),
          superficieDescubierta: Number(tr.querySelector(".supDesc")?.value || 0),
          antiguedadMeses: Number(tr.querySelector(".antig")?.value || 0),
          ajusteEstado: Number(ajusteNodo?.dataset.valor || 0)
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

/* ============================= */
/* AJUSTES CUALITATIVOS */
/* ============================= */

function initAjustesCualitativos() {
  document.querySelectorAll(".ajuste").forEach(fila => {
    activarAjustes(fila);
  });
}

function activarAjustes(contenedor) {
  const botones = contenedor.querySelectorAll("button");

  botones.forEach(btn => {
    btn.addEventListener("click", () => {
      botones.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      contenedor.dataset.valor = btn.dataset.ajuste;
    });
  });
}

/* ============================= */
/* GOOGLE MAPS - BUSCADOR */
/* ============================= */

function initMapa() {
  const btnMapa = document.getElementById("verMapa");

  if (!btnMapa) return;

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

/* ============================= */
/* GOOGLE PLACES AUTOCOMPLETE */
/* ============================= */

let autocomplete;

function initAutocomplete() {
  if (!window.google) return;

  const input = document.getElementById("direccion");
  if (!input) return;

  autocomplete = new google.maps.places.Autocomplete(input, {
    types: ["address"],
    componentRestrictions: { country: "ar" }
  });

  autocomplete.addListener("place_changed", fillAddressData);
}

function fillAddressData() {
  const place = autocomplete.getPlace();
  if (!place.address_components) return;

  const data = {};

  place.address_components.forEach(component => {
    data[component.types[0]] = component.long_name;
  });

  document.getElementById("direccion").value =
    `${data.route || ""} ${data.street_number || ""}`.trim();

  document.getElementById("ciudad").value =
    data.locality || data.administrative_area_level_2 || "";

  document.getElementById("cp").value = data.postal_code || "";
}

/* ============================= */
/* COMPOSICIÓN DEL VALOR */
/* ============================= */

function recalcularComposicion(valorM2) {
  let total = 0;

  document.querySelectorAll("[data-coef]").forEach(fila => {
    const m2 = parseFloat(fila.querySelector(".m2")?.value) || 0;
    const coef = parseFloat(fila.dataset.coef);

    const homologada = m2 * coef;
    const parcial = homologada * valorM2;

    fila.querySelector(".homologada").textContent = homologada.toFixed(2);
    fila.querySelector(".parcial").textContent = parcial.toFixed(2);

    total += parcial;
  });

  const totalNodo = document.getElementById("totalTasacion");
  if (totalNodo) {
    totalNodo.textContent = `$ ${total.toLocaleString("es-AR")}`;
  }
}

/* ============================= */
/* ACTUALIZACIÓN DE AJUSTES CUALITATIVOS */
/* ============================= */

document.querySelectorAll(".m2").forEach(input => {
  input.addEventListener("input", recalcularComposicion);
});

document.querySelectorAll(".ajuste").forEach(fila => {
  const peso = parseFloat(fila.previousElementSibling.textContent) / 100;

  fila.querySelectorAll(".ajuste-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      fila.querySelectorAll(".ajuste-btn").forEach(b => b.classList.remove("activo"));
      btn.classList.add("activo");

      const valor = parseInt(btn.dataset.ajuste);
      setAjusteCualitativo(valor * peso);
    });
  });
});
