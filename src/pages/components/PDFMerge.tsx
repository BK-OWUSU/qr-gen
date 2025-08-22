import { useState, useEffect } from "react";
import { mergePDFs } from "./mergePDFs";
import { FileText,X } from "lucide-react"; // ✅ PDF icon (lucide-react)


const PDFMerge = () => {
  const [title, setTitle] = useState<string >('');  
  const [pdfUrl, setPdfUrl] = useState<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  //Storing dropped files 
  const handleFiles =  (files: FileList | File[]) => {
    const pdfFiles = Array.from(files).filter((file) => file.type === "application/pdf");
    if (pdfFiles.length > 0) {
       setSelectedFiles((prev)=>{
        const newPdf = pdfFiles.filter((file) => !prev.some((f)=> f.name === file.name && f.lastModified === file.lastModified));
        return [...prev, ...newPdf]
       }); 
       setPdfUrl(undefined);
    }
  };

  //Function to merge files
  const mergeFiles = async ()=> {
    if (selectedFiles.length > 0) {
      const pdfs_url = await mergePDFs(selectedFiles);
      setPdfUrl(pdfs_url)
    }
  }

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const resetAll = () => {
    setTitle("");
    setPdfUrl(undefined)
    setSelectedFiles([])
  }

  return (
    <main className="p-2 flex justify-center items-center h-fit lg:w-[90%] ">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:flex-row bg-black h-fit lg:w-[90%] rounded-xl text-white p-6 mb-5">
        {/* Upload / Drop Area */}
        <div className="flex flex-col gap-3 w-full text-white h-[70vh]">
          <div className="flex flex-col" >
            <label className='lg:text-xl font-semibold mb-2' htmlFor="gen_title">Enter file title (optional):</label>
            <input 
              value={title} 
              onChange={(e)=> setTitle(e.target.value) } 
              type="text" 
              id='gen_title' 
              placeholder="Name for merged file" 
              className="p-2 text-white border-2 border-gray-300 placeholder:text-gray-100 rounded-lg lg:text-lg lg:rounded-md" />
          </div>
          {/* File picker */}
          <input
            className="border-2 bg-blue-400  hover:bg-blue-500 border-gray-300 p-2 rounded-sm cursor-pointer"
            type="file"
            multiple
            accept="application/pdf"
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
          />

          {/* Drag-and-drop area */}
          <div
            className={`border-2 h-[40%] flex justify-center items-center border-dashed rounded-md p-6 text-center transition-all ${
              isDragging ? "border-blue-400 bg-blue-50 text-black" : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
            }}
          >
            {isDragging ? "Drop your PDFs here" : "Drag & drop PDFs here"}
          </div>

          {/* Show selected files */}
          {/* {selectedFiles.length > 0 && ( */}
            <div className="mt-2 space-y-2 p-2 border-2 border-gray-300 h-[17%] overflow-y-auto rounded-md">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-white">
                  <FileText className="w-5 h-5 text-red-500" /> {/* PDF icon */}
                  <span className="truncate">{file.name}</span>
                  <button
                    onClick={()=> setSelectedFiles(selectedFiles.filter((_, i) => i !== index))}
                    className="ml-2 text-red-400 cursor-pointer hover:text-red-600"
                  >
                    <X className="h-5 w-5"/>
                  </button>
                </div>
              ))}
            </div>
          {/* )} */}

          <div className="flex  justify-between items-center">
            <div className="flex gap-4">
              <button 
                onClick={mergeFiles} 
                disabled = {selectedFiles.length === 0}
                className={`rounded-sm py-1.5 px-4 ${selectedFiles.length === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-400 hover:bg-blue-500"} `}
              >
                Merge file(s)
              </button>
              {pdfUrl && (
                <a
                  href={pdfUrl}
                  download={title ? `${title}.pdf`: "Combined.pdf"}
                  className={`rounded-sm py-1.5 px-4 ${ !pdfUrl ? "bg-gray-500 cursor-not-allowed" : "bg-blue-400 hover:bg-blue-500"} `}
                >
                  Download <p className="hidden md:inline">PDF</p> 
                </a>
              )}
            </div>
            {/* Reset Button */}
            <button 
                onClick={resetAll} 
                disabled = {selectedFiles.length === 0}
                className={`rounded-sm py-1.5 px-4 ${selectedFiles.length === 0 ? "bg-gray-500 cursor-not-allowed" : "bg-blue-400 hover:bg-blue-500"} `}
              >
                Reset
            </button>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1 pb-5 md:p-2">
          <p className="flex justify-center items-center text-white ">Preview</p>
          
            <iframe
              src={pdfUrl}
              title="Merged PDF Preview"
              className="mt-4 rounded-md border-2 w-full h-[90%] border-gray-300"
            ></iframe>
        
        </div>
      </div>
    </main>  
  );
};

export default PDFMerge;
