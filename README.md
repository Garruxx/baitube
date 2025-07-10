# Baitube 🎵
[Versión en Español](README.es.md)

A robust WhatsApp bot for downloading YouTube songs and videos. Built with Baileys and ytdl-core, featuring a web-based QR code login system for seamless authentication.

## Features

- 🤖 **WhatsApp Bot Integration**: Connect your WhatsApp number to download YouTube content
- 🎵 **Music Search**: Search for songs using natural language queries
- 📱 **Multiple Download Formats**: Audio, video, and MP3 file downloads
- 🖼️ **Dynamic Music Cards**: Auto-generated visual cards for search results
- 🌐 **Web QR Login**: Modern web interface for WhatsApp authentication
- 🔄 **Auto-reconnection**: Robust connection handling with automatic session recovery
- 💾 **Local Database**: Persistent storage for download tracking and session management
- 🎨 **Visual Feedback**: Emoji reactions and status indicators

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [External Dependencies](#external-dependencies)
- [File Structure](#file-structure)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before installing Baitube, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn** package manager
- **FFmpeg** (for audio processing)
- **yt-katze** service running (see [External Dependencies](#external-dependencies))

### Installing FFmpeg

#### macOS (using Homebrew)
```bash
brew install ffmpeg
```

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install ffmpeg
```

#### Windows
Download from [FFmpeg official website](https://ffmpeg.org/download.html) and add to PATH.

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Garruxx/baitube.git
cd baitube
```

2. **Install dependencies:**
```bash
# Using npm
npm install

# Using yarn
yarn install
```

3. **Set up environment variables:**
```bash
cp .env.template .env
```

4. **Configure your environment** (see [Configuration](#configuration))

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Required: GraphQL endpoint for YouTube search
YT_KATZE_URL=http://localhost:2222/graphql

# Optional: QR code display options
PRINT_QR_ON_TERMINAL=false
PRINT_QR_ON_WEB=true
```

### Configuration Details

- **YT_KATZE_URL**: URL of the yt-katze GraphQL service for YouTube searches
- **PRINT_QR_ON_TERMINAL**: Display QR code in terminal (default: false)
- **PRINT_QR_ON_WEB**: Display QR code in web browser (default: true)

## Usage

### Starting the Bot

```bash
# Start the application
npm start

# Or using yarn
yarn start
```

### First-time Setup

1. **Run the application:**
```bash
npm start
```

2. **QR Code Authentication:**
   - If `PRINT_QR_ON_WEB=true`, a browser window will open automatically
   - Scan the QR code with your WhatsApp mobile app
   - The web page will automatically close after successful connection

3. **Bot is Ready:**
   - Your WhatsApp number is now connected as a bot
   - Start sending commands to search and download content

### Web QR Interface

The web interface provides:
- **Real-time QR updates**: Automatically refreshes when new QR codes are generated
- **Connection status**: Shows when WhatsApp is successfully connected
- **Auto-close**: Closes automatically after successful authentication
- **Manual close**: Button to close the window manually

## Commands

### Music Search

Search for songs using the `!yt` command:

```
!yt Taylor Swift 22
!yt Bad Bunny Titi Me Pregunto
!yt The Weeknd Blinding Lights
```

### Visual Music Cards

Add `-t` flag to get visual music cards:

```
!yt Taylor Swift 22 -t
```

### Help Command

Get help information:

```
!!yt help
!!yt -h
!!yt ayuda
!!yt info
```

### Download Options

React to search results with emojis:

- 👍 **Audio**: Download as audio file (fastest)
- ❤️ **Video**: Download as video file
- 😂 **MP3**: Download as MP3 file (takes longer)

### Status Indicators

- 🔎 **Searching**: Bot is searching for content
- ⏳ **Processing**: Download is being processed
- 📩 **Completed**: Download completed successfully
- 😭 **Error**: Something went wrong

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `YT_KATZE_URL` | Yes | - | GraphQL endpoint for YouTube searches |
| `PRINT_QR_ON_TERMINAL` | No | `false` | Display QR code in terminal |
| `PRINT_QR_ON_WEB` | No | `true` | Display QR code in web browser |

## External Dependencies

### yt-katze Service

Baitube requires the [yt-katze](https://github.com/Garruxx/yt-katze) service to be running for YouTube searches. This is a Go-based GraphQL service that provides YouTube search functionality.

#### Option 1: Download Pre-built Binary (Recommended)

1. **Download the latest release:**
   - Go to [yt-katze releases](https://github.com/Garruxx/yt-katze/releases/tag/1.0.0)
   - Download the appropriate binary for your system:
     - `yt-katze-darwin-amd64` (macOS Intel)
     - `yt-katze-darwin-arm64` (macOS Apple Silicon)
     - `yt-katze-linux-amd64` (Linux)
     - `yt-katze-windows-amd64.exe` (Windows)

2. **Make it executable (macOS/Linux):**
```bash
chmod +x yt-katze-*
```

3. **Run the service:**
```bash
# macOS/Linux
./yt-katze-darwin-amd64

# Windows
yt-katze-windows-amd64.exe
```

#### Option 2: Build from Source

If you have Go installed, you can build from source:

1. **Clone the repository:**
```bash
git clone https://github.com/Garruxx/yt-katze.git
cd yt-katze
```

2. **Build the project:**
```bash
go build -o yt-katze
```

3. **Run the service:**
```bash
./yt-katze
```

#### Verify Installation

4. **Verify it's running:**
   - Service should be available at `http://localhost:7473/graphql`
   - You can test it by opening this URL in your browser
   - Update `YT_KATZE_URL` in your `.env` file if using a different URL

### System Dependencies

- **Node.js**: Runtime environment
- **FFmpeg**: Audio/video processing
- **Sharp**: Image processing (installed automatically)

## File Structure

```
baitube/
├── src/
│   ├── main.ts              # Application entry point
│   ├── whatsapp/            # WhatsApp connection handling
│   │   └── whatsapp.ts      # Core WhatsApp functionality
│   ├── www/                 # Web interface for QR codes
│   │   ├── index.html       # QR code display page
│   │   ├── server.ts        # Web server
│   │   └── api.ts           # API endpoints
│   ├── browser/             # YouTube search and templates
│   │   ├── yt-browser.ts    # YouTube search handler
│   │   └── templates/       # Music card templates
│   ├── downloader/          # Download functionality
│   │   ├── downloader.ts    # Download manager
│   │   └── utils/           # Download utilities
│   ├── logger/              # Logging system
│   └── utils/               # Shared utilities
├── logs/                    # Application logs
├── tokens/                  # WhatsApp session tokens
├── temp/                    # Temporary download files
├── nedb/                    # Local database
├── .env                     # Environment configuration
├── .env.template            # Environment template
└── package.json             # Dependencies and scripts
```

## Troubleshooting

### Common Issues

#### QR Code Not Displaying

**Problem**: QR code doesn't appear in browser or terminal.

**Solutions**:
1. Check `.env` configuration:
   ```env
   PRINT_QR_ON_WEB=true
   ```
2. Ensure port 3000 is not in use
3. Check firewall settings
4. Try manually opening `http://localhost:3000`

#### Connection Issues

**Problem**: WhatsApp connection fails or disconnects frequently.

**Solutions**:
1. Clear session tokens: Delete `tokens/` directory
2. Restart the application
3. Check internet connection
4. Ensure WhatsApp is not logged in on web in another browser

#### yt-katze Service Not Available

**Problem**: YouTube searches fail with GraphQL errors.

**Solutions**:
1. Verify yt-katze is running: `curl http://localhost:7473/graphql`
2. Check `YT_KATZE_URL` in `.env`
3. Restart yt-katze service
4. Check yt-katze logs for errors

#### Download Failures

**Problem**: Downloads fail or time out.

**Solutions**:
1. Check internet connection
2. Verify FFmpeg installation: `ffmpeg -version`
3. Clear temporary files: Delete `temp/` directory
4. Check available disk space

#### Session Expired

**Problem**: Bot stops responding after some time.

**Solutions**:
1. Bot automatically handles session renewal
2. If persistent, manually delete `tokens/` directory
3. Restart the application
4. Re-scan QR code

### Debug Mode

Enable detailed logging by checking the `logs/` directory:

- `debug.log`: Debug information
- `error.log`: Error messages
- `info.log`: General information
- `warn.log`: Warning messages

### Performance Tips

1. **Regular cleanup**: The bot automatically cleans temporary files every 22 hours
2. **Database maintenance**: NeDB automatically removes expired records
3. **Memory usage**: Restart the bot weekly for optimal performance
4. **Network**: Ensure stable internet connection for best results

## API Reference

### WhatsApp Methods

- `start()`: Initialize WhatsApp connection
- `clearSession()`: Clear authentication tokens
- `writing(id)`: Show typing indicator
- `recordering(id)`: Show recording indicator
- `normalState(id)`: Clear presence indicators

### Download Methods

- `saveMessageSongData(id, song)`: Save song data for download
- `sendAudio(to, url, info)`: Send audio file
- `sendVideo(to, url, info)`: Send video file
- `sendSong(to, url, info)`: Send MP3 file

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

### Development Setup

```bash
# Install dependencies
npm install

# Run
npm run start
```

## Credits

This project is built on top of excellent open-source libraries:

- [Baileys](https://github.com/WhiskeySockets/Baileys) - WhatsApp Web API
- [ytdl-core](https://github.com/distube/ytdl-core) - YouTube downloader
- [yt-katze](https://github.com/Garruxx/yt-katze) - YouTube GraphQL API

Special thanks to all contributors and the open-source community.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This software is for educational purposes only. Users are responsible for complying with YouTube's Terms of Service and local laws regarding content downloading. Use at your own risk.

---

**Created by Jhon Guerrero (Garrux)** 👋🏻

For issues and support, please visit the [GitHub repository](https://github.com/Garruxx/baitube).
