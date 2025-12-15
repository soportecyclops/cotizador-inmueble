import { calcularTasacion } from "./motor.js";

console.group("TEST MOTOR TASACIÓN");

try {
  const sujeto = {
    cubierta: 100
  };

  const comparables = [
    {
      precioUSD: 200000,
      superficieCubierta: 100,
      ajustes: {
        ubicacion: "similar",
        calidadConstruccion: "similar",
        expectativaVida: "similar",
        estadoMantenimiento: "similar",
        superficieCubierta: "similar",
        superficieDescubierta: "similar",
        estacionamiento: "similar",
        factibilidadComercial: "similar",
        distribucion: "similar",
        orientacionVistas: "similar"
      }
    },
    {
      precioUSD: 180000,
      superficieCubierta: 100,
      ajustes: {
        ubicacion: "inferior",
        calidadConstruccion: "similar",
        expectativaVida: "similar",
        estadoMantenimiento: "similar",
        superficieCubierta: "similar",
        superficieDescubierta: "similar",
        estacionamiento: "similar",
        factibilidadComercial: "similar",
        distribucion: "similar",
        orientacionVistas: "inferior"
      }
    }
  ];

  const resultado = calcularTasacion({ sujeto, comparables });

  console.log("Resultado:", resultado);

  console.assert(resultado.minimo < resultado.maximo, "Min < Max");
  console.assert(resultado.sugerido > resultado.minimo, "Sug > Min");
  console.assert(resultado.sugerido < resultado.maximo, "Sug < Max");

  console.log("✔ TEST PASADO");

} catch (e) {
  console.error("❌ TEST FALLÓ", e);
}

console.groupEnd();
