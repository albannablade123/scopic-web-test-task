import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value;
  if (token) {
    try {
      // Decode the JWT token to get the payload
      const decoded = jwt.decode(token) as JwtPayload & { isAdmin: boolean } | null;
      // const decoded = jwt.verify(token, JWT_SECRET) as { isAdmin: boolean };
      
      // Check if the user is an admin and the path does not start with '/admin'
      if (decoded != null && decoded.isAdmin) {
        // Allow admin users to access any path
        return NextResponse.next();
      }

      // If not an admin and trying to access an admin route, redirect to home or another route
      if (request.nextUrl.pathname.startsWith("/admin")) {
        return new NextResponse('Forbidden', { status: 403 });

      }
      
    } catch (error) {
      // Handle token verification errors
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    // If no token is present, redirect to login
    if (!request.nextUrl.pathname.startsWith("/login")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
