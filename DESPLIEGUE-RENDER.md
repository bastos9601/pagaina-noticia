# Guía de Despliegue en Render

## ¿Por qué Render?

- ✅ **Sin límites de timeout** en funciones (a diferencia de Netlify)
- ✅ **Mejor para streaming** HLS
- ✅ **Plan gratuito** generoso
- ✅ **Fácil de configurar**
- ✅ **Soporte completo** para Next.js

## Preparación

### 1. Verificar que el proyecto esté listo

Tu proyecto ya está configurado correctamente. Solo asegúrate de que:

- ✅ `package.json` tiene el script `build`
- ✅ `.gitignore` excluye `node_modules` y `.env`
- ✅ El código está en GitHub

### 2. Subir cambios a GitHub

```bash
git add .
git commit -m "Preparar para despliegue en Render"
git push origin main
```

## Despliegue Paso a Paso

### Paso 1: Crear cuenta en Render

1. Ve a https://render.com
2. Click en "Get Started"
3. Regístrate con GitHub (recomendado)
4. Autoriza el acceso a tus repositorios

### Paso 2: Crear nuevo Web Service

1. En el dashboard, click "New +"
2. Selecciona "Web Service"
3. Conecta tu repositorio de GitHub
4. Busca y selecciona `pagaina-noticia` (o como se llame tu repo)
5. Click "Connect"

### Paso 3: Configurar el servicio

Render detectará automáticamente que es Next.js. Configura:

**Configuración básica:**
- **Name:** `noticias-live` (o el nombre que prefieras)
- **Region:** Selecciona la más cercana a tu audiencia
- **Branch:** `main`
- **Root Directory:** (dejar vacío)

**Build & Deploy:**
- **Runtime:** `Node`
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

**Plan:**
- Selecciona **"Free"** para empezar

### Paso 4: Variables de Entorno

Click en "Advanced" y agrega estas variables:

```
NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
SUPABASE_SERVICE_ROLE_KEY=tu_clave_servicio
NEXT_PUBLIC_SITE_URL=https://tu-app.onrender.com
NEXT_PUBLIC_SITE_NAME=Noticias Live
NEXT_PUBLIC_SITE_DESCRIPTION=Portal de noticias en vivo
ADMIN_EMAIL=tu@email.com
NODE_VERSION=20
```

**Importante:** 
- Usa las mismas credenciales de Supabase que en Netlify
- `NEXT_PUBLIC_SITE_URL` lo obtendrás después del primer deploy

### Paso 5: Desplegar

1. Click en "Create Web Service"
2. Render comenzará a construir tu aplicación
3. Espera 5-10 minutos (primera vez es más lento)
4. Verás los logs en tiempo real

### Paso 6: Obtener la URL

Una vez completado el deploy:

1. Verás tu URL: `https://tu-app.onrender.com`
2. Copia esta URL
3. Ve a "Environment" en el menú lateral
4. Edita `NEXT_PUBLIC_SITE_URL` con tu URL real
5. Guarda y redespliega (automático)

### Paso 7: Configurar Supabase

1. Ve a https://supabase.com/dashboard
2. Selecciona tu proyecto
3. Settings → Authentication → URL Configuration
4. Agrega tu URL de Render:
   - **Site URL:** `https://tu-app.onrender.com`
   - **Redirect URLs:** `https://tu-app.onrender.com/auth/callback`
5. Guarda los cambios

## Verificación Post-Despliegue

### 1. Probar el sitio

1. Abre `https://tu-app.onrender.com`
2. Verifica que carga correctamente
3. Prueba el login de admin
4. Crea una noticia de prueba
5. Prueba reproducir un canal

### 2. Verificar el proxy HLS

1. Abre un canal con URL HTTP
2. Abre la consola del navegador (F12)
3. Deberías ver: `🔄 Stream HTTP detectado, usando proxy interno...`
4. El canal debería reproducir sin errores

### 3. Verificar funcionalidades

- ✅ Login funciona
- ✅ Crear/editar noticias
- ✅ Subir imágenes
- ✅ Subir videos
- ✅ Canales reproducen
- ✅ Búsqueda funciona

## Configuración Adicional

### Dominio Personalizado (Opcional)

1. En Render, ve a "Settings"
2. Scroll hasta "Custom Domain"
3. Click "Add Custom Domain"
4. Sigue las instrucciones para configurar DNS

### SSL/HTTPS

✅ Render proporciona SSL automático y gratuito
✅ No necesitas configurar nada

### Despliegues Automáticos

✅ Cada `git push` a `main` desplegará automáticamente
✅ Puedes desactivar esto en Settings si prefieres deploys manuales

## Diferencias con Netlify

| Característica | Render | Netlify |
|----------------|--------|---------|
| Timeout Functions | ⏱️ Sin límite | ⏱️ 10s (free) / 26s (pro) |
| Streaming HLS | ✅ Excelente | ⚠️ Limitado |
| Build Time | 🐌 Más lento | ⚡ Más rápido |
| Cold Start | 🥶 ~30s (free) | ⚡ Instantáneo |
| Precio Free | 💰 750 hrs/mes | 💰 100 GB/mes |
| Mejor para | 🎥 Streaming, APIs | 📄 Sitios estáticos |

### Cold Start en Plan Gratuito

⚠️ **Importante:** El plan gratuito de Render tiene "cold starts":
- Si nadie visita tu sitio por 15 minutos, se "duerme"
- La primera visita después tarda ~30 segundos en cargar
- Visitas subsecuentes son instantáneas

**Soluciones:**
1. Usar el plan Starter ($7/mes) - sin cold starts
2. Usar un servicio de "ping" para mantenerlo activo
3. Aceptar el cold start (solo afecta primera visita)

## Monitoreo

### Ver Logs

1. En Render dashboard
2. Click en tu servicio
3. Ve a "Logs"
4. Verás logs en tiempo real

### Métricas

1. Ve a "Metrics"
2. Verás:
   - CPU usage
   - Memory usage
   - Request count
   - Response times

## Troubleshooting

### Build falla

**Error común:** `npm ERR! code ELIFECYCLE`

**Solución:**
1. Verifica que `npm run build` funcione localmente
2. Revisa los logs de build en Render
3. Asegúrate de que todas las variables de entorno estén configuradas

### Sitio no carga

**Posibles causas:**
1. Variables de entorno faltantes
2. Error en el código
3. Puerto incorrecto

**Solución:**
- Revisa los logs en Render
- Verifica que `npm start` funcione localmente

### Imágenes no cargan

**Causa:** URLs de Supabase no configuradas

**Solución:**
- Verifica que `NEXT_PUBLIC_SUPABASE_URL` esté correcta
- Verifica que los buckets de Supabase sean públicos

### Streams no reproducen

**Causa:** Proxy HLS no funciona

**Solución:**
1. Verifica los logs del servidor
2. Prueba la URL del proxy directamente: `https://tu-app.onrender.com/api/hls?url=...`
3. Revisa la consola del navegador

## Comandos Útiles

### Redeploy Manual

```bash
# Desde tu terminal local
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

### Ver Logs en Tiempo Real

En el dashboard de Render, los logs se actualizan automáticamente.

### Rollback a Versión Anterior

1. Ve a "Deploys" en Render
2. Encuentra el deploy anterior
3. Click en "Rollback"

## Costos

### Plan Gratuito
- ✅ 750 horas/mes
- ✅ 512 MB RAM
- ✅ 0.1 CPU
- ⚠️ Cold starts después de 15 min inactividad
- ✅ SSL gratis
- ✅ Despliegues ilimitados

### Plan Starter ($7/mes)
- ✅ Sin cold starts
- ✅ 512 MB RAM
- ✅ 0.5 CPU
- ✅ Todo lo del plan gratuito

## Migración desde Netlify

Si ya tienes el sitio en Netlify y quieres migrar:

1. ✅ Crea el servicio en Render (pasos arriba)
2. ✅ Configura las mismas variables de entorno
3. ✅ Espera a que se despliegue
4. ✅ Prueba que todo funcione
5. ✅ Actualiza el DNS de tu dominio (si tienes)
6. ✅ Opcionalmente, elimina el sitio de Netlify

**Ventaja:** Puedes tener ambos activos mientras pruebas.

## Recursos Adicionales

- [Documentación de Render](https://render.com/docs)
- [Next.js en Render](https://render.com/docs/deploy-nextjs-app)
- [Variables de Entorno](https://render.com/docs/environment-variables)
- [Dominios Personalizados](https://render.com/docs/custom-domains)

## Soporte

Si tienes problemas:
1. Revisa los logs en Render
2. Consulta la documentación
3. Contacta el soporte de Render (muy responsivo)
4. Comunidad en Discord: https://render.com/discord
