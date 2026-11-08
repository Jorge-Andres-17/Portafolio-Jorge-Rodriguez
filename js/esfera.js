(function () {
  var app = document.querySelector('[data-esfera]');
  if (!app) return;

  var escena = app.querySelector('[data-escena]');
  var contBotones = app.querySelector('[data-cats]');
  var grupos = [].slice.call(app.querySelectorAll('[data-grupo]'));
  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var puntos = [];
  var botones = [];
  var ax = 0.3, ay = 0, velocidad = 0.004;
  var arrastre = false, visible = true;
  var px = 0, py = 0;

  app.classList.add('con-js');

  // Botones de categoría
  grupos.forEach(function (g, i) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cat';
    b.textContent = g.getAttribute('data-grupo');
    b.addEventListener('click', function () { mostrar(i); });
    contBotones.appendChild(b);
    botones.push(b);
  });

  // Muestra una categoría: lista a la derecha y palabras en la esfera
  function mostrar(i) {
    grupos.forEach(function (g, j) { g.hidden = (j !== i); });
    botones.forEach(function (b, j) { b.setAttribute('aria-pressed', j === i); });

    puntos.forEach(function (p) { p.el.remove(); });
    puntos = [];

    var textos = [].map.call(grupos[i].querySelectorAll('li'), function (li) {
      return li.textContent;
    });
    var n = textos.length;
    var oro = Math.PI * (3 - Math.sqrt(5));

    textos.forEach(function (t, k) {
      var y = n > 1 ? 1 - (2 * k) / (n - 1) : 0;
      var r = Math.sqrt(1 - y * y);
      var th = oro * k;
      var el = document.createElement('span');
      el.className = 'palabra';
      el.textContent = t;
      escena.appendChild(el);
      puntos.push({ x: Math.cos(th) * r, y: y * 0.92, z: Math.sin(th) * r, el: el });
    });
    dibujar();
  }

  // Calcula la posición de cada palabra según el giro
  function dibujar() {
    var w = escena.clientWidth;
    var h = escena.clientHeight;
    var radio = w * 0.36;
    var cx = w / 2, cy = h / 2;
    var sa = Math.sin(ax), ca = Math.cos(ax);
    var sy = Math.sin(ay), cyy = Math.cos(ay);

    puntos.forEach(function (p) {
      var x = p.x * cyy + p.z * sy;
      var z = -p.x * sy + p.z * cyy;
      var y = p.y * ca - z * sa;
      var z2 = p.y * sa + z * ca;
      var prof = (z2 + 1) / 2;
      var escala = 0.65 + 0.55 * prof;

      p.el.style.transform =
        'translate(' + (cx + x * radio) + 'px,' + (cy + y * radio) + 'px) ' +
        'translate(-50%,-50%) scale(' + escala.toFixed(3) + ')';
      p.el.style.opacity = (0.25 + 0.75 * prof).toFixed(3);
      p.el.style.zIndex = Math.round(prof * 10);
      p.el.classList.toggle('frente', prof > 0.82);
    });
  }

  // Giro automático (se detiene si el visitante prefiere menos movimiento)
  function bucle() {
    if (visible && !arrastre && !quieto) {
      ay += velocidad;
      dibujar();
    }
    requestAnimationFrame(bucle);
  }

  // Arrastrar con mouse o dedo
  escena.addEventListener('pointerdown', function (e) {
    arrastre = true;
    px = e.clientX;
    py = e.clientY;
    escena.setPointerCapture(e.pointerId);
  });

  escena.addEventListener('pointermove', function (e) {
    if (!arrastre) return;
    ay += (e.clientX - px) * 0.008;
    ax = Math.max(-1.2, Math.min(1.2, ax + (e.clientY - py) * 0.006));
    px = e.clientX;
    py = e.clientY;
    dibujar();
  });

  ['pointerup', 'pointercancel'].forEach(function (ev) {
    escena.addEventListener(ev, function () { arrastre = false; });
  });

  // Solo anima cuando la esfera está en pantalla
  new IntersectionObserver(function (entradas) {
    visible = entradas[0].isIntersecting;
  }).observe(escena);

  new ResizeObserver(dibujar).observe(escena);

  mostrar(0);
  requestAnimationFrame(bucle);
})();