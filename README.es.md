# Baitube 🎵
[English Version](README.md)
Un bot robusto de WhatsApp para descargar canciones y videos de YouTube. Construido con Baileys y ytdl-core, incluye un sistema de inicio de sesión QR basado en web para una autenticación sin problemas.

## Características

- 🤖 **Integración con WhatsApp**: Conecta tu número de WhatsApp para descargar contenido de YouTube
- 🎵 **Búsqueda de Música**: Busca canciones usando consultas en lenguaje natural
- 📱 **Múltiples Formatos de Descarga**: Descargas de audio, video y archivos MP3
- 🖼️ **Tarjetas Musicales Dinámicas**: Tarjetas visuales autogeneradas para los resultados de búsqueda
- 🌐 **Inicio de Sesión QR Web**: Interfaz web moderna para autenticación de WhatsApp
- 🔄 **Auto-reconexión**: Manejo robusto de conexiones con recuperación automática de sesión
- 💾 **Base de Datos Local**: Almacenamiento persistente para seguimiento de descargas y gestión de sesiones
- 🎨 **Retroalimentación Visual**: Reacciones emoji e indicadores de estado

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Uso](#uso)
- [Comandos](#comandos)
- [Variables de Entorno](#variables-de-entorno)
- [Dependencias Externas](#dependencias-externas)
- [Estructura de Archivos](#estructura-de-archivos)
- [Solución de Problemas](#solución-de-problemas)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Requisitos Previos

Antes de instalar Baitube, asegúrate de tener:

- **Node.js** (v18 o superior)
- **npm** o **yarn** como gestor de paquetes
- **FFmpeg** (para procesamiento de audio)
- **Servicio yt-katze** ejecutándose (ver [Dependencias Externas](#dependencias-externas))

### Instalando FFmpeg

#### macOS (usando Homebrew)
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows
Descarga desde el [sitio web oficial de FFmpeg](https://ffmpeg.org/download.html) y agrégalo al PATH.

## Instalación

1. **Clona el repositorio:**
```bash
git clone https://github.com/Garruxx/baitube.git
cd baitube
```

2. **Instala las dependencias:**
```bash
# Usando npm
npm install

# Usando yarn
yarn install
```

3. **Configura las variables de entorno:**
```bash
cp .env.template .env
```

4. **Configura tu entorno** (ver [Configuración](#configuración))

## Configuración

### Variables de Entorno

Crea un archivo `.env` en el directorio raíz con las siguientes variables:

```env
# Requerido: Endpoint GraphQL para búsqueda de YouTube
YT_KATZE_URL=http://localhost:7473/graphql

# Opcional: Opciones de visualización del código QR
PRINT_QR_ON_TERMINAL=false
PRINT_QR_ON_WEB=true
```

### Detalles de Configuración

- **YT_KATZE_URL**: URL del servicio GraphQL yt-katze para búsquedas de YouTube
- **PRINT_QR_ON_TERMINAL**: Mostrar código QR en terminal (predeterminado: false)
- **PRINT_QR_ON_WEB**: Mostrar código QR en navegador web (predeterminado: true)

## Uso

### Iniciando el Bot

```bash
# Inicia la aplicación
npm start

# O usando yarn
yarn start
```

### Configuración Inicial

1. **Ejecuta la aplicación:**
```bash
npm start
```

2. **Autenticación con Código QR:**
   - Si `PRINT_QR_ON_WEB=true`, se abrirá automáticamente una ventana del navegador
   - Escanea el código QR con tu aplicación móvil de WhatsApp
   - La página web se cerrará automáticamente después de una conexión exitosa

3. **Bot Listo:**
   - Tu número de WhatsApp ahora está conectado como bot
   - Comienza a enviar comandos para buscar y descargar contenido

### Interfaz Web QR

La interfaz web proporciona:
- **Actualizaciones QR en tiempo real**: Se actualiza automáticamente cuando se generan nuevos códigos QR
- **Estado de conexión**: Muestra cuando WhatsApp está conectado exitosamente
- **Cierre automático**: Se cierra automáticamente después de la autenticación exitosa
- **Cierre manual**: Botón para cerrar la ventana manualmente

## Comandos

### Búsqueda de Música

Busca canciones usando el comando `!yt`:

```
!yt Taylor Swift 22
!yt Bad Bunny Titi Me Pregunto
!yt The Weeknd Blinding Lights
```

### Tarjetas Musicales Visuales

Agrega la bandera `-t` para obtener tarjetas musicales visuales:

```
!yt Taylor Swift 22 -t
```

### Comando de Ayuda

Obtén información de ayuda:

```
!!yt help
!!yt -h
!!yt ayuda
!!yt info
```

### Opciones de Descarga

Reacciona a los resultados de búsqueda con emojis:

- 👍 **Audio**: Descargar como archivo de audio (más rápido)
- ❤️ **Video**: Descargar como archivo de video
- 😂 **MP3**: Descargar como archivo MP3 (toma más tiempo)

### Indicadores de Estado

- 🔎 **Buscando**: El bot está buscando contenido
- ⏳ **Procesando**: La descarga está siendo procesada
- 📩 **Completado**: Descarga completada exitosamente
- 😭 **Error**: Algo salió mal

## Variables de Entorno

| Variable | Requerido | Predeterminado | Descripción |
|----------|-----------|----------------|-------------|
| `YT_KATZE_URL` | Sí | - | Endpoint GraphQL para búsquedas de YouTube |
| `PRINT_QR_ON_TERMINAL` | No | `false` | Mostrar código QR en terminal |
| `PRINT_QR_ON_WEB` | No | `true` | Mostrar código QR en navegador web |

## Dependencias Externas

### Servicio yt-katze

Baitube requiere que el servicio [yt-katze](https://github.com/Garruxx/yt-katze) esté ejecutándose para las búsquedas de YouTube. Este es un servicio GraphQL basado en Go que proporciona funcionalidad de búsqueda de YouTube.

#### Opción 1: Descargar Binario Pre-compilado (Recomendado)

1. **Descarga la última versión:**
   - Ve a [yt-katze releases](https://github.com/Garruxx/yt-katze/releases/tag/1.0.0)
   - Descarga el binario apropiado para tu sistema:
     - `yt-katze-darwin-amd64` (macOS Intel)
     - `yt-katze-darwin-arm64` (macOS Apple Silicon)
     - `yt-katze-linux-amd64` (Linux)
     - `yt-katze-windows-amd64.exe` (Windows)

2. **Hazlo ejecutable (macOS/Linux):**
```bash
chmod +x yt-katze-*
```

3. **Ejecuta el servicio:**
```bash
# macOS/Linux
./yt-katze-darwin-amd64

# Windows
yt-katze-windows-amd64.exe
```

#### Opción 2: Compilar desde el Código Fuente

Si tienes Go instalado, puedes compilar desde el código fuente:

1. **Clona el repositorio:**
```bash
git clone https://github.com/Garruxx/yt-katze.git
cd yt-katze
```

2. **Compila el proyecto:**
```bash
go build -o yt-katze
```

3. **Ejecuta el servicio:**
```bash
./yt-katze
```

#### Verificar Instalación

4. **Verifica que esté ejecutándose:**
   - El servicio debería estar disponible en `http://localhost:7473/graphql`
   - Puedes probarlo abriendo esta URL en tu navegador
   - Actualiza `YT_KATZE_URL` en tu archivo `.env` si usas una URL diferente

### Dependencias del Sistema

- **Node.js**: Entorno de ejecución
- **FFmpeg**: Procesamiento de audio/video
- **Sharp**: Procesamiento de imágenes (se instala automáticamente)

## Estructura de Archivos

```
baitube/
├── src/
│   ├── main.ts              # Punto de entrada de la aplicación
│   ├── whatsapp/            # Manejo de conexión WhatsApp
│   │   └── whatsapp.ts      # Funcionalidad core de WhatsApp
│   ├── www/                 # Interfaz web para códigos QR
│   │   ├── index.html       # Página de visualización de código QR
│   │   ├── server.ts        # Servidor web
│   │   └── api.ts           # Endpoints API
│   ├── browser/             # Búsqueda de YouTube y plantillas
│   │   ├── yt-browser.ts    # Manejador de búsqueda de YouTube
│   │   └── templates/       # Plantillas de tarjetas musicales
│   ├── downloader/          # Funcionalidad de descarga
│   │   ├── downloader.ts    # Gestor de descargas
│   │   └── utils/           # Utilidades de descarga
│   ├── logger/              # Sistema de logging
│   └── utils/               # Utilidades compartidas
├── logs/                    # Logs de la aplicación
├── tokens/                  # Tokens de sesión de WhatsApp
├── temp/                    # Archivos temporales de descarga
├── nedb/                    # Base de datos local
├── .env                     # Configuración de entorno
├── .env.template            # Plantilla de entorno
└── package.json             # Dependencias y scripts
```

## Solución de Problemas

### Problemas Comunes

#### Código QR No Se Muestra

**Problema**: El código QR no aparece en el navegador o terminal.

**Soluciones**:
1. Verifica la configuración `.env`:
   ```env
   PRINT_QR_ON_WEB=true
   ```
2. Asegúrate de que el puerto 3000 no esté en uso
3. Verifica la configuración del firewall
4. Intenta abrir manualmente `http://localhost:3000`

#### Problemas de Conexión

**Problema**: La conexión de WhatsApp falla o se desconecta frecuentemente.

**Soluciones**:
1. Limpia los tokens de sesión: Elimina el directorio `tokens/`
2. Reinicia la aplicación
3. Verifica la conexión a internet
4. Asegúrate de que WhatsApp no esté conectado en web en otro navegador

#### Servicio yt-katze No Disponible

**Problema**: Las búsquedas de YouTube fallan con errores de GraphQL.

**Soluciones**:
1. Verifica que yt-katze esté ejecutándose: `curl http://localhost:7473/graphql`
2. Verifica `YT_KATZE_URL` en `.env`
3. Reinicia el servicio yt-katze
4. Verifica los logs de yt-katze para errores

#### Fallos de Descarga

**Problema**: Las descargas fallan o se agotan.

**Soluciones**:
1. Verifica la conexión a internet
2. Verifica la instalación de FFmpeg: `ffmpeg -version`
3. Limpia archivos temporales: Elimina el directorio `temp/`
4. Verifica el espacio disponible en disco

#### Sesión Expirada

**Problema**: El bot deja de responder después de un tiempo.

**Soluciones**:
1. El bot maneja automáticamente la renovación de sesión
2. Si persiste, elimina manualmente el directorio `tokens/`
3. Reinicia la aplicación
4. Vuelve a escanear el código QR

### Modo Debug

Habilita el logging detallado verificando el directorio `logs/`:

- `debug.log`: Información de debug
- `error.log`: Mensajes de error
- `info.log`: Información general
- `warn.log`: Mensajes de advertencia

### Consejos de Rendimiento

1. **Limpieza regular**: El bot limpia automáticamente los archivos temporales cada 22 horas
2. **Mantenimiento de base de datos**: NeDB elimina automáticamente los registros expirados
3. **Uso de memoria**: Reinicia el bot semanalmente para un rendimiento óptimo
4. **Red**: Asegúrate de tener una conexión a internet estable para mejores resultados

## Referencia API

### Métodos WhatsApp

- `start()`: Inicializar conexión WhatsApp
- `clearSession()`: Limpiar tokens de autenticación
- `writing(id)`: Mostrar indicador de escritura
- `recordering(id)`: Mostrar indicador de grabación
- `normalState(id)`: Limpiar indicadores de presencia

### Métodos de Descarga

- `saveMessageSongData(id, song)`: Guardar datos de canción para descarga
- `sendAudio(to, url, info)`: Enviar archivo de audio
- `sendVideo(to, url, info)`: Enviar archivo de video
- `sendSong(to, url, info)`: Enviar archivo MP3

## Contribuir

1. Haz fork del repositorio
2. Crea una rama de característica: `git checkout -b feature/nueva-caracteristica`
3. Confirma los cambios: `git commit -am 'Agregar nueva característica'`
4. Sube a la rama: `git push origin feature/nueva-caracteristica`
5. Envía un pull request

### Configuración de Desarrollo

```bash
# Instala dependencias
npm install

# Ejecuta en modo desarrollo
npm start
```

## Créditos

Este proyecto está construido sobre excelentes bibliotecas de código abierto:

- [Baileys](https://github.com/WhiskeySockets/Baileys) - API Web de WhatsApp
- [ytdl-core](https://github.com/distube/ytdl-core) - Descargador de YouTube
- [yt-katze](https://github.com/Garruxx/yt-katze) - API GraphQL de YouTube

Agradecimientos especiales a todos los contribuyentes y la comunidad de código abierto.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

## Descargo de Responsabilidad

Este software es solo para fines educativos. Los usuarios son responsables de cumplir con los Términos de Servicio de YouTube y las leyes locales sobre descarga de contenido. Úsalo bajo tu propio riesgo.

---

**Creado por Jhon Guerrero (Garrux)** 👋🏻

Para problemas y soporte, visita el [repositorio de GitHub](https://github.com/Garruxx/baitube).
