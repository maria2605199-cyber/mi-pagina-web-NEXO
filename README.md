# NEXO · Estudio digital

Sitio web de NEXO, agencia de diseño y desarrollo de páginas web para negocios y empresas.

Sitio estático (HTML, CSS y JavaScript, sin dependencias ni compilación).

## Estructura

```
index.html        Página principal
css/styles.css    Estilos (paleta, tipografía, animaciones, responsive)
js/main.js        Menú móvil, animaciones, formulario → WhatsApp
assets/           Favicon
```

## Ver en local

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
```

## Configurar WhatsApp

En `js/main.js`, escribe tu número en formato internacional (solo dígitos):

```js
const WHATSAPP_NUMBER = "5215512345678";
```

Todos los botones de WhatsApp y el formulario de cotización usarán ese número.

## Publicar

Al ser un sitio estático puede publicarse en GitHub Pages, Netlify o Vercel apuntando a la raíz del repositorio.
