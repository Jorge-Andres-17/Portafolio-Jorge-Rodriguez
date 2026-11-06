(function () {
  var raiz = document.documentElement;
  var CLAVE = 'tema';
  var COLORES = { dark: '#050C08', light: '#F4FAF6' };

  // Lee la elección guardada (si el navegador lo permite)
  function guardado() {
    try { return localStorage.getItem(CLAVE); } catch (e) { return null; }
  }

    // Primera visita: siempre oscuro. Si el visitante elige otro, se respeta
  function inicial() {
    var g = guardado();
    if (g === 'light' || g === 'dark') return g;
    return 'dark';
  }

  // Aplica el tema: atributo, color de la barra del navegador y texto del botón
  function aplicar(tema) {
    raiz.setAttribute('data-theme', tema);

    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = COLORES[tema];

    var boton = document.getElementById('temaBoton');
    if (boton) {
      boton.setAttribute('aria-label',
        tema === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro');
    }
  }

  // Se aplica de inmediato, antes de que la página se pinte (evita el parpadeo)
  aplicar(inicial());

  // Cuando el HTML ya cargó, se conecta el botón
  document.addEventListener('DOMContentLoaded', function () {
    var boton = document.getElementById('temaBoton');
    aplicar(raiz.getAttribute('data-theme'));
    if (!boton) return;

    boton.addEventListener('click', function () {
      var nuevo = raiz.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      aplicar(nuevo);
      try { localStorage.setItem(CLAVE, nuevo); } catch (e) {}
    });
  });
})();