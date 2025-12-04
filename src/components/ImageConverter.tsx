export default function ImageConverter() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Image Converter</h2>
        <p className="text-sm text-gray-600 mt-1">Convert images between all popular formats</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Supported Formats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Common Formats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Raster Formats</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• JPEG / JPG</li>
              <li>• PNG</li>
              <li>• GIF</li>
              <li>• BMP</li>
              <li>• TIFF / TIF</li>
              <li>• WEBP</li>
              <li>• ICO</li>
              <li>• HEIC / HEIF</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Vector Formats</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• SVG</li>
              <li>• EPS</li>
              <li>• AI (Adobe)</li>
              <li>• PDF</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Raw Formats</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• RAW</li>
              <li>• CR2 (Canon)</li>
              <li>• NEF (Nikon)</li>
              <li>• ARW (Sony)</li>
              <li>• DNG</li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Other Formats</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• AVIF</li>
              <li>• APNG</li>
              <li>• PCX</li>
              <li>• PSD</li>
            </ul>
          </div>
        </div>

        {/* Conversion Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Batch Converter */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Batch Conversion</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Convert multiple images at once. Select a folder or drag and drop multiple files.
            </p>
            <button
              className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              type="button"
            >
              Select Images
            </button>
          </div>

          {/* Resize & Optimize */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Resize & Optimize</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Resize images, compress file size, and optimize for web or print.
            </p>
            <button
              className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              type="button"
            >
              Optimize Images
            </button>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">Coming Soon</h4>
              <p className="text-sm text-blue-700">
                Image conversion features including format conversion, batch processing, resizing, compression, and format optimization are currently under development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

