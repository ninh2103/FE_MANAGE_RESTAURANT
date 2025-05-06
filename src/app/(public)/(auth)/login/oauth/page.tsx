"use client";

import { useAppStore } from "@/components/app-provider";
import { toast } from "@/components/ui/use-toast";
import { generateSocketInstace } from "@/lib/common";
import { decodeToken } from "@/lib/utils";
import { useSetTokenToCookieMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function OauthPage() {
  const count = useRef(0);
  const router = useRouter();
  const { mutateAsync } = useSetTokenToCookieMutation();
  const setSocket = useAppStore((state) => state.setSocket);
  const setRole = useAppStore((state) => state.setRole);
  const searchParams = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const refreshToken = searchParams.get("refreshToken");
  const message = searchParams.get("message");

  useEffect(() => {
    if (accessToken && refreshToken) {
      if (count.current === 0) {
        const { role } = decodeToken(accessToken);
        setRole(role);
        setSocket(generateSocketInstace(accessToken));
        mutateAsync({ refreshToken, accessToken }).then(() => {
          router.push("/manage/dashboard");
        });
        count.current++;
      }
    } else {
      if (count.current === 0) {
        setTimeout(() => {
          toast({
            description: message || "co loi",
          });
        });
        count.current++;
      }
    }
  }, [
    setRole,
    accessToken,
    refreshToken,
    router,
    setSocket,
    mutateAsync,
    message,
  ]);

  return null;
}
