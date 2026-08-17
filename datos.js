/* =====================================================================
   DATOS — el único archivo que se edita.
   Lo leen las cuatro páginas, así que un número solo se cambia aquí.
   ===================================================================== */
window.DATOS = {

  campus: "UAQ · Campus Concá",
  actualizado: "2026-08-16",
  responsable: "Coordinación de Sustentabilidad",
  contacto: "Si un número no cuadra, dilo en la coordinación y se corrige.",

  entrega: {
    // Las fechas van una por una, a mano. El semestre no cae en una cadencia
    // pareja —hay puentes y semanas que se recorren, y a media temporada las
    // colectas se pasan de martes a miércoles—, así que generarlas con una
    // fórmula obligaba a publicar fechas que luego no se cumplían.
    // El día de la semana y la cuenta de colectas se leen de esta lista.
    fechas: [
      "2026-09-22",   // martes
      "2026-10-13",   // martes
      "2026-10-27",   // martes
      "2026-11-11",   // miércoles
      "2026-11-25",   // miércoles
      "2026-12-02"    // miércoles, la última del semestre
    ],
    lugar: "la fuente del centro del campus",
    horario: "9:00 a 14:00",
    pesaje: "13:00"
  },

  // El costal se pide por WhatsApp. Si cambia quién lo entrega, se cambia aquí.
  costal: {
    texto: "Se pide en la coordinación de sustentabilidad. Te anotan y ya.",
    quien: "Jhoana, de Sustentabilidad",
    whatsapp: "5214424052714",
    mensaje: "Hola Jhoana. Vi la página del acopio del campus y quiero pedir mi costal. Mi nombre es:"
  },

  // EL REPARTO. De cada peso que se vende, 70 centavos van a obras de las
  // áreas comunes y 30 al presupuesto del área de Sustentabilidad. Se parte
  // lo vendido, sin descontar nada antes: los gastos del programa —costales,
  // báscula, guantes— salen del 30% del área, así que el 70% compartido
  // llega limpio. Si cambia el acuerdo, se cambian estos dos números y el
  // sitio entero se recalcula solo. Los dos pct tienen que sumar 100.
  reparto: {
    compartido: { pct:70, nombre:"Proyectos compartidos",
                  para:"Obras para las áreas comunes: lo que usa todo el campus." },
    area:       { pct:30, nombre:"Área de Sustentabilidad",
                  para:"El presupuesto del área, y de ahí sale lo que cuesta operar: costales, báscula, guantes, letreros y campañas." }
  },

  meta: {
    obra: "Sala de exterior para la explanada",
    costo: 3499,
    hitos: [
      { pct: 25,  label: "Patas y mesa", y: 148 },
      { pct: 50,  label: "Asientos",     y: 136 },
      { pct: 80,  label: "Respaldos",    y: 102 },
      { pct: 100, label: "Cojines",      y: 92  }
    ]
  },

  // OJO: el precio del tetrapak es provisional, puesto para que la página
  // funcione. Cambiarlo en cuanto llegue el de la compradora.
  materiales: [
    { clave:"aluminio",  nombre:"Aluminio",      corto:"Alu",  color:"var(--m-alu)", precio:15,
      img:"img/aluminio.jpg",      condicion:"Vacías y aplastadas" },
    { clave:"pet",       nombre:"PET",           corto:"PET",  color:"var(--m-pet)", precio:6,
      img:"img/pet.jpg",           condicion:"Exprimidas, con tapa" },
    { clave:"pead",      nombre:"Plástico duro", corto:"Duro", color:"var(--m-dur)", precio:5,
      img:"img/plastico-duro.jpg", condicion:"Enjuagado" },
    { clave:"tetrapak",  nombre:"Tetrapak",      corto:"Tetra",color:"var(--m-tet)", precio:1,
      img:"img/tetrapak.jpg",      condicion:"Enjuagado y aplastado" }
  ],

  fuera: "Cartón, papel y vidrio se separan en el campus, pero no entran aquí.",

  etiquetas: [
    { clave:"administrativo", nombre:"Administrativo", color:"var(--e-adm)" },
    { clave:"docente",        nombre:"Docente",        color:"var(--e-doc)" },
    { clave:"prepa",          nombre:"Prepa",          color:"var(--e-pre)" },
    { clave:"pas",            nombre:"PAS",            color:"var(--e-pas)" },
    { clave:"agro",           nombre:"Agro",           color:"var(--e-agr)" }
  ],

  // { nombre:"Nombre Apellido", etiqueta:"pas", desde:"2026-09-24" },
  personas: [
  ],

  // { fecha:"2026-09-24", personas:[
  //     { persona:"Nombre Apellido", limpio:true,
  //       kg:{aluminio:0, pet:0, pead:0, tetrapak:0} } ]},
  jornadas: [
  ],

  // { fecha:"2026-10-08", comprador:"", firma:"",
  //   lineas:[ {material:"aluminio", kg:0, precio:15} ] },
  ventas: [
  ],

  // TODO lo que gasta el área, y sale de su 30%: lo que cuesta operar el
  // acopio y lo demás que compre con su bolsa. Es una sola lista porque es
  // una sola bolsa. Lo que no se anote aquí queda sin rendir cuentas.
  // { concepto:"Costales", monto:0, fecha:"" },
  gastos: [
  ],

  // El de kilos se calcula con lo alcanzado: "auto".
  estandares: { constancia:0.75, calidad:1.0, kgPorJornada:"auto" },

  // Obras terminadas con el 70% compartido.
  // { nombre:"", monto:0, fecha:"" },
  hechas: [
  ]
};
