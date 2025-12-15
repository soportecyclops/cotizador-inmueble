import { AJUSTES, LIMITES } from "./config.js";
import { validarSujeto, validarComparable } from "./validaciones.js";

function limitar(valor) {
  return Math.max(-AJUSTES.maxAjuste, Math.min(AJUSTES.maxAjuste, valor));
}

function filtrarOutliers(valores) {
  const prom = valores.reduce((a,b)=>a+b,0)/valores.length;
  return valores.filter(v =>
    v > prom * LIMITES.outlierMin &&
    v < prom * LIMITES.outlierMax
  );
}

export function calcularTasacion(data) {

  validarSujeto(data.sujeto);

  let valores = [];

  data.comparables.forEach(c => {
    if (!validarComparable(c)) return;

    let vM2 = c.precio / c.superficie;

    let ajuste =
      (data.sujeto.estado - c.estado) * AJUSTES.estado +
      (data.sujeto.calidad - c.calidad) * AJUSTES.calidad;

    if (c.tipo === "oferta") ajuste += AJUSTES.oferta;
    ajuste += Math.floor(c.antiguedadMeses / 12) * AJUSTES.antiguedadAnual;

    valores.push(vM2 * (1 + limitar(ajuste)));
  });

  if (valores.length < LIMITES.comparablesMinimos)
    throw "Comparables insuficientes";

  valores = filtrarOutliers(valores);

  const promedio = valores.reduce((a,b)=>a+b,0)/valores.length;
  const total = promedio * data.sujeto.cubierta;

  return {
    minimo: Math.round(total * 0.95),
    sugerido: Math.round(total),
    maximo: Math.round(total * 1.05)
  };
}
