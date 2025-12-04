# FFmpeg Video Conversion Setup

Your Tauri app now has FFmpeg integration for video conversions in the Rust backend!

## Prerequisites

FFmpeg must be installed on the user's system. The app will check for FFmpeg availability before attempting conversions.

### Installing FFmpeg

#### macOS
```bash
brew install ffmpeg
```

#### Windows
Download from [FFmpeg Windows builds](https://www.gyan.dev/ffmpeg/builds/) or use Chocolatey:
```bash
choco install ffmpeg
```

#### Linux
```bash
# Ubuntu/Debian
sudo apt update && sudo apt install ffmpeg

# Fedora
sudo dnf install ffmpeg

# Arch
sudo pacman -S ffmpeg
```

## Available Tauri Commands

### 1. Check FFmpeg Availability
```typescript
import { invoke } from "@tauri-apps/api/core";

const result = await invoke<string>("check_ffmpeg");
console.log(result); // "FFmpeg available: ffmpeg version..."
```

### 2. Get Video Information
```typescript
const videoInfo = await invoke<Record<string, any>>("get_video_information", {
  input_path: "/path/to/video.mp4"
});

console.log(videoInfo); // Contains format, streams, duration, etc.
```

### 3. Convert Video Format
```typescript
import { invoke } from "@tauri-apps/api/core";

await invoke<string>("convert_video_format", {
  options: {
    input_path: "/path/to/input.mp4",
    output_path: "/path/to/output.avi",
    output_format: "avi", // mp4, avi, mov, mkv, webm
    quality: "medium", // high, medium, low
    resolution: "720p", // 1080p, 720p, 480p, 360p, or "1920x1080"
    bitrate: "2000k", // Optional
    frame_rate: 30.0 // Optional
  }
});
```

### 4. Compress Video
```typescript
await invoke<string>("compress_video_file", {
  input_path: "/path/to/input.mp4",
  output_path: "/path/to/output_compressed.mp4",
  target_size_mb: 50.0 // Optional target size in MB
});
```

### 5. Extract Audio
```typescript
await invoke<string>("extract_audio_from_video", {
  input_path: "/path/to/video.mp4",
  output_path: "/path/to/audio.mp3",
  audio_format: "mp3" // mp3, aac, wav, flac
});
```

## Supported Formats

### Video Formats
- **MP4** (H.264) - Most common, best compatibility
- **AVI** - Legacy format
- **MOV** (QuickTime)
- **MKV** - Container format
- **WebM** - Web optimized

### Audio Formats
- **MP3** - Most compatible
- **AAC** - Better quality, smaller size
- **WAV** - Uncompressed
- **FLAC** - Lossless compression

## Quality Presets

- **High**: CRF 18 (best quality, larger files)
- **Medium**: CRF 23 (balanced, default)
- **Low**: CRF 28 (smaller files, lower quality)

## Resolution Presets

- **1080p**: 1920x1080
- **720p**: 1280x720
- **480p**: 854x480
- **360p**: 640x360
- **Custom**: "1920x1080" format

## Example: Complete Video Conversion Component

```typescript
import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function VideoConverter() {
  const [inputFile, setInputFile] = useState("");
  const [outputFile, setOutputFile] = useState("");
  const [format, setFormat] = useState("mp4");
  const [quality, setQuality] = useState("medium");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
    setConverting(true);
    setError(null);
    
    try {
      // Check FFmpeg first
      await invoke<string>("check_ffmpeg");
      
      // Convert video
      const result = await invoke<string>("convert_video_format", {
        options: {
          input_path: inputFile,
          output_path: outputFile,
          output_format: format,
          quality: quality,
        }
      });
      
      console.log("Success:", result);
      alert("Video converted successfully!");
    } catch (err) {
      setError(err as string);
      console.error("Conversion failed:", err);
    } finally {
      setConverting(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Input file path"
        value={inputFile}
        onChange={(e) => setInputFile(e.target.value)}
      />
      <input
        type="text"
        placeholder="Output file path"
        value={outputFile}
        onChange={(e) => setOutputFile(e.target.value)}
      />
      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="mp4">MP4</option>
        <option value="avi">AVI</option>
        <option value="mov">MOV</option>
        <option value="mkv">MKV</option>
        <option value="webm">WebM</option>
      </select>
      <select value={quality} onChange={(e) => setQuality(e.target.value)}>
        <option value="high">High Quality</option>
        <option value="medium">Medium Quality</option>
        <option value="low">Low Quality</option>
      </select>
      <button onClick={handleConvert} disabled={converting}>
        {converting ? "Converting..." : "Convert"}
      </button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
```

## Notes

- FFmpeg must be installed on the user's system
- File paths should be absolute paths
- Large video files may take significant time to convert
- The conversion happens synchronously - consider adding progress tracking in the future
- All conversions overwrite existing output files (`-y` flag)

## Future Enhancements

- Progress tracking with FFmpeg stderr parsing
- Batch conversion support
- Video trimming/cutting
- Watermark addition
- Subtitle embedding
- Custom codec options

