import { useAppStore } from "@/components/app-provider";
import { handleErrorApi } from "@/lib/utils";
import { useLogoutMutation } from "@/queries/useAuth";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";
const UNAUTHENTICATED_PATH = ["/login", "/logout", "/refresh-token"];

export default function ListenLogoutSocket() {
  const socket = useAppStore((state) => state.socket);
  const setRole = useAppStore((state) => state.setRole);
  const disConectSocket = useAppStore((state) => state.disConectSocket);

  const { isPending, mutateAsync } = useLogoutMutation();
  const pathname = usePathname();
  const router = useRouter();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;

    async function onLogout() {
      if (isPending) return;
      try {
        await mutateAsync();
        setRole();
        disConectSocket();
        router.push("/");
      } catch (error) {
        handleErrorApi({
          error,
        });
      }
    }
    socket?.on("logout", onLogout);
    return () => {
      socket?.off("logout", onLogout);
    };
  }, [
    socket,
    pathname,
    disConectSocket,
    isPending,
    mutateAsync,
    setRole,
    router,
  ]);
  return null;
}
