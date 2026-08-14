import { useRef } from 'react';

const LessonPDFExporter = ({ lesson }) => {
  const contentRef = useRef();

  const handleDownloadPDF = async (event) => {
    if (!contentRef.current || !lesson) return;

    const button = event?.currentTarget;
    const originalText = button?.textContent;

    const exportNode = contentRef.current;
    const originalDisplay = exportNode.style.display;
    const originalPosition = exportNode.style.position;
    const originalLeft = exportNode.style.left;
    const originalTop = exportNode.style.top;
    const originalVisibility = exportNode.style.visibility;

    try {
      // Dynamically import to avoid errors if packages aren't installed
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');

      // Show loading state
      if (button) {
        button.textContent = 'Generating PDF...';
        button.disabled = true;
      }

      // Create a PDF instance early to compute page sizes
      const tempPdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidthMm = tempPdf.internal.pageSize.getWidth();

      // Convert desired PDF content width (mm) to pixels for html2canvas
      const pxPerMm = 96 / 25.4; // assume 96dpi for browser pixels
      const contentPxWidth = Math.floor((pageWidthMm - 20) * pxPerMm); // 10mm margins left/right

      // Save original styles we'll override
      const originalWidth = exportNode.style.width;
      const originalFontSize = exportNode.style.fontSize;
      const originalLineHeight = exportNode.style.lineHeight;

      // Set styles optimized for PDF capture
      exportNode.style.display = 'block';
      exportNode.style.position = 'fixed';
      exportNode.style.left = '-9999px';
      exportNode.style.top = '0';
      exportNode.style.visibility = 'visible';
      exportNode.style.width = `${contentPxWidth}px`;
      exportNode.style.fontSize = '16px';
      exportNode.style.lineHeight = '1.6';

      // Capture the DOM element as canvas with higher scale for better readability
      const scale = Math.max(2, window.devicePixelRatio || 2);
      const canvas = await html2canvas(exportNode, {
        scale,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        scrollY: -window.scrollY,
      });

      // Convert canvas to image and compute sizing for A4 pages
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Convert canvas pixels to mm at 96dpi then scale to fit page width
      const canvasWidthMm = (canvas.width / pxPerMm);
      const canvasHeightMm = (canvas.height / pxPerMm);
      const scaleFactor = (pageWidth - 20) / canvasWidthMm; // 10mm margins
      const imgWidth = canvasWidthMm * scaleFactor;
      const imgHeight = canvasHeightMm * scaleFactor;

      let heightLeft = imgHeight;
      let position = 10; // Top margin in mm

      // Add first page
      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - 20;

      // Add additional pages if needed
      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight - 20;
      }

      // Download the PDF
      pdf.save(`${lesson.title || 'Lesson'}.pdf`);

      // Restore original styles we modified
      exportNode.style.width = originalWidth;
      exportNode.style.fontSize = originalFontSize;
      exportNode.style.lineHeight = originalLineHeight;
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Make sure html2canvas and jsPDF are installed.');
    } finally {
      // restore original display/position/visibility
      exportNode.style.display = originalDisplay;
      exportNode.style.position = originalPosition;
      exportNode.style.left = originalLeft;
      exportNode.style.top = originalTop;
      exportNode.style.visibility = originalVisibility;

      if (button) {
        button.textContent = originalText || '📥 Download as PDF';
        button.disabled = false;
      }
    }
  };

  return (
    <div>
      <button
        onClick={handleDownloadPDF}
        className="mb-6 inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition"
      >
        📥 Download as PDF
      </button>

      {/* Hidden div for PDF rendering - optimized for PDF export */}
      <div
        ref={contentRef}
        className="hidden"
        style={{
          background: 'white',
          color: '#000',
          padding: '40px',
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '0 0 10px 0' }}>
            {lesson.title}
          </h1>
          <p style={{ color: '#666', margin: '0 0 20px 0' }}>
            Generated from AI Course Generator
          </p>
        </div>

        {/* Learning Objectives */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: '0 0 15px 0' }}>
              Learning Objectives
            </h2>
            <ul style={{ margin: '0', paddingLeft: '20px' }}>
              {lesson.objectives.map((obj, idx) => (
                <li key={idx} style={{ marginBottom: '8px', lineHeight: '1.5' }}>
                  {obj}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Content */}
        {lesson.content && lesson.content.length > 0 ? (
          <div style={{ marginTop: '30px' }}>
            {lesson.content.map((block, idx) => {
              // Handle string content
              if (typeof block === 'string') {
                return (
                  <div key={idx} style={{ marginBottom: '15px', lineHeight: '1.6' }}>
                    {block}
                  </div>
                );
              }

              // Handle object blocks
              switch (block.type) {
                case 'heading':
                  return (
                    <h2
                      key={idx}
                      style={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        margin: '20px 0 10px 0',
                      }}
                    >
                      {block.text}
                    </h2>
                  );

                case 'paragraph':
                  return (
                    <p key={idx} style={{ marginBottom: '12px', lineHeight: '1.6' }}>
                      {block.text}
                    </p>
                  );

                case 'code':
                  return (
                    <div key={idx} style={{ marginBottom: '15px' }}>
                      <div
                        style={{
                          backgroundColor: '#f5f5f5',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          padding: '12px',
                          overflow: 'auto',
                        }}
                      >
                        <div style={{ fontSize: '11px', color: '#999', marginBottom: '8px' }}>
                          {block.language || 'code'}
                        </div>
                        <pre
                          style={{
                            fontFamily: "'Courier New', monospace",
                            fontSize: '11px',
                            margin: '0',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                          }}
                        >
                          {block.text}
                        </pre>
                      </div>
                    </div>
                  );

                case 'video':
                  return (
                    <div key={idx} style={{ marginBottom: '15px', padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                      <strong>📹 Video:</strong> {block.query}
                    </div>
                  );

                case 'mcq':
                  return (
                    <div key={idx} style={{ marginBottom: '20px', padding: '12px', backgroundColor: '#f9f9f9', border: '1px solid #ddd', borderRadius: '4px' }}>
                      <strong>❓ Question:</strong> {block.question}
                      <ul style={{ margin: '10px 0 0 0', paddingLeft: '20px' }}>
                        {block.options.map((opt, optIdx) => (
                          <li key={optIdx} style={{ marginBottom: '6px' }}>
                            {opt}
                          </li>
                        ))}
                      </ul>
                      <div style={{ marginTop: '10px', color: '#0066cc' }}>
                        <strong>Correct Answer:</strong> {block.correctAnswer}
                      </div>
                      {block.explanation && (
                        <div style={{ marginTop: '8px', color: '#666' }}>
                          <strong>Explanation:</strong> {block.explanation}
                        </div>
                      )}
                    </div>
                  );

                default:
                  return null;
              }
            })}
          </div>
        ) : (
          <p>No content available</p>
        )}
      </div>
    </div>
  );
};

export default LessonPDFExporter;
