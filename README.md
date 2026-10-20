# Portafolio Profesional — Daniel Esteban Rojas Sánchez

Sitio web personal y portafolio de proyectos de ingeniería y desarrollo de software, con diseño sobrio y minimalista inspirado en el estilo **Apple (Liquid Glass / VisionOS)**, optimizado para despliegue estático ultra-rápido en **Vercel**.

## ✨ Características de Diseño
- **Estilo Apple & Liquid Glass:** Tarjetas con efecto vidrio esmerilado (*frosted glass*), desenfoque de fondo profundo (`backdrop-filter: blur(30px)`), reflejos de luz especular en los bordes y sombras suaves.
- **Tipografía depurada:** Tipografía limpia inspirada en SF Pro ([Inter](https://fonts.google.com/specimen/Inter)) con jerarquía tipográfica editorial.
- **Navegación tipo cápsula flotante:** Barra de navegación suspendida con estética minimalista.
- **Bento Grids & Layout sobrio:** Organización balanceada de proyectos, métricas, trayectoria y habilidades con amplio espacio negativo.

---

## 🚀 Despliegue en Vercel

Este proyecto está construido con **HTML5, CSS3 y JavaScript puro**, sin dependencias ni procesos de compilación, haciéndolo 100% compatible y gratuito para hospedar en Vercel.

### Opción 1: Despliegue desde GitHub (Recomendado)
1. Sube este repositorio a tu cuenta de GitHub:
   ```bash
   git init
   git add .
   git commit -m "Portafolio Daniel Rojas - Liquid Glass"
   git branch -M main
   git remote add origin <URL-DE-TU-REPOSITORIO>
   git push -u origin main
   ```
2. Entra a [vercel.com](https://vercel.com/) e inicia sesión con tu cuenta.
3. Haz clic en **"Add New Project"** y selecciona tu repositorio.
4. En la configuración del proyecto:
   - **Framework Preset:** *Other*
   - **Root Directory:** `./`
5. Haz clic en **Deploy**. ¡Tu portafolio estará en línea en pocos segundos!

---

### Opción 2: Despliegue directo con Vercel CLI
Si tienes Node.js instalado, puedes ejecutar en tu terminal dentro de esta carpeta:
```bash
npx vercel
```
Sigue las preguntas en pantalla y el sitio quedará desplegado automáticamente.

---

## 🛠️ Cómo agregar o editar proyectos

Para agregar un nuevo proyecto en el portafolio, abre [index.html](file:///c:/Users/danie/OneDrive/Desktop/portafolio/index.html) y busca la sección `<div class="projects-container" id="projects-container">`.

Puedes duplicar una de las tarjetas existentes con la siguiente estructura:

```html
<article class="liquid-card project-card" data-category="fullstack">
  <div class="project-inner">
    <div class="project-header">
      <div class="badge-row">
        <span class="liquid-status-badge">
          <span class="pip-green"></span> En Producción
        </span>
        <span class="project-category-text">Web App · React & Node</span>
      </div>
      <h3 class="project-name">Nombre del Proyecto</h3>
      <p class="project-location">Ciudad o Cliente</p>
    </div>

    <div class="project-glass-display">
      <div class="glass-bar">
        <span class="glass-pip"></span>
        <span class="glass-pip"></span>
        <span class="glass-pip"></span>
        <span class="glass-domain">tudominio.com</span>
      </div>
      <div class="glass-canvas canvas-relax">
        <div class="canvas-reflection"></div>
        <div class="canvas-content">
          <span class="canvas-lead">Título del Preview</span>
          <span class="canvas-sub">Subtítulo o tecnologías</span>
        </div>
      </div>
    </div>

    <p class="project-summary">
      Descripción clara del desarrollo, resolución técnica y arquitectura.
    </p>

    <div class="pill-tags-row">
      <span class="tag-pill">React</span>
      <span class="tag-pill">TypeScript</span>
    </div>

    <div class="project-cta-row">
      <a href="https://tudominio.com" target="_blank" rel="noopener noreferrer" class="btn-apple-link">
        <span>Abrir Proyecto</span>
      </a>
    </div>
  </div>
</article>
```

> **Categorías para el filtro:** `data-category="fullstack"`, `data-category="ecommerce"` o `data-category="backend"`.
