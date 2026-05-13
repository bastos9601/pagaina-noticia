# Noticias Live 🔴

Plataforma web moderna de noticias con sistema de canales en vivo y panel administrativo completo.

## 🚀 Tecnologías

- **Frontend**: React, Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase
- **Autenticación**: Supabase Auth
- **Video**: HLS.js, Video.js
- **Editor**: Editor.js
- **Hosting**: Netlify

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus credenciales

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build
```

## 🗄️ Base de Datos

Ejecutar los scripts SQL en Supabase (ver `/supabase/schema.sql`)

## 🎨 Características

- ✅ Portal de noticias moderno y responsive
- ✅ Sistema de canales en vivo (HLS, YouTube, Twitch)
- ✅ Panel administrativo completo
- ✅ Editor de contenido enriquecido
- ✅ Sistema de categorías y etiquetas
- ✅ SEO optimizado
- ✅ Publicidad integrada
- ✅ Modo oscuro profesional
- ✅ Optimizado para Netlify

## 📱 Páginas

### Públicas
- `/` - Inicio
- `/noticias` - Listado de noticias
- `/noticias/[slug]` - Detalle de noticia
- `/canales` - Canales en vivo
- `/categoria/[slug]` - Noticias por categoría

### Admin
- `/admin` - Dashboard
- `/admin/noticias` - Gestión de noticias
- `/admin/canales` - Gestión de canales
- `/admin/categorias` - Gestión de categorías
- `/admin/publicidad` - Gestión de banners

## 🔐 Seguridad

- Rutas protegidas con middleware
- Validación de formularios
- Sanitización de contenido
- Row Level Security en Supabase

## 📄 Licencia

MIT
