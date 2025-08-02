import { useState } from "react";
import logo from '/logo_3.png'
import { QrGenerator } from "./components/QrGenerator";
import { QrScanner } from "./components/QrScanner";

const PageMain = () => {
    const [activeLink, setActiveLink] = useState<boolean>(true);
    const baseClass = "lg:text-xl cursor-pointer text-[0.9rem] py-1 text-black transition-all duration-300";
    const activeClass = "font-semibold border-b-4 border-blue-300";
    const handleGenerateQr = () => {
        setActiveLink(true)
    }
    const handleScanQr = () => {
        setActiveLink(false)
    }

  return (
    <main className="h-screen mb-3">
        <div className="w-full h-fit py-1 px-2 lg:px-6 flex justify-between shadow-2xl mb-20 lg:mb-0">
            <div className='flex justify-center items-center rounded-full overflow-hidden'>
                <img src={logo} alt="Logo" className="w-6 h-6 lg:h-10 lg:w-10 rounded-full"/>
            </div>
            <div className='flex gap-4 items-center border-l-2 pl-5 p-1'>
                <a onClick={handleGenerateQr} className={`${baseClass} ${activeLink ? activeClass: '' }`}>Generate QR</a>
                <a onClick={handleScanQr} className={`${baseClass} ${activeLink ? '': activeClass }`}>Scan QR</a>
            </div>
        </div>
        {/* Body */}
        <div className="h-full flex justify-center items-center">
            {activeLink ? (
                <QrGenerator />
                ) : (
                <QrScanner />
                )}
        </div>
    </main>
  )
}

export default PageMain