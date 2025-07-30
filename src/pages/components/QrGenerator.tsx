import logo from '/logo_3.png'
import { useRef, useState } from 'react';
import QRCode from 'qrcode'
import { Button } from '@/components/ui/button';




export const QrGenerator = () => {
    const [url, setUrl] = useState<string >('');
    const [title, setTitle] = useState<string >('');
    const [error, setError] = useState<string| null>('');
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    const generateQR = async() => {
        if (!url || !url.startsWith("http")) {
            setError("Please enter a valid url")
            return
        }

        try {
            await QRCode.toCanvas(canvasRef.current,url , { width:200 });
        } catch (err) {
             setError('Failed to generate QR code.');
             console.error(err);
        }

    }

    const handleDownload = () => {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const image = canvas.toDataURL("image/png"); // You can change to "image/jpeg" if needed

  const link = document.createElement("a");
  link.href = image;
  link.download = title || "qrCode image"; // Set the filename
  link.click();
};

  return (
    <main className="flex flex-col justify-center items-center gap-8 h-full p-2">
        <div className="flex flex-col gap-4 justify-center items-center">
            <h1 className="font-bold text-xl text-center lg:text-3xl">The QR Code Generator – Instant, free, professional</h1>
            <h3 className="text-gray-500 lg:text-xl text-center text-wrap">Quickly generate static or dynamic QR codes for links, contacts, menus, and more—no fluff, just a simple, efficient tool for professionals.</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 lg:flex-row bg-black h-fit  w-[100%] lg:h-[55%] lg:w-[90%] rounded-4xl text-white p-6 ">
            <div>
                <div className='flex justify-between w-full'>
                    <h2 className="text-2xl font-bold">Create a QR Code</h2>
                    <span><img src={logo} alt="Logo" className="w-6 h-6 lg:h-10 lg:w-10 "/></span>
                </div>
                <div className="flex flex-col gap-3 mt-6 ">
                    <div className="flex flex-col" >
                        <label className='lg:text-xl font-semibold mb-2' htmlFor="gen_title">Enter file title (optional):</label>
                        <input value={title} onChange={(e)=> setTitle(e.target.value) } type="text" id='gen_title' placeholder="Name of your file" className="p-2 bg-white text-black placeholder:text-gray-500 rounded-lg lg:p-3 lg:text-lg lg:rounded-2xl mb-3" />
                    </div>
                    <div className="flex flex-col" >
                        <label className='lg:text-xl font-semibold mb-2' htmlFor="gen_url">Enter your URL:</label>
                        <input value={url} onChange={(e)=> setUrl(e.target.value) } type="text" id='gen_url' placeholder="http://your-website.com" className="p-2 bg-white text-black placeholder:text-gray-500 rounded-lg lg:p-3 lg:text-lg lg:rounded-2xl mb-3" />
                    </div>
                    <Button 
                        className='bg-white text-black p-6 hover:bg-gray-200 cursor-pointer'
                        onClick={generateQR}
                        >Generate QR Code</Button>
                    <p className='text-red-400 w-full text-center'>{error}</p>    
                </div>
            </div>
            <div className="w-full lg:border-l-3 grid grid-cols-1 gap-2 items-center">
                <div className='flex justify-between w-full'>
                    <h2 className="text-2xl font-bold text-center w-full">Scan Result</h2>
                </div>
                <div className="flex flex-col justify-center items-center">
                    <div className="bg-white border-2 border-gray-300 rounded-xl p-4 w-[250px] h-[250px] flex justify-center items-center">
                        <canvas ref={canvasRef}></canvas>
                    </div>
                </div>  
                <Button 
                    className='bg-white text-black w-fit lg:p-6 hover:bg-gray-200 cursor-pointer mx-auto' 
                    onClick={handleDownload}
                >
                    Download
                </Button>
            </div>
        </div>
    </main>
  )
}
