import VideoConverterHeader from "./video/VideoConverterHeader";
import FormatCard from "./video/FormatCard";
import ConversionToolCard from "./video/ConversionToolCard";
import AdvancedFeaturesList from "./video/AdvancedFeaturesList";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Video, FolderOpen, Gauge, Info } from "lucide-react";

const COMMON_FORMATS = [
  "MP4 (H.264, H.265)",
  "AVI",
  "MOV (QuickTime)",
  "MKV",
  "WMV",
  "FLV",
  "WebM",
];

const HD_FORMATS = [
  "MP4 (4K UHD)",
  "HEVC (H.265)",
  "AV1",
  "VP9",
  "ProRes",
  "DNxHD",
];

const MOBILE_FORMATS = [
  "3GP",
  "M4V",
  "OGV",
  "TS / MTS",
  "VOB",
  "ASF",
];

const ADVANCED_FEATURES = [
  { label: "Custom resolution" },
  { label: "Bitrate control" },
  { label: "Frame rate adjustment" },
  { label: "Extract audio" },
  { label: "Trim & cut" },
  { label: "Merge videos" },
  { label: "Add subtitles" },
  { label: "Watermark" },
];

export default function VideoConverter() {
  const handleFormatConvert = () => {
    console.log("Format conversion clicked");
  };

  const handleBatchConvert = () => {
    console.log("Batch conversion clicked");
  };

  const handleCompress = () => {
    console.log("Compress clicked");
  };

  return (
    <div className="h-full flex flex-col">
      <VideoConverterHeader />

      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormatCard title="Common Formats" formats={COMMON_FORMATS} />
          <FormatCard title="HD/4K Formats" formats={HD_FORMATS} />
          <FormatCard title="Mobile & Web" formats={MOBILE_FORMATS} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ConversionToolCard
            title="Format Converter"
            description="Convert videos between different formats (MP4, AVI, MOV, MKV, etc.)"
            icon={Video}
            iconClassName="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600"
            buttonLabel="Convert Video"
            buttonVariant="destructive"
            onButtonClick={handleFormatConvert}
          />
          <ConversionToolCard
            title="Batch Conversion"
            description="Convert multiple videos at once with the same settings."
            icon={FolderOpen}
            iconClassName="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600"
            buttonLabel="Select Videos"
            buttonVariant="default"
            onButtonClick={handleBatchConvert}
          />
          <ConversionToolCard
            title="Compress & Optimize"
            description="Reduce file size while maintaining quality. Perfect for sharing or uploading."
            icon={Gauge}
            iconClassName="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600"
            buttonLabel="Compress Video"
            buttonVariant="default"
            onButtonClick={handleCompress}
          />
        </div>

        <AdvancedFeaturesList features={ADVANCED_FEATURES} />

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Coming Soon</AlertTitle>
          <AlertDescription>
            Video conversion features including format conversion, batch processing,
            compression, trimming, merging, and advanced encoding options are currently
            under development.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
