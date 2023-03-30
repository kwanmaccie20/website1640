import { createMiddlewareSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

/**
 * @param {NextRequest} req
 */
// export async function middleware(req) {
//   const res = NextResponse.next();
//   const supabase = createMiddlewareSupabaseClient({ req, res });
//   const {
//     data: { session },
//   } = await supabase.auth.getSession();
//   if (session && req.nextUrl.pathname.startsWith("/auth")) {
//     return NextResponse.redirect(new URL("/", req.url));
//   } else if (session) return NextResponse.next();
//   if (!session && req.nextUrl.pathname.startsWith("/auth")) {
//     return NextResponse.next();
//   }
//   if (!session) {
//     return NextResponse.redirect(new URL("/auth", req.url));
//   }
// }

// export const config = {
//   matcher: ["/", "/auth"],
// };

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareSupabaseClient({ req, res });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (req.nextUrl.pathname.startsWith("/auth")) {
    if (session) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
  if (req.nextUrl.pathname.startsWith("/manager")) {
    const {
      data: { role_id },
    } = await supabase
      .from("staff")
      .select("role_id")
      .eq("id", session.user.id)
      .single();
    if (role_id !== 2) {
      return new Response("", {
        status: 403,
      });
    }
  }
}
