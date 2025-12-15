// ===============================
// MOTOR DE TASACIÓN PONDERADA
// Versión: 1.1
// Uso: Interno (asesor)
// ===============================

// ---- CONFIGURACIÓN ----

// Ponderaciones (editable sin romper el sistema)
export const PONDERACIONES = {
  ubicacion: 0.15,
  calidadConstruccion: 0.12,
  expectativaVida: 0.08,
  estadoMantenimiento: 0.15,
  superficieCubierta: 0.07,
  superficieDescubierta: 0.10,
  estacionamiento: 0.10,
  factibilidadComercial: 0.10,
  distribucion: 0.08,
  orientacionVistas: 0.05
};

// Ajustes base (controlados)
export const AJUSTES = {
  inferior: -0.01,
  similar: 0,
  superior: 0.01
};

// ---- VALIDACIONES ----

function validarComparable(comp) {
  if (!comp.precioUSD || !comp.superficieCubierta) {
    throw new Error("Comparable inválido: faltan datos base");
  }

  if (!comp.ajustes) {
    throw new Error("Comparable sin matriz de ajustes");
  }
}

// ---- CÁLCULOS ----

function calcularPrecioM2Base(comp) {
  return comp.precioUSD / comp.superficieCubierta;
}

function calcularAjusteTotal(comp) {
  let ajusteTotal = 0;

  for (const factor in PONDERACIONES) {
    const ponderacion = PONDERACIONES[factor];
    const nivel = comp.ajustes[factor] || "similar";
    const ajusteBase = AJUSTES[nivel];

    ajusteTotal += ponderacion * ajusteBase;
  }

  return ajusteTotal;
}

function calcularPrecioAjustado(comp) {
  const precioM2Base = calcularPrecioM2Base(comp);
  const ajuste = calcularAjusteTotal(comp);

  return {
    precioM2Base,
    ajusteTotal: ajuste,
    precioM2Ajustado: precioM2Base * (1 + ajuste)
  };
}

// ---- FUNCIÓN PRINCIPAL ----

export function calcularTasacion({ sujeto, comparables }) {
  if (!comparables || comparables.length < 2) {
    throw new Error("Se requieren al menos 2 comparables");
  }

  const resultados = [];

  comparables.forEach(comp => {
    validarComparable(comp);

    const calc = calcularPrecioAjustado(comp);

    resultados.push({
      ...comp,
      ...calc
    });
  });

  const precios = resultados.map(r => r.precioM2Ajustado);

  const minimo = Math.min(...precios) * sujeto.cubierta;
  const maximo = Math.max(...precios) * sujeto.cubierta;
  const sugerido =
    precios.reduce((a, b) => a + b, 0) / precios.length * sujeto.cubierta;

  return {
    minimo: Math.round(minimo),
    sugerido: Math.round(sugerido),
    maximo: Math.round(maximo),
    detalleInterno: resultados
  };
}
