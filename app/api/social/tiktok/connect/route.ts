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

  const clientKey =
    process.env
      .TIKTOK_CLIENT_KEY;

  const clientSecret =
    process.env
      .TIKTOK_CLIENT_SECRET;

  if (
    !clientKey ||
    !clientSecret
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin/videos?error=tiktok_config",
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
    "tt_oauth_state",
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
    `${base}/api/social/tiktok/callback`;

  const url =
    new URL(
      "https://www.tiktok.com/v2/auth/authorize/"
    );

  url.searchParams.set(
    "client_key",
    clientKey
  );

  url.searchParams.set(
    "scope",
    "user.info.basic,video.list"
  );

  url.searchParams.set(
    "response_type",
    "code"
  );

  url.searchParams.set(
    "redirect_uri",
    redirectUri
  );

  url.searchParams.set(
    "state",
    state
  );

  return NextResponse.redirect(
    url
  );
}