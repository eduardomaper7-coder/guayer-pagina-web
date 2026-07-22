# Clínica Dental Guayero — tratamientos corregidos

Se han reconstruido las páginas de Radiología, Escáner intraoral, Ortodoncia, Cirugía oral e Implantología avanzada con HTML, CSS y JavaScript. Incluyen formularios visuales, mapas interactivos, Font Awesome, Google Translate y lightbox para ampliar fotografías.


## Idiomas y WhatsApp

El encabezado incorpora un desplegable con Español, English, Deutsch y Français,
conectado a Google Website Translator. El botón flotante usa:
`https://web.whatsapp.com/send?phone=34609044603`

Para probar la traducción:
`python -m http.server 8000`


## Banderas del traductor

El selector ya no utiliza emojis. Emplea archivos SVG de banderas dentro de
`assets/images/flags/` y cada opción activa el motor de Google Traductor.


## Cambio automático de idioma

- En la primera visita se detecta el idioma del navegador.
- Idiomas admitidos: español, inglés, alemán y francés.
- Al elegir una bandera, la traducción se aplica inmediatamente.
- El idioma elegido queda guardado para las demás páginas y futuras visitas.
- Google Traductor requiere conexión a internet y que el proyecto se abra desde
  un servidor web, no directamente con `file://`.


## Google Traductor corregido

La versión anterior utilizaba el antiguo widget JavaScript de Google y podía
mostrar un error. Esta versión abre la página mediante el traductor web oficial
de Google:

`https://translate.google.com/translate`

### Funcionamiento

- En una web pública, traduce la URL que el visitante está viendo.
- En localhost usa como referencia `https://clinicadentalguayero.es` porque
  Google no puede acceder a `localhost` ni a archivos `file://`.
- Detecta automáticamente el idioma del navegador cuando la web ya está
  publicada.
- El idioma también puede elegirse manualmente mediante las banderas.

### Cambiar el dominio de producción

En `assets/js/main.js`, modifica:

```js
const GUAYERO_PRODUCTION_ORIGIN = 'https://clinicadentalguayero.es';
```


## Navegación unificada

Todas las páginas utilizan exactamente la misma cabecera HTML. El archivo
`assets/js/main.js` detecta la página actual y activa automáticamente el enlace
correspondiente, incluido el submenú de tratamientos.

La apariencia y el comportamiento común están al final de
`assets/css/style.css`, bajo el bloque `BARRA DE NAVEGACIÓN UNIFICADA`.


## Barra visible de Google Traductor

Al pulsar la bandera de la navegación se abre una barra justo debajo del menú.
Dentro se muestra el selector oficial de Google Traductor con su lista completa
de idiomas habilitados. Al seleccionar un idioma, Google traduce la página y
puede mostrar también su barra informativa.

La integración requiere conexión a internet y debe ejecutarse mediante HTTP o
HTTPS. Para probarla localmente:

```bash
python -m http.server 8000
```


## Selector directo de idiomas

La navegación muestra únicamente un desplegable. El widget oficial de Google
Traductor se mantiene oculto y se utiliza internamente. La barra superior de
Google puede aparecer después de traducir.

Debe probarse mediante HTTP/HTTPS y con conexión a internet.


## Corrección del desplegable

El selector ya no permanece desactivado mientras carga Google. Se puede abrir
inmediatamente.

Al elegir un idioma:

1. intenta utilizar el widget oficial oculto de Google Traductor;
2. si el widget no ha cargado o está bloqueado, abre automáticamente la página
   mediante la URL web oficial de Google Traductor.

En localhost se traduce la ruta pública equivalente de
`https://clinicadentalguayero.es`, porque Google no puede acceder a localhost.


## Animaciones

Se incorporaron animaciones progresivas sin dependencias externas:

- entrada suave de la página y la cabecera;
- aparición de contenidos al hacer scroll;
- efecto escalonado en tarjetas y galerías;
- elevación y zoom al pasar el cursor;
- animaciones en botones, iconos, formularios y WhatsApp;
- cabecera compacta al desplazarse;
- ligero efecto de profundidad en las cabeceras;
- compatibilidad con `prefers-reduced-motion`.


## Páginas legales añadidas

- `politica-de-cookies.html`
- `politica-de-privacidad.html`
- `aviso-legal.html`

Todos los enlaces del pie de página apuntan ahora a estas páginas. Se conservaron
la navegación, el selector de idiomas, las animaciones, el mapa interactivo y el
botón flotante de WhatsApp.


## Pie de página actualizado

El texto de créditos de todas las páginas se ha sustituido por:

`Copyright Oficial © 2026 Clínica Dental Guayero`


## Imágenes de WordPress incorporadas

Se han incluido las 66 imágenes del archivo proporcionado.

- Originales: `assets/images/originales-wordpress/`
- Galería ampliada de instalaciones y equipo trabajando.
- Fotografías reales del equipo.
- Imágenes de radiología, escáner, ortodoncia, cirugía e implantología.
- Logotipo y favicon originales.
- Todas las galerías mantienen el popup de ampliación.
