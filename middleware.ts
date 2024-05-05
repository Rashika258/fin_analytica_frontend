import { NextRequestWithAuth, withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Middleware allows you to run code before a request is completed. Then, based on the incoming request, you can modify the response by rewriting, redirecting, modifying the request or response headers, or responding directly.

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  // Currently only supports session verification

  async function middleware(req: NextRequestWithAuth) {
    // Check for the current path
    const path = req.nextUrl.pathname;

    const session = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuth = !!session;

    if (path.startsWith("/login")) {
      if (isAuth) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path",
    "/upload/:path",
    "/text-recognition/:path",
    "/data-extraction/:path",
    "/verification/:path",
    "/receipts/:path",
    "/invoices/:path",
    "/card-statements/:path",
    "/settings/:path",
    "/help/:path",
    "/login",
  ],
};
