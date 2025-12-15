function generarPDF() {

  const originalTitle = document.title;
  document.title = "Informe de Tasación - Century21";

  window.print();

  setTimeout(() => {
    document.title = originalTitle;
  }, 1000);
}
