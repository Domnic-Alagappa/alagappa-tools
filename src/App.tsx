import { useState } from "react";
import Layout from "./components/Layout";
import AttendanceModule from "./components/AttendanceModule";
import DocumentConverter from "./components/DocumentConverter";
import ImageConverter from "./components/ImageConverter";
import VideoConverter from "./components/VideoConverter";
import ErrorBoundary from "./components/ErrorBoundary";

function App(): JSX.Element {
  const [activeTool, setActiveTool] = useState<string>("attendance");

  const renderTool = (): JSX.Element => {
    switch (activeTool) {
      case "attendance":
        return <AttendanceModule />;
      case "document":
        return <DocumentConverter />;
      case "image":
        return <ImageConverter />;
      case "video":
        return <VideoConverter />;
      default:
        return <AttendanceModule />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout activeTool={activeTool} onToolChange={setActiveTool}>
        {renderTool()}
      </Layout>
    </ErrorBoundary>
  );
}

export default App;

