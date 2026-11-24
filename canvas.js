
const canvas = document.getElementById("canvasIlustracion");
const ctx = canvas?.getContext("2d");

if (canvas && ctx) {
  const W = 900;
  const H = 380;

  canvas.width = W;
  canvas.height = H;

  const paletas = [
    {
      nombre: "Jardín Celestial",
      fondo: "#10091f",
      fondoLuz: "#281344",
      vidrio: ["#70d6e9", "#48b9d1", "#a5e6f3", "#398bb8", "#c4edfa", "#69b8d9"],
      rosa: "#dc2458",
      rosaOscura: "#831638",
      rosaLuz: "#ff789c",
      rosaBrillo: "#ffc0d1",
      hoja: "#3b9660",
      hojaOscura: "#174b3c",
      oro: "#f6ca62",
      contorno: "#100c20",
      texto: "#fff1d1"
    },
    {
      nombre: "Jardín de Amatista",
      fondo: "#100b25",
      fondoLuz: "#302052",
      vidrio: ["#5145b5", "#7069d9", "#967be9", "#48338f", "#b4a0f5", "#6552c4"],
      rosa: "#ed426e",
      rosaOscura: "#8c244e",
      rosaLuz: "#ff91ae",
      rosaBrillo: "#ffd0df",
      hoja: "#659d70",
      hojaOscura: "#284c43",
      oro: "#f5d28a",
      contorno: "#100a20",
      texto: "#f4eaff"
    }
  ];

  let paletaActual = paletas[0];

  // Herramienta para dibujar polígonos.
  function poligono(puntos, relleno, borde, grosor = 2) {
    ctx.beginPath();
    ctx.moveTo(puntos[0][0], puntos[0][1]);

    for (let i = 1; i < puntos.length; i++) {
      ctx.lineTo(puntos[i][0], puntos[i][1]);
    }

    ctx.closePath();
    ctx.fillStyle = relleno;
    ctx.fill();

    if (borde) {
      ctx.strokeStyle = borde;
      ctx.lineWidth = grosor;
      ctx.stroke();
    }
  }

  // Fondo atmosférico.
  function dibujarFondo(c) {
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, c.fondo);
    grad.addColorStop(0.5, c.fondoLuz);
    grad.addColorStop(1, c.fondo);

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Resplandor detrás de la rosa.
    const luz = ctx.createRadialGradient(
      575, 185, 5,
      575, 185, 220
    );

    luz.addColorStop(0, c.vidrio[1] + "55");
    luz.addColorStop(0.5, c.vidrio[0] + "16");
    luz.addColorStop(1, "transparent");

    ctx.fillStyle = luz;
    ctx.fillRect(300, 0, 500, H);

    // Marco decorativo.
    ctx.strokeStyle = c.oro + "88";
    ctx.lineWidth = 1;
    ctx.strokeRect(12, 12, W - 24, H - 24);

    ctx.strokeStyle = c.oro + "55";
    ctx.strokeRect(19, 19, W - 38, H - 38);

    // Título.
    ctx.textAlign = "left";
    ctx.fillStyle = c.texto;
    ctx.font = "bold 35px Georgia";
    ctx.fillText("LA ROSA ENCANTADA", 48, 85);

    ctx.fillStyle = c.oro;
    ctx.font = "italic 17px Georgia";
    ctx.fillText("Un jardín secreto entre cristales", 50, 115);

    // Pequeño ornamento debajo del título.
    ctx.strokeStyle = c.oro;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(50, 132);
    ctx.lineTo(220, 132);
    ctx.stroke();

    poligono(
      [[232, 132], [238, 126], [244, 132], [238, 138]],
      c.oro,
      c.oro,
      1
    );
  }

  // Estrellas y partículas.
  function dibujarEstrellas(c) {
    for (let i = 0; i < 35; i++) {
      const x = 30 + Math.random() * 840;
      const y = 25 + Math.random() * 330;
      const r = Math.random() * 3 + 1;

      // Evitar demasiadas partículas sobre la rosa.
      if (x > 430 && x < 710 && y > 45 && y < 335) {
        continue;
      }

      if (i % 3 === 0) {
        ctx.fillStyle = c.oro;

        ctx.beginPath();
        ctx.moveTo(x, y - r * 3);
        ctx.lineTo(x + r * 0.5, y - r * 0.5);
        ctx.lineTo(x + r * 3, y);
        ctx.lineTo(x + r * 0.5, y + r * 0.5);
        ctx.lineTo(x, y + r * 3);
        ctx.lineTo(x - r * 0.5, y + r * 0.5);
        ctx.lineTo(x - r * 3, y);
        ctx.lineTo(x - r * 0.5, y - r * 0.5);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? c.oro : c.vidrio[2];
        ctx.fill();
      }
    }
  }

  // Forma de la cúpula.
  function crearCupula() {
    const p = new Path2D();

    p.moveTo(460, 310);
    p.lineTo(460, 112);
    p.bezierCurveTo(460, 30, 500, 25, 575, 25);
    p.bezierCurveTo(650, 25, 690, 30, 690, 112);
    p.lineTo(690, 310);
    p.closePath();

    return p;
  }

  // Vidrio facetado.
  function dibujarVidrio(c) {
    const cupula = crearCupula();

    ctx.save();
    ctx.clip(cupula);

    const filas = [
      { y1: 25, y2: 112, columnas: 4 },
      { y1: 112, y2: 190, columnas: 4 },
      { y1: 190, y2: 260, columnas: 3 },
      { y1: 260, y2: 310, columnas: 4 }
    ];

    for (let f = 0; f < filas.length; f++) {
      const fila = filas[f];
      const ancho = 230 / fila.columnas;

      for (let j = 0; j < fila.columnas; j++) {
        const x = 460 + j * ancho;
        const desviacion = (Math.random() - 0.5) * 13;
        const color = c.vidrio[
          Math.floor(Math.random() * c.vidrio.length)
        ];

        poligono(
          [
            [x, fila.y1],
            [x + ancho, fila.y1],
            [x + ancho + desviacion, fila.y2],
            [x + desviacion, fila.y2]
          ],
          color,
          c.contorno,
          3
        );

        // Reflejo de cada panel.
        ctx.strokeStyle = "#ffffff30";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 8, fila.y1 + 8);
        ctx.lineTo(x + 8 + desviacion, fila.y2 - 8);
        ctx.stroke();
      }
    }

    // Líneas verticales ornamentales.
    ctx.strokeStyle = c.contorno;
    ctx.lineWidth = 3;

    for (let i = 1; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(460 + i * 57.5, 25);
      ctx.lineTo(460 + i * 57.5, 310);
      ctx.stroke();
    }

    ctx.restore();

    // Contorno exterior.
    ctx.strokeStyle = c.contorno;
    ctx.lineWidth = 7;
    ctx.stroke(cupula);

    // Segundo borde dorado interior.
    ctx.strokeStyle = c.oro;
    ctx.lineWidth = 1.5;

    ctx.beginPath();
    ctx.moveTo(468, 308);
    ctx.lineTo(468, 112);
    ctx.bezierCurveTo(468, 43, 515, 35, 575, 35);
    ctx.bezierCurveTo(635, 35, 682, 43, 682, 112);
    ctx.lineTo(682, 308);
    ctx.stroke();

    // Piedra superior.
    ctx.beginPath();
    ctx.arc(575, 24, 10, 0, Math.PI * 2);
    ctx.fillStyle = c.oro;
    ctx.fill();
    ctx.strokeStyle = c.contorno;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Pequeño brillo.
    ctx.beginPath();
    ctx.arc(572, 21, 3, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
  }

  // Tallo de la rosa.
  function dibujarTallo(c) {
    ctx.lineCap = "round";

    ctx.beginPath();
    ctx.moveTo(568, 310);
    ctx.bezierCurveTo(615, 260, 545, 220, 577, 148);

    ctx.strokeStyle = c.contorno;
    ctx.lineWidth = 12;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(568, 310);
    ctx.bezierCurveTo(615, 260, 545, 220, 577, 148);

    ctx.strokeStyle = c.hoja;
    ctx.lineWidth = 7;
    ctx.stroke();

    // Reflejo del tallo.
    ctx.beginPath();
    ctx.moveTo(570, 295);
    ctx.bezierCurveTo(600, 255, 555, 220, 578, 166);
    ctx.strokeStyle = "#b0d58a";
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  // Hojas con nervaduras.
  function dibujarHoja(c, x, y, dx, dy, rot, lado) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(dx * 0.35, dy - 25, dx, dy);
    ctx.quadraticCurveTo(dx * 0.65, dy + 20, 0, 0);

    ctx.fillStyle = lado ? c.hoja : c.hojaOscura;
    ctx.fill();

    ctx.strokeStyle = c.contorno;
    ctx.lineWidth = 3;
    ctx.stroke();

    // Nervadura principal.
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(dx * 0.5, dy, dx * 0.85, dy);
    ctx.strokeStyle = c.oro + "bb";
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Nervaduras pequeñas.
    for (let i = 1; i <= 3; i++) {
      const px = dx * (i * 0.2);
      const py = dy * (i * 0.2);

      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(px + (lado ? 9 : -9), py - 9);
      ctx.strokeStyle = c.contorno;
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    ctx.restore();
  }

  // Rosa con pétalos superpuestos.
  function dibujarFlor(c) {
    ctx.save();
    ctx.translate(578, 145);

    // Pétalos posteriores.
    for (let i = 0; i < 5; i++) {
      const angulo = (Math.PI * 2 * i) / 5;

      ctx.save();
      ctx.rotate(angulo);

      ctx.beginPath();
      ctx.ellipse(0, -15, 13, 24, 0, 0, Math.PI * 2);
      ctx.fillStyle = c.rosaOscura;
      ctx.fill();
      ctx.strokeStyle = c.contorno;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.restore();
    }

    // Pétalos laterales.
    ctx.beginPath();
    ctx.ellipse(-17, 1, 15, 22, -0.65, 0, Math.PI * 2);
    ctx.fillStyle = c.rosaOscura;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(17, 1, 15, 22, 0.65, 0, Math.PI * 2);
    ctx.fillStyle = c.rosaOscura;
    ctx.fill();
    ctx.stroke();

    // Pétalo inferior.
    ctx.beginPath();
    ctx.moveTo(-24, -2);
    ctx.bezierCurveTo(-27, 26, 26, 30, 24, -2);
    ctx.bezierCurveTo(12, 12, -12, 12, -24, -2);
    ctx.fillStyle = c.rosa;
    ctx.fill();
    ctx.stroke();

    // Pétalo principal.
    ctx.beginPath();
    ctx.moveTo(-24, -5);
    ctx.bezierCurveTo(-30, -36, 5, -39, 0, -22);
    ctx.bezierCurveTo(14, -43, 35, -17, 23, 4);
    ctx.bezierCurveTo(13, 17, -15, 17, -24, -5);
    ctx.fillStyle = c.rosa;
    ctx.fill();
    ctx.stroke();

    // Pétalo interior.
    ctx.beginPath();
    ctx.moveTo(-12, -5);
    ctx.bezierCurveTo(-15, -25, 16, -28, 15, -7);
    ctx.bezierCurveTo(15, 10, -9, 13, -12, -5);
    ctx.fillStyle = c.rosaLuz;
    ctx.fill();
    ctx.stroke();

    // Centro enrollado.
    ctx.beginPath();
    ctx.arc(1, -7, 8, 0, Math.PI * 2);
    ctx.fillStyle = c.rosaBrillo;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(1, -7, 3, 0, Math.PI * 2);
    ctx.fillStyle = c.rosaOscura;
    ctx.fill();

    // Brillos decorativos.
    ctx.fillStyle = "#ffffffaa";
    ctx.beginPath();
    ctx.arc(-13, -17, 2.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Base ornamental.
  function dibujarBase(c) {
    // Sombra.
    ctx.fillStyle = "#00000066";
    ctx.beginPath();
    ctx.ellipse(575, 323, 145, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Base principal.
    ctx.beginPath();
    ctx.roundRect(425, 307, 300, 27, 5);
    ctx.fillStyle = c.oro;
    ctx.fill();
    ctx.strokeStyle = c.contorno;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Filete superior.
    ctx.strokeStyle = "#fff0b8";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(435, 311);
    ctx.lineTo(715, 311);
    ctx.stroke();

    // Gemas triangulares.
    for (let x = 438; x <= 690; x += 20) {
      poligono(
        [
          [x, 331],
          [x + 9, 315],
          [x + 18, 331]
        ],
        c.rosaOscura,
        c.contorno,
        2
      );
    }

    // Remates laterales.
    for (let x of [415, 735]) {
      ctx.beginPath();
      ctx.arc(x, 320, 8, 0, Math.PI * 2);
      ctx.fillStyle = c.oro;
      ctx.fill();
      ctx.strokeStyle = c.contorno;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Decoración adicional: hojas y flores pequeñas.
  function dibujarDetalles(c) {
    dibujarHoja(c, 573, 267, -58, -23, -0.2, false);
    dibujarHoja(c, 579, 235, 48, -29, 0.15, true);
    dibujarHoja(c, 565, 204, -45, -19, -0.25, true);
    dibujarHoja(c, 577, 180, 31, -19, 0.2, false);

    // Pequeños adornos dorados en los laterales.
    for (let i = 0; i < 3; i++) {
      const y = 165 + i * 48;

      ctx.beginPath();
      ctx.arc(450, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = c.oro;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(700, y, 3, 0, Math.PI * 2);
      ctx.fillStyle = c.oro;
      ctx.fill();
    }
  }

  // Función principal.
  function generarComposicion() {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, W, H);

    dibujarFondo(paletaActual);
    dibujarEstrellas(paletaActual);
    dibujarVidrio(paletaActual);
    dibujarTallo(paletaActual);
    dibujarDetalles(paletaActual);
    dibujarFlor(paletaActual);
    dibujarBase(paletaActual);
  }

  // Controles de paleta.
  const btnPaleta1 = document.getElementById("btnPaleta1");
  const btnPaleta2 = document.getElementById("btnPaleta2");
  const btnGenerar = document.getElementById("btnGenerar");
  const btnGuardar = document.getElementById("btnGuardar");

  if (btnPaleta1) {
    btnPaleta1.addEventListener("click", () => {
      paletaActual = paletas[0];

      btnPaleta1.classList.add("activo");

      if (btnPaleta2) {
        btnPaleta2.classList.remove("activo");
      }

      generarComposicion();
    });
  }

  if (btnPaleta2) {
    btnPaleta2.addEventListener("click", () => {
      paletaActual = paletas[1];

      btnPaleta2.classList.add("activo");

      if (btnPaleta1) {
        btnPaleta1.classList.remove("activo");
      }

      generarComposicion();
    });
  }

  if (btnGenerar) {
    btnGenerar.addEventListener("click", generarComposicion);
  }

  if (btnGuardar) {
    btnGuardar.addEventListener("click", () => {
      const enlace = document.createElement("a");
      enlace.download = "rosa-encantada-vitral.png";
      enlace.href = canvas.toDataURL("image/png");
      enlace.click();
    });
  }

  // Primera ilustración.
  if (btnPaleta1) {
    btnPaleta1.classList.add("activo");
  }

  generarComposicion();
}
