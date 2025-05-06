import { Role } from "@/constants/type";
import { decodeToken } from "@/lib/utils";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const managePaths = ["/manage"];
const guestPaths = ["/guest"];
const onlyOwnerPaths = ["/manage/accounts"];

const privatePaths = [...managePaths, ...guestPaths];
const unAuthPaths = ["/login"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const accessToken = request.cookies.get("accessToken")?.value;

  // 1. Người dùng chưa đăng nhập thì không cho vào privatePaths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    const url = new URL("/login", request.url);
    url.searchParams.set("clearsToken", "true");
    return NextResponse.redirect(url);
  }

  if (refreshToken) {
    // 2. Người dùng đã đăng nhập thì không cho vào trang login
    if (unAuthPaths.some((path) => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 3. Nếu không có accessToken, chuyển hướng đến trang refresh-token
    if (
      privatePaths.some((path) => pathname.startsWith(path)) &&
      !accessToken
    ) {
      const url = new URL("/refresh-token", request.url);
      url.searchParams.set("refreshToken", refreshToken);
      url.searchParams.set("redirect", pathname);
      return NextResponse.redirect(url);
    }

    // 4. Xử lý chuyển hướng dựa trên role
    const role = decodeToken(refreshToken).role;

    const isGuestGoToManagePath =
      role === Role.Guest &&
      managePaths.some((path) => pathname.startsWith(path));

    const isNotGuestGoToGuestPath =
      role !== Role.Guest &&
      guestPaths.some((path) => pathname.startsWith(path));

    const isNotOwnerGoToOwnerPath =
      role !== Role.Owner &&
      onlyOwnerPaths.some((path) => pathname.startsWith(path));

    // Nếu khách vào đường dẫn quản lý hoặc không phải khách mà vào đường dẫn dành cho khách
    if (
      isGuestGoToManagePath ||
      isNotGuestGoToGuestPath ||
      isNotOwnerGoToOwnerPath
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/guest/:path*", "/login"],
};
