# 📦 Guía de Instalación - Noticias Live

## 🚀 Requisitos Previos

- Node.js 20 o superior
- Cuenta en Supabase (https://supabase.com)
- Cuenta en Netlify (https://netlify.com)

## 📋 Pasos de Instalación

### 1. Clonar e Instalar Dependencias

```bash
# Instalar dependencias
npm install
```

### 2. Configurar Supabase

1. Crear un nuevo proyecto en Supabase
2. Ir a SQL Editor y ejecutar el contenido de `supabase/schema.sql`
3. Copiar las credenciales:
   - URL del proyecto
   - Clave pública (anon key)
   - Clave de servicio (service role key)

### 3. Configurar Variables de Entorno

Crear archivo `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio

# Configuración del sitio
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=Noticias Live
NEXT_PUBLIC_SITE_DESCRIPTION=Portal de noticias en vivo

# Admin
ADMIN_EMAIL=admin@ejemplo.com
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
```

Abrir http://localhost:3000

## 🌐 Despliegue en Netlify

### Opción 1: Desde GitHub

1. Subir el proyecto a GitHub
2. Ir a Netlify Dashboard
3. Click en "New site from Git"
4. Seleccionar el repositorio
5. Configurar:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Agregar variables de entorno en Netlify:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (URL de Netlify)
7. Deploy

### Opción 2: Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Inicializar
netlify init

# Deploy
netlify deploy --prod
```

## 📝 Configuración Post-Instalación

### 1. Crear Categorías

Ir a `/admin/categorias` y crear las categorías necesarias.

### 2. Crear Primera Noticia

Ir a `/admin/noticias/nueva` y publicar la primera noticia.

### 3. Agregar Canales en Vivo

Ir a `/admin/canales/nuevo` y agregar canales:

**Para HLS:**
- Tipo: HLS
- URL: https://ejemplo.com/stream.m3u8

**Para YouTube:**
- Tipo: YouTube
- URL: https://youtube.com/watch?v=VIDEO_ID

**Para Twitch:**
- Tipo: Twitch
- URL: https://twitch.tv/CANAL

### 4. Configurar Publicidad (Opcional)

Ir a `/admin/publicidad` y agregar banners publicitarios.

## 🔐 Seguridad

### Row Level Security en Supabase

Las políticas RLS ya están configuradas en el schema. Verificar en:
Supabase Dashboard → Authentication → Policies

### Variables de Entorno

**NUNCA** subir el archivo `.env.local` a Git.

## 🎨 Personalización

### Colores

Editar `tailwind.config.ts`:

```typescript
colors: {
  primario: {
    DEFAULT: '#DC2626', // Cambiar color principal
    oscuro: '#991B1B',
    claro: '#EF4444',
  },
}
```

### Logo

Reemplazar el componente de logo en:
- `src/componentes/Encabezado.tsx`
- `src/componentes/PiePagina.tsx`

### Metadata SEO

Editar `src/app/layout.tsx` para cambiar título, descripción, etc.

## 📊 Monitoreo

### Logs en Netlify

Ver logs en: Netlify Dashboard → Site → Functions → Logs

### Logs en Supabase

Ver logs en: Supabase Dashboard → Logs

## 🐛 Solución de Problemas

### Error: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error de Supabase

Verificar:
1. Variables de entorno correctas
2. RLS policies habilitadas
3. Tablas creadas correctamente

### Error de Build en Netlify

1. Verificar Node.js version en `netlify.toml`
2. Revisar logs de build
3. Verificar variables de entorno

## 📚 Recursos

- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Netlify](https://docs.netlify.com)
- [Documentación Tailwind CSS](https://tailwindcss.com/docs)

## 🆘 Soporte

Para problemas o preguntas, revisar:
1. Logs de la aplicación
2. Consola del navegador
3. Logs de Supabase
4. Logs de Netlify
