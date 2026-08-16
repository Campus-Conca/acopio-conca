# Acopio Concá — sitio del campus

Sitio estático de la campaña de acopio de residuos del Campus Concá (UAQ).
Explica cómo funciona, cuándo es la próxima colecta y rinde cuentas de lo
que se junta y en qué se convierte. Lo leen estudiantes de bachillerato y
universidad, casi siempre desde el celular.

## Archivos

```
index.html          portada: obra en curso, cómo funciona, materiales, calendario
participantes.html  padrón de quien tiene costal y seguimiento por persona
cuentas.html        kilos por colecta, actas de venta, obras y fórmulas
pesaje.html         página interna: hoja de captura y cartel imprimible
datos.js            TODOS los datos del sitio
comun.js            barra, pie, formato y cálculos compartidos
estilo.css          estilos de las cuatro páginas
img/                los dibujos del conejo (jpg) y el logo del campus (png)
wrangler.jsonc      nombre del Worker y carpeta que se sirve en Cloudflare
```

## Regla principal

**Solo se edita `datos.js`.** El diseño, los cálculos y la estructura no se
tocan salvo que Eduardo lo pida. Si un número parece mal, se revisa el dato,
no la fórmula.

## Dónde vive y cómo se publica

Repo local `/home/eduardo/proyectos/acopio-conca`, remoto
`Campus-Conca/acopio-conca` en GitHub, rama `main`. Cloudflare Workers
observa esa rama: al hacer push, en unos minutos queda arriba en
`acopio-conca.campusconcauaq.workers.dev`. La misma cuenta y el mismo
mecanismo que el sitio de la Franja Libre.

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

**Gastos del programa** en `gastos` y **obras terminadas** en `hechas`, con el
mismo formato comentado en el archivo.

**Si cambia quién entrega los costales**: `costal.quien`, `costal.whatsapp`
(el número va sin signos, con lada de país: `5214424052714`) y `costal.mensaje`,
que es el texto que llega escrito en WhatsApp.

**Nuevo semestre**: se cambian `entrega.inicio` y `entrega.fin`. El calendario
completo y la fecha del botón de la portada se recalculan solos.

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
Revisar las cuatro páginas, que la consola no tire errores, y verlas en un
ancho de 390 px, que es como las va a ver casi todo mundo.
