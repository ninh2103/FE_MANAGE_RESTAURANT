import { z } from "zod";

const configSchema = z.object({
  NEXT_PUBLIC_API_ENPOINT: z.string(),
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
  NEXT_PUBLIC_URL: z.string(),
  NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI: z.string(),
});

const configProject = configSchema.safeParse({
  NEXT_PUBLIC_API_ENPOINT: process.env.NEXT_PUBLIC_API_ENPOINT,
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
  NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI:
    process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
});

if (!configProject.success) {
  console.error(configProject.error.errors);
  throw new Error("các khai báo biến môi trường không hợp lệ");
}
const envConfig = configProject.data;
export default envConfig;
