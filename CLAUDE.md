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
comun.js            barra, pie, formato, cálculos, la barra del reparto y la banca
estilo.css          estilos de las cinco páginas
img/                los dibujos del conejo (jpg), el stencil y el sello (png)
img/qr-sitio.svg    el QR de la lámina de cierre; se genera, no se dibuja
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

La dirección buena es la de **Cloudflare Workers**:
<https://acopio-conca.campusconcauaq.workers.dev>. Es la que se comparte y la
que hay que revisar después de publicar. La de GitHub Pages
(<https://campus-conca.github.io/acopio-conca/>) sigue viva y se actualiza con
el mismo push, pero queda de respaldo: Eduardo reporta que no le abre sin wifi.

El Worker está enlazado al repo desde el 31 de agosto de 2026, así que **cada
push a `main` lo publica solo**, entre 45 segundos y un par de minutos después.
No hay que correr `wrangler` a mano. Si un día dejara de publicar, lo primero
que hay que mirar es que la GitHub App de Cloudflare siga con permiso sobre el
repo en la organización Campus-Conca, no en la cuenta personal.

**Ojo al verificar que un cambio subió:** Cloudflare responde **307** en
`/index.html` (manda a `/`) y en `/presentacion.html` (manda a `/presentacion`).
Un `curl` sin `-L` devuelve cuerpo vacío y parece que el cambio no llegó. Se
pide la ruta sin extensión, o se revisa `datos.js`, que sí se sirve directo.

**Ojo:** el push necesita la cuenta de GitHub `pas-web`
(`gh auth switch -u pas-web`); la cuenta habitual `eduardolusan-source` no
tiene permiso de escritura en Campus-Conca. Conviene regresar después con
`gh auth switch -u eduardolusan-source`.

El nombre del Worker y la carpeta que sirve están en `wrangler.jsonc`.

## Los materiales y sus unidades

Son cinco: **aluminio** ($23/kg), **fierro** ($20/kg), **PET** ($3/kg),
**plástico duro** ($3/kg) y **aceite vegetal** ($3/L; la garrafa de 20 L sale
en $60). La rayita de color de cada tarjeta sigue la colorimetría de los
contenedores del campus —metales en verde, plásticos en azul— y el aceite va
en su propio ámbar, porque no es ni lo uno ni lo otro.

**Lo que más fácil se rompe aquí:** el aceite se mide en **litros** y todo lo
demás en kilos. Cada material lleva su `unidad` en `datos.js` y las páginas la
leen; nunca se escribe "kg" a mano. Un total que sume kilos con litros es un
número que no existe, así que se dicen por separado —`totalesTexto()` devuelve
`"6.6 kg · 1.5 L"`— y de ahí salen la portada, las cuentas y la presentación.

La **única** excepción es la marca personal de kilos del padrón, donde un
litro cuenta como un kilo: si no, quien trae aceite nunca la alcanzaría. La
página lo dice con todas sus letras, y por eso se puede.

## Mantenimiento

Todo lo de abajo se genera solo desde `pesaje.html`, que devuelve el bloque
listo para pegar. Si Eduardo lo pasa en texto libre, se arma a mano con estos
formatos.

**Después de cada colecta** — dentro de `jornadas`:

```js
{ fecha:"2026-09-24", personas:[
  { persona:"Nombre Apellido", limpio:true, kg:{aluminio:0, fierro:0, pet:0, pead:0, aceite:0} }
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

**Nuevo semestre**: se escribe la lista `entrega.fechas`, una fecha por
renglón y en orden. Ya no se generan solas con una cadencia: el semestre real
tiene puentes y semanas que se recorren, y a media temporada las colectas
cambian de día. De esa lista salen la próxima fecha, el calendario completo,
la cuenta de colectas y hasta la frase del día de la semana (`diasColecta()`
dice "martes y miércoles" leyendo las fechas). Si una colecta se mueve, se
mueve ahí y el sitio entero se entera.

## La presentación

`presentacion.html` son dos mazos de láminas: el primero explica el esquema
completo en diez minutos (salón, academia, asamblea) y el segundo son las
cuentas de cerca, para quien pregunta por el dinero. Se leen en la página
como un guion o se proyectan con el botón **Presentar**: flechas o espacio
avanzan, `A` muestra el texto de apoyo, `N` muestra las notas de quien
conduce, `Esc` sale. La portada de cada mazo la arma solo el telón con la
cabecera del mazo.

**Proyectado se arranca sin el texto de apoyo**: en pantalla la gente lee o
escucha, no las dos. El guion completo se queda para leerse en la página, y
`A` lo trae de vuelta si alguien pregunta. Por eso una lámina no puede
depender de su `.apoyo` para entenderse: lo que tenga que verse va en la
frase grande, en una lista o en un dibujo.

**Ninguna lámina debe tener scroll.** El escenario lleva `overflow:auto`, así
que una lámina que no cabe no truena: simplemente se corta y nadie se entera.
El aire de arriba y abajo se mide contra la altura (`vh`), no contra el
ancho, porque en un cañón de 16:9 lo que escasea es alto. Al agregar o crecer
una lámina hay que revisarla a **1024×576**, que es el tamaño más apretado de
los que se usan; ahí cabe todo hoy, salvo tres láminas que se pasan por unos
30 px cuando se enciende la `A`.

Las láminas a dos columnas usan `.lam-dos` (`minmax(0,1fr)`, que es lo que
deja encoger de verdad la columna del dibujo) y se apilan solas abajo de 720
px de ancho.

Las láminas **no traen números escritos a mano**: precios, fechas, meta,
avance y montos del reparto se leen de `datos.js` al abrir la página. Por eso
la presentación no envejece, y por eso al agregar una lámina con cifras hay
que llenarla desde el script, no teclearla en el HTML.

Cuidado con los nombres de clase dentro de una lámina: el telón clona la
lámina al escenario, así que una clase repetida (`.sigue`, por ejemplo, que
el calendario usa para marcar la próxima fecha) puede robarle el nombre a un
control. Los botones del telón llevan prefijo `t-` por eso. Por lo mismo, lo
que haya que calcular sobre una lámina se calcula **antes** de abrir el
telón: el clon se lleva los atributos ya puestos.

**El QR.** La lámina de cierre lleva `img/qr-sitio.svg`, que abre la portada
—ahí está el botón de WhatsApp con el mensaje ya escrito—. Ese código **no se
dibuja solo**: si cambia `sitio` en `datos.js`, hay que volver a generarlo.
Se regenera así, parado en el repo:

```bash
python3 -c '
import qrcode, io, re
from qrcode.constants import ERROR_CORRECT_M
URL = re.search(r"sitio:\s*\"([^\"]+)\"", io.open("datos.js", encoding="utf-8").read()).group(1)
q = qrcode.QRCode(error_correction=ERROR_CORRECT_M, border=2); q.add_data(URL); q.make(fit=True)
m = q.get_matrix(); n = len(m)
d = "".join(f"M{x} {y}h1v1h-1z" for y,r in enumerate(m) for x,v in enumerate(r) if v)
io.open("img/qr-sitio.svg","w",encoding="utf-8").write(
  f"<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 {n} {n}\" shape-rendering=\"crispEdges\""
  f" role=\"img\" aria-label=\"Código QR de la página del acopio\"><title>{URL}</title>"
  f"<rect width=\"{n}\" height=\"{n}\" fill=\"#FFFFFF\"/><path fill=\"#16221C\" d=\"{d}\"/></svg>\n")
print(URL, n, "módulos")'
```

La dirección va escrita debajo del código para quien no pueda escanear, y
esa sí sale de `datos.js`. Después de regenerarlo conviene escanearlo con un
celular de verdad antes de presentar.

Se eligió nivel M y no Q porque lo que se necesita es que el módulo sea
grande —se escanea desde la última fila de un salón—, no que aguante
raspones: son 37×37 módulos y no conviene subir de ahí.

## La banca

`dibujoObra()` y `pintaObra()` viven en `comun.js` porque la usan la portada
y la presentación: si cada página dibujara la obra por su cuenta, dejaría de
ser la misma obra. `pintaObra` sube el corte por los mismos hitos que la
regla e interpola entre uno y otro, así que la banca crece por partes
—patas, asientos, respaldos, cojines— y no de un jalón.

Con la bolsa en ceros queda **entera punteada**, y así se enseña en un salón:
la promesa, no el cero. Los ceros siguen publicados en las cuentas, que es
donde toca rendirlos; la lámina del 70% solo los saca a pantalla cuando ya
hubo una venta.

La portada la pide con el lienzo completo (`0 0 300 190`), porque la regla de
porcentajes se mide contra esos 190 de alto. La lámina la pide recortada al
ras del dibujo (`vista:"10 88 280 92"`): el aire de arriba, proyectado, es
alto de pantalla desperdiciado.

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
fuera de los cinco que están. No meter fotos ni redes sociales. No cambiar
precios sin el dato de la compradora.

## Pendientes conocidos

Ya están los cinco dibujos. `img/cobre.jpg` se queda en el repo sin usar: el
cobre salió de la lista cuando entró el aceite, y si vuelve el dibujo ya está
hecho. El aceite además tiene su tira de tres pasos, `img/aceite-pasos.jpg`,
que va en la portada debajo de las tarjetas con la frase de `aceitePie`.

El padrón arrancó el 31 de agosto de 2026 con siete costales y el 1 de
septiembre llegó a diez, ya todos con etiqueta. La fecha `desde` es la del
alta, no la del préstamo del costal.

**Un renglón es un costal, no una persona.** Eduardo Luna y Mayra Chávez son
matrimonio y comparten uno, así que van en un solo renglón —"Eduardo Luna y
Mayra Chávez"— y así se anotan en el pesaje: el kilaje del costal completo,
no repartido entre los dos.

De Citlalli, de PAS, falta el apellido.

## Cómo probar antes de subir cambios

Abrir `index.html` directamente en el navegador — funciona sin servidor.
Revisar las cinco páginas, que la consola no tire errores, y verlas en un
ancho de 390 px, que es como las va a ver casi todo mundo. En la presentación,
abrir los dos mazos y llegar hasta la última lámina de cada uno.
