# Guía de Despliegue en Netlify

## Preparación del Proyecto

### 1. Verificar que el proyecto esté listo
✅ Configuración actualizada (next.config.js sin `output: 'standalone'`)
✅ netlify.toml configurado
✅ Variables de entorno documentadas en .env.example

## Pasos para Desplegar

### Opción A: Despliegue desde GitHub (Recomendado)

#### 1. Subir el código a GitHub

Si aún no has subido tu código a GitHub:

```bash
# Inicializar git (si no está inicializado)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Preparar proyecto para despliegue en Netlify"

# Crear repositorio en GitHub y conectarlo
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git

# Subir el código
git push -u origin main
```

**IMPORTANTE**: Si tienes problemas con SSL, ejecuta:
```bash
git config --global http.sslVerify false
```

#### 2. Conectar con Netlify

1. Ve a [https://app.netlify.com](https://app.netlify.com)
2. Inicia sesión o crea una cuenta
3. Click en "Add new site" → "Import an existing project"
4. Selecciona "GitHub" y autoriza el acceso
5. Busca y selecciona tu repositorio
6. Netlify detectará automáticamente que es un proyecto Next.js

#### 3. Configurar el Build

Netlify debería detectar automáticamente:
- **Build command**: `npm run build`
- **Publish directory**: `.next`
- **Node version**: 20

Si no, configúralos manualmente.

#### 4. Configurar Variables de Entorno

En la sección "Environment variables", agrega:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio_supabase
NEXT_PUBLIC_SITE_URL=https://tu-sitio.netlify.app
NEXT_PUBLIC_SITE_NAME=Noticias Live
NEXT_PUBLIC_SITE_DESCRIPTION=Portal de noticias en vivo
ADMIN_EMAIL=tu_email@ejemplo.com
```

**Dónde encontrar las credenciales de Supabase:**
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a Settings → API
4. Copia:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - anon/public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

#### 5. Desplegar

1. Click en "Deploy site"
2. Espera a que termine el build (5-10 minutos)
3. Una vez completado, tendrás una URL como: `https://random-name-123.netlify.app`

#### 6. Configurar Dominio Personalizado (Opcional)

1. En el dashboard de Netlify, ve a "Domain settings"
2. Click en "Add custom domain"
3. Sigue las instrucciones para configurar tu dominio

### Opción B: Despliegue Manual con Netlify CLI

#### 1. Instalar Netlify CLI

```bash
npm install -g netlify-cli
```

#### 2. Login en Netlify

```bash
netlify login
```

#### 3. Inicializar el sitio

```bash
netlify init
```

Sigue las instrucciones:
- Selecciona "Create & configure a new site"
- Elige tu equipo
- Nombre del sitio (opcional)

#### 4. Configurar variables de entorno

```bash
netlify env:set NEXT_PUBLIC_SUPABASE_URL "tu_url"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "tu_clave"
netlify env:set SUPABASE_SERVICE_ROLE_KEY "tu_clave_servicio"
netlify env:set NEXT_PUBLIC_SITE_URL "https://tu-sitio.netlify.app"
netlify env:set NEXT_PUBLIC_SITE_NAME "Noticias Live"
netlify env:set NEXT_PUBLIC_SITE_DESCRIPTION "Portal de noticias en vivo"
netlify env:set ADMIN_EMAIL "tu_email@ejemplo.com"
```

#### 5. Desplegar

```bash
# Build local
npm run build

# Desplegar
netlify deploy --prod
```

## Configuración Post-Despliegue

### 1. Actualizar URL en Supabase

1. Ve a tu proyecto en Supabase
2. Settings → Authentication → URL Configuration
3. Agrega tu URL de Netlify a "Site URL" y "Redirect URLs":
   - `https://tu-sitio.netlify.app`
   - `https://tu-sitio.netlify.app/auth/callback`

### 2. Verificar Funcionalidad

Prueba estas funcionalidades:
- ✅ Página principal carga correctamente
- ✅ Login de admin funciona
- ✅ Subida de imágenes funciona
- ✅ Creación de noticias funciona
- ✅ Reproducción de videos funciona
- ✅ Canales en vivo funcionan

### 3. Configurar Dominio en Variables de Entorno

Si configuraste un dominio personalizado, actualiza:
```bash
netlify env:set NEXT_PUBLIC_SITE_URL "https://tu-dominio.com"
```

Y redespliega:
```bash
netlify deploy --prod
```

## Despliegues Automáticos

Una vez conectado con GitHub, cada vez que hagas `git push` a la rama `main`, Netlify automáticamente:
1. Detectará los cambios
2. Ejecutará el build
3. Desplegará la nueva versión

## Troubleshooting

### Error: "Build failed"
- Verifica que todas las variables de entorno estén configuradas
- Revisa los logs de build en Netlify
- Asegúrate de que `npm run build` funcione localmente

### Error: "Function invocation failed"
- Verifica que las credenciales de Supabase sean correctas
- Revisa los logs de funciones en Netlify

### Imágenes no cargan
- Verifica que la URL de Supabase esté en `next.config.js` → `remotePatterns`
- Verifica que el bucket de Supabase sea público

### Videos no reproducen
- Verifica que HLS.js esté instalado: `npm list hls.js`
- Revisa la consola del navegador para errores

### Error de CORS
- Verifica que la URL del sitio esté configurada en Supabase
- Agrega la URL de Netlify a las URLs permitidas en Supabase

## Monitoreo

### Ver Logs
```bash
netlify logs
```

### Ver Estado del Sitio
```bash
netlify status
```

### Abrir el Sitio
```bash
netlify open:site
```

### Abrir Dashboard de Netlify
```bash
netlify open:admin
```

## Comandos Útiles

```bash
# Ver información del sitio
netlify status

# Ver variables de entorno
netlify env:list

# Desplegar preview (no producción)
netlify deploy

# Desplegar a producción
netlify deploy --prod

# Ver logs en tiempo real
netlify logs --live

# Rollback a versión anterior
netlify rollback
```

## Costos

Netlify ofrece un plan gratuito que incluye:
- ✅ 100 GB de ancho de banda/mes
- ✅ 300 minutos de build/mes
- ✅ Despliegues ilimitados
- ✅ HTTPS automático
- ✅ Dominio personalizado

Para proyectos más grandes, considera el plan Pro ($19/mes).

## Recursos Adicionales

- [Documentación de Netlify](https://docs.netlify.com)
- [Next.js en Netlify](https://docs.netlify.com/frameworks/next-js/overview/)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/)
- [Supabase + Netlify](https://supabase.com/docs/guides/hosting/netlify)
