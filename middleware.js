import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  // const token = await getToken({ req });
  // const currentPath = req.nextUrl.pathname;

  // // Protect this route
  // const isProtected = currentPath.startsWith("/products/addProduct");
  // const isAdmin = token?.role === "admin";

  // if (isProtected && !isAdmin) {
  //   const callbackUrl = encodeURIComponent(req.nextUrl.href);
  //   return NextResponse.redirect(
  //     new URL(`/api/auth/signin?callbackUrl=${callbackUrl}`, req.url)
  //   );
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/products/:path*"], // protect all /products routes
};
