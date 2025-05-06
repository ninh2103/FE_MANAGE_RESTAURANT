"use client";
import { useAppStore } from "@/components/app-provider";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useRef } from "react";

function Logout() {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const socket = useAppStore((state) => state.socket);
  const setRole = useAppStore((state) => state.setRole);
  const setSocket = useAppStore((state) => state.setSocket);
  const disConectSocket = useAppStore((state) => state.disConectSocket);
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenTokenFromUrl = searchParams.get("accessToken");

  const ref = useRef<any>(null);
  useEffect(() => {
    if (
      (!ref.current &&
        refreshTokenFromUrl &&
        refreshTokenFromUrl === getRefreshTokenFromLocalStorage()) ||
      (accessTokenTokenFromUrl &&
        accessTokenTokenFromUrl === getAccessTokenFromLocalStorage())
    ) {
      ref.current = mutateAsync;
      mutateAsync().then((res) => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        setRole();
        disConectSocket();
        router.push("/login");
      });
    } else {
      router.push("/");
    }
  }, [
    mutateAsync,
    router,
    refreshTokenFromUrl,
    accessTokenTokenFromUrl,
    setRole,
    socket,
    setSocket,
    disConectSocket,
  ]);
  return <div>Logout...</div>;
}
export default function LogoutPage() {
  <Suspense>
    <Logout />
  </Suspense>;
}
