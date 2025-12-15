function calcularTasacion(data) {
  let baseM2 = 1850;

  let ajusteEstado = (data.estado - 3) * 0.05;
  let valorM2 = baseM2 * (1 + ajusteEstado);

  let valor = valorM2 * data.cubierta;

  return {
    min: Math.round(valor * 0.95),
    max: Math.round(valor * 1.05),
    sugerido: Math.round(valor)
  };
}
