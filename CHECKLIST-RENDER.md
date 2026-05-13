# ✅ Checklist Rápido - Despliegue en Render

## Antes de empezar

- [ ] Código funcionando en local
- [ ] Cambios subidos a GitHub
- [ ] Credenciales de Supabase a mano

## Paso 1: Crear servicio en Render

1. [ ] Ir a https://render.com
2. [ ] Registrarse con GitHub
3. [ ] Click "New +" → "Web Service"
4. [ ] Conectar repositorio
5. [ ] Seleccionar `pagaina-noticia`

## Paso 2: Configuración

### Build Settings
- [ ] **Name:** `noticias-live`
- [ ] **Branch:** `main`
- [ ] **Build Command:** `npm install && npm run build`
- [ ] **Start Command:** `npm start`
- [ ] **Plan:** Free

### Variables de Entorno

Copiar desde tu `.env` local:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_SITE_URL=https://tu-app.onrender.com
NEXT_PUBLIC_SITE_NAME=Noticias Live
NEXT_PUBLIC_SITE_DESCRIPTION=Portal de noticias en vivo
ADMIN_EMAIL=
NODE_VERSION=20
```

- [ ] Todas las variables agregadas

## Paso 3: Desplegar

- [ ] Click "Create Web Service"
- [ ] Esperar 5-10 minutos
- [ ] Build completado sin errores
- [ ] Sitio accesible en la URL

## Paso 4: Configurar Supabase

1. [ ] Ir a Supabase Dashboard
2. [ ] Settings → Authentication → URL Configuration
3. [ ] Agregar URL de Render:
   - [ ] Site URL: `https://tu-app.onrender.com`
   - [ ] Redirect URL: `https://tu-app.onrender.com/auth/callback`
4. [ ] Guardar cambios

## Paso 5: Actualizar variable SITE_URL

- [ ] Copiar URL de Render
- [ ] En Render: Environment → Editar `NEXT_PUBLIC_SITE_URL`
- [ ] Pegar URL real
- [ ] Guardar (redeploy automático)

## Verificación

### Funcionalidades básicas
- [ ] Sitio carga correctamente
- [ ] Login de admin funciona
- [ ] Crear noticia funciona
- [ ] Subir imagen funciona
- [ ] Búsqueda funciona

### Canales y streaming
- [ ] Canales HTTPS reproducen
- [ ] Canales HTTP usan proxy (ver consola)
- [ ] Videos en noticias reproducen
- [ ] YouTube/Twitch funcionan

### Performance
- [ ] Sitio responsive en móvil
- [ ] Imágenes cargan correctamente
- [ ] No hay errores en consola

## Problemas Comunes

### ❌ Build falla
- [ ] Verificar que `npm run build` funcione en local
- [ ] Revisar logs de build en Render
- [ ] Verificar variables de entorno

### ❌ Sitio no carga
- [ ] Verificar logs en Render
- [ ] Verificar que todas las variables estén configuradas
- [ ] Esperar ~30s si es cold start

### ❌ Login no funciona
- [ ] Verificar URLs en Supabase
- [ ] Verificar variables de Supabase
- [ ] Limpiar cookies del navegador

### ❌ Imágenes no cargan
- [ ] Verificar URL de Supabase
- [ ] Verificar que buckets sean públicos
- [ ] Verificar `next.config.js`

### ❌ Streams no reproducen
- [ ] Abrir consola del navegador (F12)
- [ ] Verificar errores específicos
- [ ] Probar con canal de YouTube primero

## Comandos Útiles

### Redeploy manual
```bash
git commit --allow-empty -m "Redeploy"
git push origin main
```

### Ver logs
En Render dashboard → Logs

### Rollback
En Render dashboard → Deploys → Rollback

## Siguiente Paso

Una vez todo funcione:

- [ ] Probar con usuarios reales
- [ ] Configurar dominio personalizado (opcional)
- [ ] Considerar plan Starter si hay cold starts molestos
- [ ] Configurar monitoreo/analytics

## Notas

**Cold Start (Plan Gratuito):**
- Después de 15 min sin visitas, el sitio se "duerme"
- Primera visita tarda ~30s en cargar
- Visitas subsecuentes son instantáneas

**Solución:** Plan Starter ($7/mes) elimina cold starts

## Recursos

- 📖 Guía completa: `DESPLIEGUE-RENDER.md`
- 🌐 Dashboard: https://dashboard.render.com
- 📚 Docs: https://render.com/docs
- 💬 Discord: https://render.com/discord
