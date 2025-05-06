"use client";

import { useAppStore } from "@/components/app-provider";
import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const UNAUTHENTICATED_PATH = [
  "/login",
  "/register",
  "/logout",
  "/refresh-token",
];

export default function RefreshToken() {
  const setSocket = useAppStore((state) => state.setSocket);
  const socket = useAppStore((state) => state.socket);
  const disConectSocket = useAppStore((state) => state.disConectSocket);
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;
    let interval: any = null;
    const onRefreshToken = (force?: boolean) =>
      checkAndRefreshToken({
        onError: () => {
          clearInterval(interval);
          disConectSocket();
          router.push("/login");
        },
        force,
      });
    onRefreshToken();
    const TIMEOUT = 1000;
    interval = setInterval(() => onRefreshToken, TIMEOUT);

    if (socket?.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket?.id);
    }

    function onDisconnect() {
      console.log("disconect");
    }

    function onRefreshTokenSocket() {
      onRefreshToken(true);
    }

    socket?.on("connect", onConnect);
    socket?.on("disconnect", onDisconnect);
    socket?.on("refresh-token", onRefreshTokenSocket);

    return () => {
      clearInterval(interval);
      socket?.off("connect", onConnect);
      socket?.off("disconnect", onDisconnect);
      socket?.off("refresh-token", onRefreshTokenSocket);
    };
  }, [pathname, router, socket, setSocket, disConectSocket]);
  return null;
}
