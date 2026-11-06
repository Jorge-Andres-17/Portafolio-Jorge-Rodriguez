(function () {
  // ---------- Menú móvil ----------
  var boton = document.getElementById('menuBoton');
  var menu = document.getElementById('menuPrincipal');

  function cerrarMenu() {
    if (!menu || !boton) return;
    menu.classList.remove('abierto');
    boton.setAttribute('aria-expanded', 'false');
  }

  if (boton && menu) {
    boton.addEventListener('click', function () {
      var abierto = menu.classList.toggle('abierto');
      boton.setAttribute('aria-expanded', abierto);
    });

    menu.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', cerrarMenu);
    });

    document.addEventListener('click', function (e) {
      if (!menu.contains(e.target) && !boton.contains(e.target)) cerrarMenu();
    });

    window.matchMedia('(min-width: 961px)').addEventListener('change', cerrarMenu);
  }

  // ---------- Menú desplegable "Más" ----------
  var dBoton = document.querySelector('.desplegable-boton');
  var dLista = document.querySelector('.desplegable-lista');

  function cerrarDesplegable() {
    if (!dBoton || !dLista) return;
    dLista.classList.remove('abierta');
    dBoton.setAttribute('aria-expanded', 'false');
  }

  if (dBoton && dLista) {
    var contenedor = dBoton.parentNode;

    dBoton.addEventListener('click', function () {
      var abierta = dLista.classList.toggle('abierta');
      dBoton.setAttribute('aria-expanded', abierta);
    });

    document.addEventListener('click', function (e) {
      if (!contenedor.contains(e.target)) cerrarDesplegable();
    });

    contenedor.addEventListener('focusout', function (e) {
      if (!contenedor.contains(e.relatedTarget)) cerrarDesplegable();
    });
  }

  // ---------- Tecla Escape ----------
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (dLista && dLista.classList.contains('abierta')) {
      cerrarDesplegable();
      dBoton.focus();
    } else if (menu && menu.classList.contains('abierto')) {
      cerrarMenu();
      boton.focus();
    }
  });

  // ---------- Acordeón de habilidades: un grupo a la vez ----------
  var grupo = document.querySelector('[data-acordeon]');
  if (grupo) {
    var todos = grupo.querySelectorAll('details');
    var puedeHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var temporizador;

    todos.forEach(function (d) {
      d.addEventListener('toggle', function () {
        if (!d.open) return;
        todos.forEach(function (otro) {
          if (otro !== d) otro.open = false;
        });
      });

      if (puedeHover) {
        var resumen = d.querySelector('summary');
        resumen.addEventListener('mouseenter', function () {
          temporizador = setTimeout(function () { d.open = true; }, 150);
        });
        resumen.addEventListener('mouseleave', function () {
          clearTimeout(temporizador);
        });
      }
    });
  }
})();