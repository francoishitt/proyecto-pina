import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

import { obtenerUsuarioSesion } from "@/lib/auth";

export async function GET() {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://proyectopina.com"
  ).replace(/\/$/, "");

  const usuario =
    await obtenerUsuarioSesion();

  if (!usuario) {
    return NextResponse.redirect(
      new URL("/login", base)
    );
  }

  if (usuario.rol !== "ADMIN") {
    return NextResponse.redirect(
      new URL("/admin", base)
    );
  }

  const appId =
    process.env.INSTAGRAM_APP_ID;

  if (!appId) {
    return NextResponse.redirect(
      new URL(
        "/admin/videos?error=instagram_config",
        base
      )
    );
  }

  const state =
    crypto
      .randomBytes(20)
      .toString("hex");

  const jar =
    await cookies();

  jar.set(
    "ig_oauth_state",
    state,
    {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 600,
      path: "/",
    }
  );

  const redirectUri =
    `${base}/api/social/instagram/callback`;

  const url =
    new URL(
      "https://www.instagram.com/oauth/authorize"
    );

  url.searchParams.set(
    "client_id",
    appId
  );

  url.searchParams.set(
    "redirect_uri",
    redirectUri
  );

  url.searchParams.set(
    "response_type",
    "code"
  );

  url.searchParams.set(
    "scope",
    "instagram_business_basic"
  );

  url.searchParams.set(
    "enable_fb_login",
    "0"
  );

  url.searchParams.set(
    "force_authentication",
    "1"
  );

  url.searchParams.set(
    "state",
    state
  );

  return NextResponse.redirect(
    url
  );
}