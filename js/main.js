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
    // ---------- Copiar correo ----------
    var copiar = document.getElementById('copiarCorreo');
    var aviso = document.getElementById('avisoCopia');

    if (copiar) {
      var textoOriginal = copiar.textContent;
      var reloj;

      function avisar(mensaje) {
        copiar.textContent = mensaje === 'ok' ? '¡Correo copiado!' : textoOriginal;
        if (aviso) {
          aviso.textContent = mensaje === 'ok'
            ? 'Correo copiado al portapapeles. Ya puedes pegarlo en tu aplicación de correo.'
            : 'No se pudo copiar automáticamente. Escríbeme por WhatsApp o desde el botón Enviar correo.';
        }
        clearTimeout(reloj);
        reloj = setTimeout(function () {
          copiar.textContent = textoOriginal;
          if (aviso) aviso.textContent = '';
        }, 3000);
      }

      function copiarAlterno(texto) {
        var campo = document.createElement('textarea');
        campo.value = texto;
        campo.setAttribute('readonly', '');
        campo.style.position = 'fixed';
        campo.style.opacity = '0';
        document.body.appendChild(campo);
        campo.select();
        var hecho = false;
        try { hecho = document.execCommand('copy'); } catch (e) {}
        campo.remove();
        return hecho;
      }

      copiar.addEventListener('click', function () {
        var correo = copiar.getAttribute('data-correo');
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(correo).then(
            function () { avisar('ok'); },
            function () { avisar(copiarAlterno(correo) ? 'ok' : 'error'); }
          );
        } else {
          avisar(copiarAlterno(correo) ? 'ok' : 'error');
        }
      });
    }

    // ---------- Año del pie de página ----------
    var anio = document.getElementById('anio');
    if (anio) anio.textContent = new Date().getFullYear();

      // ---------- Visor de certificados ----------
  var visor = document.getElementById('visor');
  var ultimoBoton = null;

  document.querySelectorAll('[data-cert]').forEach(function (b) {
    b.addEventListener('click', function () {
      var pdf = b.getAttribute('data-pdf');
      if (!visor || !visor.showModal) { window.open(pdf, '_blank', 'noopener'); return; }

      ultimoBoton = b;
      var img = document.getElementById('visorImg');
      img.src = b.getAttribute('data-img');
      img.alt = b.querySelector('img').alt;
      document.getElementById('visorTitulo').textContent = b.getAttribute('data-titulo');
      document.getElementById('visorPdf').href = pdf;
      visor.showModal();
    });
  });

  if (visor) {
    visor.querySelector('[data-cerrar]').addEventListener('click', function () { visor.close(); });
    visor.addEventListener('click', function (e) { if (e.target === visor) visor.close(); });
    visor.addEventListener('close', function () { if (ultimoBoton) ultimoBoton.focus(); });
  }

})();