export default function DocumentConverter() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-2xl font-bold text-gray-800">Document Converter</h2>
        <p className="text-sm text-gray-600 mt-1">Convert between PDF, Word, Excel, and other document formats</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Conversion Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* PDF Conversions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">PDF Conversions</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>PDF to Word (.docx)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>PDF to Excel (.xlsx)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>PDF to PowerPoint (.pptx)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>PDF to Image (PNG, JPG)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>PDF to Text (.txt)</span>
              </li>
            </ul>
            <button
              className="mt-4 w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              type="button"
            >
              Convert PDF
            </button>
          </div>

          {/* Word Conversions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Word Conversions</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Word to PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Word to Excel</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Word to HTML</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Word to Text</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Word to RTF</span>
              </li>
            </ul>
            <button
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              type="button"
            >
              Convert Word
            </button>
          </div>

          {/* Excel Conversions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Excel Conversions</h3>
            </div>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Excel to PDF</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Excel to Word</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Excel to CSV</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Excel to JSON</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-gray-400">•</span>
                <span>Excel to HTML</span>
              </li>
            </ul>
            <button
              className="mt-4 w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              type="button"
            >
              Convert Excel
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
                Document conversion features are currently under development. Drag and drop file conversion, batch processing, and more advanced options will be available soon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

