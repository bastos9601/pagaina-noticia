# 🚀 Pasos Rápidos para Desplegar en Netlify

## Opción 1: Desde la Web (Más Fácil)

### 1. Subir a GitHub
```bash
git add .
git commit -m "Listo para desplegar"
git push origin main
```

Si tienes error de SSL:
```bash
git config --global http.sslVerify false
git push origin main
```

### 2. Conectar con Netlify
1. Ve a https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Conecta con GitHub
4. Selecciona tu repositorio
5. Netlify detectará automáticamente la configuración

### 3. Agregar Variables de Entorno
En Netlify, ve a Site settings → Environment variables y agrega:

```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio
NEXT_PUBLIC_SITE_URL=https://tu-sitio.netlify.app
NEXT_PUBLIC_SITE_NAME=Noticias Live
NEXT_PUBLIC_SITE_DESCRIPTION=Portal de noticias en vivo
ADMIN_EMAIL=tu@email.com
```

**Dónde encontrar las claves de Supabase:**
- Ve a https://supabase.com/dashboard
- Selecciona tu proyecto
- Settings → API
- Copia las claves

### 4. Desplegar
Click en "Deploy site" y espera 5-10 minutos.

### 5. Configurar Supabase
En Supabase, ve a Authentication → URL Configuration y agrega:
- Site URL: `https://tu-sitio.netlify.app`
- Redirect URLs: `https://tu-sitio.netlify.app/auth/callback`

## Opción 2: Con Netlify CLI

### 1. Instalar CLI
```bash
npm install -g netlify-cli
```

### 2. Login
```bash
netlify login
```

### 3. Inicializar
```bash
netlify init
```

### 4. Configurar Variables
```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "tu_url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "tu_clave"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "tu_clave_servicio"
netlify env:set NEXT_PUBLIC_SITE_URL "https://tu-sitio.netlify.app"
netlify env:set NEXT_PUBLIC_SITE_NAME "Noticias Live"
netlify env:set NEXT_PUBLIC_SITE_DESCRIPTION "Portal de noticias"
netlify env:set ADMIN_EMAIL "tu@email.com"
```

### 5. Desplegar
```bash
netlify deploy --prod
```

## ¿Qué Archivos se Modificaron?

✅ `next.config.js` - Removido `output: 'standalone'` para compatibilidad con Netlify
✅ `netlify.toml` - Optimizado con headers de cache y seguridad
✅ `.gitignore` - Agregado para evitar subir archivos innecesarios

## Verificación Post-Despliegue

1. Abre tu sitio: `https://tu-sitio.netlify.app`
2. Prueba el login de admin
3. Crea una noticia de prueba
4. Verifica que los videos reproduzcan

## Problemas Comunes

**Build falla:**
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs en Netlify

**Login no funciona:**
- Verifica que agregaste la URL de Netlify en Supabase

**Imágenes no cargan:**
- Verifica que los buckets de Supabase sean públicos

## Despliegues Automáticos

Una vez conectado con GitHub, cada `git push` desplegará automáticamente.

## Comandos Útiles

```bash
# Ver estado
netlify status

# Ver logs
netlify logs

# Abrir sitio
netlify open:site

# Abrir dashboard
netlify open:admin
```

## Costo

El plan gratuito de Netlify incluye:
- 100 GB de ancho de banda/mes
- 300 minutos de build/mes
- Despliegues ilimitados
- HTTPS gratis

¡Suficiente para empezar!
