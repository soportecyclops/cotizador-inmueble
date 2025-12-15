import { calcularTasacion } from "./motor.js";

function testBasico() {
  const data = {
    sujeto: { cubierta: 100, estado: 4, calidad: 4 },
    comparables: [
      { precio: 100000, superficie: 100, estado: 3, calidad: 3, tipo: "venta", antiguedadMeses: 6 },
      { precio: 105000, superficie: 100, estado: 4, calidad: 4, tipo: "venta", antiguedadMeses: 3 },
      { precio: 95000, superficie: 100, estado: 3, calidad: 3, tipo: "oferta", antiguedadMeses: 12 }
    ]
  };

  console.log("TEST BÁSICO:", calcularTasacion(data));
}

function testError() {
  try {
    calcularTasacion({ sujeto: {}, comparables: [] });
  } catch (e) {
    console.log("TEST ERROR OK:", e);
  }
}

testBasico();
testError();
