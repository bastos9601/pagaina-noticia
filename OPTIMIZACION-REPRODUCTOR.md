# Optimización del Reproductor HLS

## Problema Resuelto
El reproductor HLS se detenía constantemente durante la transmisión en vivo, causando una mala experiencia de usuario.

## Cambios Implementados

### 1. Bug Crítico Corregido
- **Problema**: Código inaccesible después de `return` statement que impedía la ejecución del timeout y limpieza
- **Solución**: Reorganizado el código para que el timeout y el detector de stalls se ejecuten correctamente antes del return

### 2. Configuración HLS Optimizada

#### Buffer Aumentado
- `maxBufferLength`: 60s → 90s
- `maxMaxBufferLength`: 120s → 180s
- `maxBufferSize`: 60MB → 90MB
- `maxBufferHole`: 0.5s → 0.3s (más estricto)

#### Reintentos Más Agresivos
- `manifestLoadingMaxRetry`: 10 → 20 intentos
- `levelLoadingMaxRetry`: 10 → 20 intentos
- `fragLoadingMaxRetry`: 10 → 20 intentos
- `retryDelay`: 1000ms → 500ms (más rápido)

#### Timeouts Reducidos
- `manifestLoadingTimeOut`: 10s → 8s
- `levelLoadingTimeOut`: 10s → 8s
- `fragLoadingTimeOut`: 20s → 15s
- `xhr.timeout`: 20s → 15s

#### Latencia Optimizada
- `liveSyncDurationCount`: 3 → 2 (más cerca del live)
- `highBufferWatchdogPeriod`: 2s → 1s (detección más rápida)

#### ABR Más Conservador
- `abrBandWidthFactor`: 0.95 → 0.8 (más conservador)
- `abrBandWidthUpFactor`: 0.7 → 0.6 (cambios más graduales)
- `abrMaxWithRealBitrate`: true → false (más estable)
- `startLevel`: -1 (auto-selección inicial)

### 3. Recuperación de Errores Mejorada

#### Errores de Red
- Recuperación inmediata sin delay (antes: 1 segundo)
- Reinicio automático del stream

#### Errores de Media
- Recuperación inmediata
- Segundo intento después de 500ms si falla el primero

#### Otros Errores Fatales
- Recarga completa del stream en 1 segundo (antes: 2 segundos)
- Configuración optimizada para el nuevo HLS instance

### 4. Detector de Stalls Mejorado
- Intervalo de verificación: 2s → 1.5s (más frecuente)
- Umbral de detección: 3 checks → 2 checks (más rápido)
- Reinicio automático del stream cuando se detecta

## Resultado Esperado
- Stream más estable con menos interrupciones
- Recuperación automática más rápida de errores
- Buffer más grande para absorber problemas de red
- Detección y corrección más rápida de stalls

## Notas Técnicas
- El reproductor ahora prioriza estabilidad sobre baja latencia
- Los reintentos son más frecuentes y rápidos
- El buffer más grande puede causar 1-2 segundos más de delay, pero mejora la estabilidad
- La recuperación automática es completamente transparente para el usuario
