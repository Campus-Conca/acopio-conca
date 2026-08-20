/* =====================================================================
   COMÚN — barra, pie, formatos y cálculos que comparten las cuatro
   páginas. Aquí no hay datos: todo sale de datos.js.
   Se expone en window.A y se usa así:  const { D, pesos } = A;
   ===================================================================== */
window.A = (function(){

  const D = window.DATOS;
  const MAT = Object.fromEntries(D.materiales.map(m => [m.clave, m]));
  const CLAVES = D.materiales.map(m => m.clave);
  const ETI = Object.fromEntries((D.etiquetas || []).map(e => [e.clave, e]));

  const $ = s => document.querySelector(s);
  const eti = c => ETI[c] || { clave:c, nombre: c || "Sin etiqueta", color:"var(--tinta-60)" };

  /* ---------- formatos ---------- */
  // El área puede gastar de más y quedar en rojo: eso se enseña, no se esconde.
  const pesos = n => { const r = Math.round(n);
    return (r < 0 ? "−$" : "$") + Math.abs(r).toLocaleString("es-MX"); };
  // "Cuatro cosas", "Cinco cosas": cuántos materiales hay se dice con letra y
  // sale de la lista, para que agregar uno no deje la frase mintiendo.
  const NUMS = ["cero","una","dos","tres","cuatro","cinco","seis","siete","ocho","nueve","diez"];
  const enLetras = n => NUMS[n] || String(n);
  const enLetrasM = n => { const t = enLetras(n); return t.charAt(0).toUpperCase() + t.slice(1); };

  const kilos = n => n.toFixed(1).replace(/\.0$/,"") + " kg";

  // Las fechas se guardan como "2026-09-24" y se leen como fecha local:
  // new Date("2026-09-24") sale un día antes en México.
  const aDate = s => { const [a,m,d] = s.split("-").map(Number); return new Date(a, m-1, d); };
  const fecha      = s => aDate(s).toLocaleDateString("es-MX", { day:"numeric", month:"long", year:"numeric" });
  const fechaCorta = s => aDate(s).toLocaleDateString("es-MX", { day:"numeric", month:"short" }).replace(".","");
  const diaSemana  = s => { const t = aDate(s).toLocaleDateString("es-MX", { weekday:"long" });
                            return t.charAt(0).toUpperCase() + t.slice(1); };

  const hoy = () => { const d = new Date();
    return d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0") + "-" + String(d.getDate()).padStart(2,"0"); };

  /* ---------- calendario ---------- */
  // Las fechas se escriben una por una en datos.js. Van ordenadas aunque se
  // hayan capturado en desorden, que en "2026-10-27" el orden alfabético y
  // el del almanaque son el mismo.
  const calendario = () => (D.entrega.fechas || []).slice().sort();

  const proxima = () => { const h = hoy(); return calendario().find(f => f >= h) || null; };

  // En qué días de la semana caen las colectas, dicho como se habla: "jueves",
  // "martes y miércoles". Sale de las fechas y no de una frase aparte, que es
  // la que se queda sin actualizar y termina mandando a la gente el día que no.
  const diasColecta = () => {
    const vistos = [];
    calendario().forEach(f => { const d = aDate(f).toLocaleDateString("es-MX", { weekday:"long" });
      if (!vistos.includes(d)) vistos.push(d); });
    if (!vistos.length) return "";
    return vistos.length === 1 ? vistos[0]
         : vistos.slice(0,-1).join(", ") + " y " + vistos[vistos.length-1];
  };

  /* ---------- dinero ---------- */
  // Se parte lo vendido, sin descontar nada antes. Los gastos del programa
  // no le pegan al 70%: salen del 30% del área, que es quien carga con lo
  // que cuesta operar. La obra avanza con su 70%, nunca con el total.
  const totalVentas = () => D.ventas.reduce((s,v) =>
    s + v.lineas.reduce((t,l) => t + l.kg * l.precio, 0), 0);

  // El reparto se hace en pesos enteros y la bolsa del área se lleva el
  // resto, para que las dos partes sumen exactamente lo vendido. Si cada una
  // se redondea por su lado hay montos en que aparece un peso de más, y una
  // tabla que no cuadra vuelve discutible todo lo demás.
  const REPARTO = D.reparto || {};
  const paraObra = () => Math.round(totalVentas() * (REPARTO.compartido.pct / 100));
  const paraArea = () => Math.round(totalVentas()) - paraObra();

  // Lo que el área ya ejerció de su 30% y lo que le queda disponible. Puede
  // salir en rojo: al arrancar se compran costales y todavía no hay ventas.
  const ejercidoArea   = () => D.gastos.reduce((s,g) => s + g.monto, 0);
  const disponibleArea = () => paraArea() - ejercidoArea();

  const avance = () => Math.max(0, Math.min(1, paraObra() / D.meta.costo));

  /* ---------- kilos ---------- */
  const kilosPorMaterial = () => {
    const k = {}; CLAVES.forEach(c => k[c] = 0);
    D.jornadas.forEach(j => (j.personas || []).forEach(p =>
      CLAVES.forEach(c => k[c] += (p.kg[c] || 0))));
    return k;
  };
  const kilosTotal = () => Object.values(kilosPorMaterial()).reduce((a,b) => a+b, 0);

  /* ---------- unidades ---------- */
  // El aceite se mide en litros y todo lo demás en kilos. Sumarlos daría un
  // número que no existe, así que los totales se dicen por separado:
  // "6.6 kg · 1.5 L". La única suma que sí mezcla es la marca personal, donde
  // un litro cuenta como un kilo, y ahí la página lo advierte.
  const unidadDe = m => (m && m.unidad) || "kg";
  const numero   = v => v.toFixed(1).replace(/\.0$/,"");
  const cant     = (m, v) => numero(v) + " " + unidadDe(m);

  const totalesPorUnidad = () => {
    const k = kilosPorMaterial(), t = {};
    // se recorre en el orden de datos.js, así los kilos van antes que los litros
    CLAVES.forEach(c => { const u = unidadDe(MAT[c]); t[u] = (t[u] || 0) + k[c]; });
    return t;
  };
  const totalesTexto = () => {
    const partes = Object.entries(totalesPorUnidad())
      .filter(([,v]) => v > 0).map(([u,v]) => numero(v) + " " + u);
    return partes.length ? partes.join(" · ") : "0 kg";
  };

  /* ---------- seguimiento por persona ---------- */
  // Tres marcas, ninguna comparativa: venir, traer el material como se
  // pide, y juntar lo que junta el promedio. La marca de kilos no se pone
  // de antemano: es la mediana de lo que trajo quien entregó, así que la
  // mitad del padrón la cumple desde el primer día.
  const seguimiento = () => {
    const acum = {};
    (D.personas || []).forEach(p => acum[p.nombre] = { etiqueta:p.etiqueta, kg:0, entregas:0, limpias:0 });
    D.jornadas.forEach(j => (j.personas || []).forEach(p => {
      const a = acum[p.persona] || (acum[p.persona] = { etiqueta:"", kg:0, entregas:0, limpias:0 });
      a.kg += CLAVES.reduce((s,c) => s + (p.kg[c] || 0), 0);
      a.entregas++;
      if (p.limpio) a.limpias++;
    }));

    const nJornadas = D.jornadas.length;
    const est = D.estandares;

    const entregas = [];
    D.jornadas.forEach(j => (j.personas || []).forEach(p => {
      const t = CLAVES.reduce((s,c) => s + (p.kg[c] || 0), 0);
      if (t > 0) entregas.push(t);
    }));
    let estKg = null;
    if (typeof est.kgPorJornada === "number") estKg = est.kgPorJornada;
    else if (entregas.length) {
      entregas.sort((a,b) => a-b);
      const m = entregas.length >> 1;
      const med = entregas.length % 2 ? entregas[m] : (entregas[m-1] + entregas[m]) / 2;
      estKg = Math.max(0.1, Math.round(med*10)/10);
    }

    const lista = Object.entries(acum).map(([nombre,a]) => ({
      nombre, etiqueta:a.etiqueta, kg:a.kg, entregas:a.entregas,
      porJornada: nJornadas ? a.kg / nJornadas : 0,
      constancia: nJornadas ? a.entregas / nJornadas : 0,
      calidad:    a.entregas ? a.limpias / a.entregas : 0
    })).sort((x,y) => x.nombre.localeCompare(y.nombre, "es"));

    return { lista, estKg, nJornadas };
  };

  /* ---------- el reparto, dibujado ---------- */
  // La misma barra en la portada, en las cuentas y en la presentación: si el
  // acuerdo se explica distinto en cada página, deja de creerse.
  const bloqueReparto = (opc) => {
    const o = opc || {}, montos = o.montos !== false;
    const lados = [["compartido", paraObra()], ["area", paraArea()]];
    return `<div class="reparto">
      <p class="rep-tit">${o.titulo || "Cada peso que se vende se parte en dos"}</p>
      <div class="rep-barra">` +
      lados.map(([c]) => `<i class="${c}" style="width:${REPARTO[c].pct}%"><b>${REPARTO[c].pct}%</b></i>`).join("") +
      `</div><div class="rep-pies">` +
      lados.map(([c,m]) => `<div class="rep-p ${c}">
        ${montos ? `<span class="q dato">${pesos(Math.max(0, m))}</span>` : ""}
        <span class="n">${REPARTO[c].nombre}</span>
        <span class="d">${REPARTO[c].para}</span>
      </div>`).join("") +
      `</div></div>`;
  };

  /* ---------- barra y pie ---------- */
  // A la portada se llega por el conejo, así que no lleva su propio enlace.
  const PAGINAS = [
    { href:"index.html#materiales", nombre:"Qué se recibe" },
    { href:"participantes.html",    nombre:"Quiénes participan" },
    { href:"cuentas.html",          nombre:"Las cuentas" },
    { href:"presentacion.html",     nombre:"La presentación" }
  ];

  const barra = actual => {
    const nav = document.createElement("nav");
    nav.className = "barra";
    nav.setAttribute("aria-label", "Secciones del sitio");
    nav.innerHTML = `<div class="wrap">
      <a class="marca-n" href="index.html"><img src="img/conejo.png" alt=""><span>Acopio Concá</span></a>
      <button class="menu-btn" aria-expanded="false" aria-controls="menu-lista">
        <span class="mb-txt">Secciones</span>
        <span class="mb-ico" aria-hidden="true"><i></i><i></i><i></i></span>
      </button>
      <div class="enlaces" id="menu-lista">` +
      PAGINAS.map(p => `<a href="${p.href}"${p.href === actual ? ' class="act" aria-current="page"' : ""}>${p.nombre}</a>`).join("") +
      `</div></div>`;

    const cabeza = document.querySelector("header.cabeza");
    if (cabeza) cabeza.insertAdjacentElement("afterend", nav);
    else document.body.insertAdjacentElement("afterbegin", nav);

    // El menú se abre con el botón y se cierra con todo lo demás:
    // otro clic, la tecla de escape, o irse por uno de los enlaces.
    const btn = nav.querySelector(".menu-btn"), lista = nav.querySelector(".enlaces");
    const cierra = () => { btn.setAttribute("aria-expanded", "false"); lista.classList.remove("abierto"); };
    btn.addEventListener("click", ev => {
      ev.stopPropagation();
      const abierto = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!abierto));
      lista.classList.toggle("abierto", !abierto);
    });
    lista.addEventListener("click", ev => { if (ev.target.closest("a")) cierra(); });
    document.addEventListener("click", ev => { if (!nav.contains(ev.target)) cierra(); });
    addEventListener("keydown", ev => { if (ev.key === "Escape") cierra(); });
  };

  const pie = () => {
    const f = document.createElement("footer");
    f.innerHTML = `<div class="wrap">
      <div class="cols">
        <div><h3>Quién lo lleva</h3><p>${D.responsable}</p></div>
        <div><h3>Si algo no cuadra</h3><p>${D.contacto}</p></div>
        <div><h3>Actualizado</h3><p class="dato">${fecha(D.actualizado)}</p></div>
      </div>
      <div class="pie-marca">
        <img src="img/conejo.png" alt="">
        <p>${D.campus} · Lo que separamos, lo construimos.
          <a href="pesaje.html">Para quien pesa</a></p>
      </div>
    </div>`;
    document.body.appendChild(f);
  };

  return { D, MAT, CLAVES, $, eti, pesos, kilos, enLetras, enLetrasM, fecha, fechaCorta, diaSemana, hoy,
           calendario, proxima, diasColecta, totalVentas,
           paraObra, paraArea, ejercidoArea, disponibleArea, avance,
           kilosPorMaterial, kilosTotal, cant, totalesTexto, totalesPorUnidad, unidadDe, seguimiento, bloqueReparto, barra, pie };
})();
