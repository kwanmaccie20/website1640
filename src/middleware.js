import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @param {NextRequest} req
 */
export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();
  // if (!req.nextUrl.pathname.startsWith("/auth")) {
  if (!session) {
    return NextResponse.redirect(new URL("/auth/", req.url));
  }
  // } else {
  //   if (session) return NextResponse.redirect(new URL("/", req.url));
  //   else return res;
  // }
}

export const config = {
  matcher: "/",
};
