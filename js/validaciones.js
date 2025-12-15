export function validarSujeto(s) {
  if (!s) throw "Sujeto inexistente";
  if (s.cubierta <= 0) throw "Superficie inválida";
  if (s.estado < 1 || s.estado > 5) throw "Estado inválido";
  if (s.calidad < 1 || s.calidad > 5) throw "Calidad inválida";
}

export function validarComparable(c) {
  if (c.precio <= 0) return false;
  if (c.superficie <= 0) return false;
  if (c.estado < 1 || c.estado > 5) return false;
  if (c.calidad < 1 || c.calidad > 5) return false;
  if (!["oferta","venta"].includes(c.tipo)) return false;
  return true;
}
