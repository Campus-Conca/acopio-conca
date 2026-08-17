# Acopio Concá — sitio del campus

Sitio estático de la campaña de acopio de residuos del Campus Concá (UAQ).
Explica cómo funciona, cuándo es la próxima colecta y rinde cuentas de lo
que se junta y en qué se convierte. Lo leen estudiantes de bachillerato y
universidad, casi siempre desde el celular.

## Archivos

```
index.html          portada: obra en curso, el reparto, cómo funciona, materiales, calendario
participantes.html  padrón de quien tiene costal y seguimiento por persona
cuentas.html        kilos por colecta, actas de venta, el reparto, obras y fórmulas
presentacion.html   dos mazos de láminas para proyectar y explicar el esquema
pesaje.html         página interna: hoja de captura y cartel imprimible
datos.js            TODOS los datos del sitio
comun.js            barra, pie, formato, cálculos y la barra del reparto
estilo.css          estilos de las cinco páginas
img/                los dibujos del conejo (jpg), el stencil y el sello (png)
wrangler.jsonc      nombre del Worker y carpeta que se sirve en Cloudflare
```

## Regla principal

**Solo se edita `datos.js`.** El diseño, los cálculos y la estructura no se
tocan salvo que Eduardo lo pida. Si un número parece mal, se revisa el dato,
no la fórmula.

## Cómo se reparte el dinero

Se parte **lo vendido**, sin descontarle nada antes:

```
70%  →  proyectos compartidos de las áreas comunes   (la obra en curso)
30%  →  presupuesto del área de Sustentabilidad
```

**Los gastos del programa salen del 30% del área**, no de la bolsa completa:
costales, báscula, guantes, letreros. Por eso el 70% compartido llega limpio
y por eso `gastos` es una sola lista —una sola bolsa, la del área—. Al
arrancar el semestre esa bolsa puede quedar en rojo, porque los costales se
compran antes de la primera venta; eso se enseña, no se esconde.

Los dos porcentajes viven en `datos.js`, en `reparto`, y tienen que sumar 100.
Cambiarlos ahí recalcula la portada, las cuentas y la presentación.

**Lo que más fácil se rompe:** la barra de la obra sube con su 70%, no con lo
vendido completo (`avance = paraObra ÷ meta.costo`). Contarlo todo contra el
costo hace que la página prometa una fecha que no va a cumplir.

El reparto se calcula en pesos enteros y la bolsa del área se lleva el resto,
para que las dos partes sumen exactamente lo vendido. Una tabla que no cuadra
por un peso vuelve discutible todo lo demás.

Las obras pagadas con el 70% van en `hechas`; lo que gasta el área de su 30%
va en `gastos`. Lo que no se anote queda sin rendir cuentas.

## Dónde vive y cómo se publica

Repo local `/home/eduardo/proyectos/acopio-conca`, remoto
`Campus-Conca/acopio-conca` en GitHub, rama `main`.

El sitio en vivo lo sirve **GitHub Pages** desde la raíz de `main`:
<https://campus-conca.github.io/acopio-conca/>. Al hacer push queda arriba en
un par de minutos, sin más trámite.

Queda pendiente lo de Cloudflare Workers (`acopio-conca.campusconcauaq.workers.dev`,
definido en `wrangler.jsonc`): esa conexión nunca se terminó de hacer en el
panel. Mientras tanto, la dirección buena es la de Pages.

**Ojo:** el push necesita la cuenta de GitHub `pas-web`
(`gh auth switch -u pas-web`); la cuenta habitual `eduardolusan-source` no
tiene permiso de escritura en Campus-Conca. Conviene regresar después con
`gh auth switch -u eduardolusan-source`.

El nombre del Worker y la carpeta que sirve están en `wrangler.jsonc`.

## Mantenimiento

Todo lo de abajo se genera solo desde `pesaje.html`, que devuelve el bloque
listo para pegar. Si Eduardo lo pasa en texto libre, se arma a mano con estos
formatos.

**Después de cada colecta** — dentro de `jornadas`:

```js
{ fecha:"2026-09-24", personas:[
  { persona:"Nombre Apellido", limpio:true, kg:{aluminio:0, pet:0, pead:0, tetrapak:0} }
]},
```

**Después de cada venta** — dentro de `ventas`:

```js
{ fecha:"2026-10-08", comprador:"", firma:"",
  lineas:[ {material:"aluminio", kg:0, precio:15} ] },
```

**Alta de alguien** — dentro de `personas`:

```js
{ nombre:"Nombre Apellido", etiqueta:"pas", desde:"2026-09-24" },
```

Etiquetas válidas: `administrativo`, `docente`, `prepa`, `pas`, `agro`.

**Todo lo que gasta el área de su 30%** —incluido lo que cuesta operar— en
`gastos`, y **obras terminadas** con el 70% en `hechas`, con el mismo formato
comentado en el archivo.

**Si cambia quién entrega los costales**: `costal.quien`, `costal.whatsapp`
(el número va sin signos, con lada de país: `5214424052714`) y `costal.mensaje`,
que es el texto que llega escrito en WhatsApp.

**Nuevo semestre**: se cambian `entrega.inicio` y `entrega.fin`. El calendario
completo y la fecha del botón de la portada se recalculan solos.

## La presentación

`presentacion.html` son dos mazos de láminas: el primero explica el esquema
completo en diez minutos (salón, academia, asamblea) y el segundo son las
cuentas de cerca, para quien pregunta por el dinero. Se leen en la página
como un guion o se proyectan con el botón **Presentar**: flechas o espacio
avanzan, `A` esconde el texto de apoyo, `N` muestra las notas de quien
conduce, `Esc` sale. La portada de cada mazo la arma solo el telón con la
cabecera del mazo.

Las láminas **no traen números escritos a mano**: precios, fechas, meta,
avance y montos del reparto se leen de `datos.js` al abrir la página. Por eso
la presentación no envejece, y por eso al agregar una lámina con cifras hay
que llenarla desde el script, no teclearla en el HTML.

Cuidado con los nombres de clase dentro de una lámina: el telón clona la
lámina al escenario, así que una clase repetida (`.sigue`, por ejemplo, que
el calendario usa para marcar la próxima fecha) puede robarle el nombre a un
control. Los botones del telón llevan prefijo `t-` por eso.

## Los dibujos

`img/conejo.png` es el stencil del campus y `img/embajadores.png` el sello de
los Embajadores del Reciclaje. Los dos son PNG de dos tintas con fondo
transparente, en el color `--tinta` (#16221C), sacados de una foto del
stencil de papel: se recorta el marco, se binariza y se colorea. Sobre fondo
oscuro se invierten con `filter:invert(1) brightness(1.6)`, que es lo que ya
hacen la barra y el pie.

## No hacer

No inventar cifras ni completar un dato faltante con un estimado: la página
entera se sostiene en que cada número pasó por la báscula y por la libreta.
No borrar a nadie del padrón por no haber traído nada; quien no trae aparece
con cero, y esconderlo vuelve inútil el seguimiento. No agregar materiales
fuera de los cuatro que están. No meter fotos ni redes sociales. No cambiar
precios sin el dato de la compradora.

## Pendientes conocidos

El precio del tetrapak está en **$1 por kilo, provisional**, esperando el dato
real de la compañera que vende. El padrón está vacío: falta cargar un primer
grupo de personas antes de la primera colecta del 24 de septiembre.

## Cómo probar antes de subir cambios

Abrir `index.html` directamente en el navegador — funciona sin servidor.
Revisar las cinco páginas, que la consola no tire errores, y verlas en un
ancho de 390 px, que es como las va a ver casi todo mundo. En la presentación,
abrir los dos mazos y llegar hasta la última lámina de cada uno.
