# Alagappa Tools - Build Instructions

## Development

### Run in Development Mode
```bash
npm run tauri:dev
```

This will:
- Start the Vite dev server on port 5173
- Compile and run the Tauri app
- Enable hot reload for frontend changes

## Building for Production

### Build for Current Platform
```bash
npm run tauri:build
```

### Build for Specific Platforms

#### macOS (Intel)
```bash
npm run tauri:build:mac
```

#### macOS (Apple Silicon / ARM)
```bash
npm run tauri:build:mac-arm
```

#### Windows
```bash
npm run tauri:build:win
```

#### Linux
```bash
npm run tauri:build:linux
```

## Output Location

Built applications will be in:
- **macOS**: `src-tauri/target/[target]/release/bundle/`
- **Windows**: `src-tauri/target/[target]/release/bundle/`
- **Linux**: `src-tauri/target/[target]/release/bundle/`

## Requirements

### For macOS builds:
- Xcode Command Line Tools
- macOS SDK

### For Windows builds:
- Microsoft Visual C++ Build Tools
- Windows SDK

### For Linux builds:
- GCC
- pkg-config
- libwebkit2gtk-4.0-dev
- libssl-dev
- libgtk-3-dev
- libayatana-appindicator3-dev
- librsvg2-dev

## Cross-Platform Building

To build for platforms other than your current OS, you may need:
- Docker (for Linux builds on macOS/Windows)
- Cross-compilation toolchains
- Or use CI/CD services like GitHub Actions

## Notes

- First build will take longer as it compiles Rust dependencies
- Subsequent builds are faster due to incremental compilation
- The app uses Tauri v2 with React 19 and TypeScript
