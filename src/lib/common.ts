import envConfig from "@/config";
import { io } from "socket.io-client";

export const generateSocketInstace = (accessToken: string) => {
  return io(envConfig.NEXT_PUBLIC_API_ENPOINT, {
    auth: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
