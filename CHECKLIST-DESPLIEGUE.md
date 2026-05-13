# ✅ Checklist de Despliegue en Netlify

## Antes de Desplegar

- [ ] Proyecto funciona correctamente en local (`npm run dev`)
- [ ] Build funciona sin errores (`npm run build`)
- [ ] Variables de entorno documentadas en `.env.example`
- [ ] Código subido a GitHub

## Configuración en Netlify

- [ ] Cuenta creada en [Netlify](https://app.netlify.com)
- [ ] Repositorio conectado
- [ ] Build settings configurados:
  - Build command: `npm run build`
  - Publish directory: `.next`
  - Node version: 20

## Variables de Entorno en Netlify

Copia estas variables desde tu archivo `.env` local:

- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `NEXT_PUBLIC_SITE_URL` (usar URL de Netlify)
- [ ] `NEXT_PUBLIC_SITE_NAME`
- [ ] `NEXT_PUBLIC_SITE_DESCRIPTION`
- [ ] `ADMIN_EMAIL`

## Configuración en Supabase

- [ ] URL de Netlify agregada en Authentication → URL Configuration
- [ ] Redirect URLs configuradas:
  - `https://tu-sitio.netlify.app`
  - `https://tu-sitio.netlify.app/auth/callback`
- [ ] Buckets de Storage configurados como públicos (si aplica)
- [ ] RLS (Row Level Security) configurado correctamente

## Después del Despliegue

- [ ] Sitio carga correctamente
- [ ] Login de admin funciona
- [ ] Crear noticia funciona
- [ ] Subir imágenes funciona
- [ ] Videos reproducen correctamente
- [ ] Canales en vivo funcionan
- [ ] Búsqueda funciona
- [ ] Responsive en móvil funciona

## Opcional

- [ ] Dominio personalizado configurado
- [ ] SSL/HTTPS activo (automático en Netlify)
- [ ] Analytics configurado
- [ ] Monitoreo de errores configurado

## Comandos Rápidos

```bash
# Verificar que build funciona
npm run build

# Subir a GitHub
git add .
git commit -m "Preparar para despliegue"
git push origin main

# Con Netlify CLI
netlify login
netlify init
netlify deploy --prod
```

## Problemas Comunes

### Build falla
1. Verifica que `npm run build` funcione localmente
2. Revisa los logs en Netlify
3. Verifica que todas las variables de entorno estén configuradas

### Imágenes no cargan
1. Verifica configuración de Supabase Storage
2. Verifica que los buckets sean públicos
3. Verifica `next.config.js` → `remotePatterns`

### Login no funciona
1. Verifica variables de entorno de Supabase
2. Verifica URLs en Supabase Authentication
3. Revisa la consola del navegador para errores

### Videos no reproducen
1. Verifica que `hls.js` esté instalado
2. Revisa errores en consola del navegador
3. Verifica que las URLs de video sean accesibles

## Soporte

- [Documentación Netlify](https://docs.netlify.com)
- [Documentación Next.js](https://nextjs.org/docs)
- [Documentación Supabase](https://supabase.com/docs)
