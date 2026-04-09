import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function verifyRole(token: string): string | null {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role?: string };
    return payload.role ?? null;
  } catch {
    return null;
  }
}

export function proxy(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;
  const fullPath = pathname + (req.nextUrl.search || "");

  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtected =
    pathname.startsWith("/dashboard") || pathname === "/order-form" || pathname === "/refund-form";

  if (isAuthPage && token) return NextResponse.redirect(new URL("/", req.url));
  if (!isProtected) return NextResponse.next();
  if (!token) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(fullPath)}`, req.url));
  }

  const role = verifyRole(token);
  if (!role) {
    return NextResponse.redirect(new URL(`/login?next=${encodeURIComponent(fullPath)}`, req.url));
  }

  if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/dashboard/mediator") && role !== "mediator") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (pathname.startsWith("/dashboard/buyer") && role !== "buyer") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if ((pathname === "/order-form" || pathname === "/refund-form") && role !== "buyer") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard/:path*", "/order-form", "/refund-form"],
};
