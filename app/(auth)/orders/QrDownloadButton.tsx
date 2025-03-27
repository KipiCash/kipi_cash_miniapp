"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useState } from "react";

interface QrDownloadButtonProps {
  buyId: string;
}

export default function QrDownloadButton({ buyId }: QrDownloadButtonProps) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);

    const svg = document.querySelector(`#qr-code-${buyId} svg`);
    if (!svg) {
      setDownloading(false);
      return;
    }

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-compra-${buyId.slice(-5)}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();

      setDownloading(false);
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={downloading}
      className="mt-2 text-xs"
    >
      <Download className="w-3 h-3 mr-1" />
      {downloading ? "Descargando..." : "Descargar QR"}
    </Button>
  );
}
