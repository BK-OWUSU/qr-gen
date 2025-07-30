import { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

export const QrScanner = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      QRbox: {
        width: 250,
        height: 250,
      },
      fps: 5,
    });

    const success = (decodedText: string, decodedResult: unknown) => {
      scanner.clear().then(() => {
        setScanResult(decodedText);
        console.log("Decode Results: ", decodedResult)
      }).catch((err: unknown ) => console.error("Failed to clear scanner", err));
    };

    const error = (errorMessage: string) => {
      // You can log errors or ignore them
      console.warn("QR scan error:", errorMessage);
    };

    scanner.render(success, error);

    // Cleanup on unmount
    return () => {
      scanner.clear().catch((err: unknown) => console.error("Scanner cleanup failed:", err));
    };
  }, []);

  return (
    <main className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">QR Code Reader</h1>

      {scanResult ? (
        <div className="text-green-700 font-semibold">
           Success:{" "}
          <a href={scanResult.startsWith("http") ? scanResult : `http://${scanResult}`} target="_blank" rel="noopener noreferrer">
            {scanResult}
          </a>
        </div>
      ) : (
        <div id="reader" />
      )}
    </main>
  );
};
