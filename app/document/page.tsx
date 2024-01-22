"use client"
import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode.react';
import html2canvas from "html2canvas";
import PageContainer from "@/components/PageContainer";

export default function Document() {
    const [url, setUrl] = useState('');
    const [qrCodeValue, setQrCodeValue] = useState('');

    const iframeRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        if (iframeRef.current) {
          iframeRef.current.src = url;
        }
    }, [url]);

    useEffect(() => {
        const intervalId = setInterval(() => {
          if (iframeRef.current) {
            iframeRef.current.src = url;
          }
        }, 30000);

        return () => clearInterval(intervalId);
    }, [url]);

    const handleInputChange = (e: any) => {
        setUrl(e.target.value);
    };

    const generateQRCode = () => {
        setQrCodeValue(url);
    };

    const downloadQRCode = () => {
        const qrCode = document.getElementById('qrCode');
        if (!qrCode) {
            console.error('QR Code container not found');
            return;
        }

        html2canvas(qrCode).then((canvas) => {
            const qrCodeImg = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = qrCodeImg;
            link.download = 'QR-Code.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    return (
        <PageContainer>
            <div className="flex flex-col items-center justify-center w-80 mt-20 mx-auto p-8 border rounded shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Generate QR Code</h1>
                <input
                    type="text"
                    placeholder="Enter URL"
                    value={url}
                    onChange={handleInputChange}
                    className="border border-gray-300 rounded-md px-4 py-2 mb-4 w-64"
                />
                <button
                    onClick={generateQRCode}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Generate
                </button>

                {qrCodeValue && (
                    <div className="mt-8">
                        <div className="flex items-center justify-center border border-gray-300 rounded p-2" id='qrCode'>
                            <QRCode value={qrCodeValue} />
                        </div>
                        <button
                            onClick={downloadQRCode}
                            className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
                        >
                            Download QR
                        </button>
                    </div>
                )}
            </div>
            <div className="overflow-hidden flex gap-8">
                <iframe
                    ref={iframeRef}
                    src={url}
                    className="w-full h-96 mx-auto mt-20 p-10 border rounded shadow-lg "
                    title="Web Viewer"
                ></iframe>
            </div>
        </PageContainer>
    )
}
