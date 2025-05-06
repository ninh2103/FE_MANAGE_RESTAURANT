"use client";

import { useEffect, useRef } from "react";
import QRCode from "qrcode";
import { getTableLink } from "@/lib/utils";

export default function QRCodetable({
  token,
  tableNumber,
  width = 250,
}: {
  token: string;
  tableNumber: number;
  width?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current!;
    canvas.height = width + 70;
    canvas.width = width;

    const canvasContext = canvas.getContext("2d")!;
    canvasContext.fillStyle = "#fff";
    canvasContext.fillRect(0, 0, canvas.width, canvas.height);
    canvasContext.font = "20px Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillStyle = "#000";
    canvasContext.fillText(
      `Bàn Số ${tableNumber}`,
      canvas.width / 2,
      canvas.width + 20
    );
    canvasContext.fillText(
      `Quét Mã QR Để Gọi Món`,
      canvas.width / 2,
      canvas.width + 50
    );
    const virtalCanvas = document.createElement("canvas");
    QRCode.toCanvas(
      virtalCanvas,
      getTableLink({
        token,
        tableNumber,
      }),
      function (error) {
        if (error) console.log(error);
        canvasContext.drawImage(virtalCanvas, 0, 0, width, width);
      }
    );
  }, [token, width, tableNumber]);
  return <canvas ref={canvasRef} />;
}
