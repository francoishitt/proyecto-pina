import {
  NextRequest,
  NextResponse,
} from "next/server";

import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { obtenerUsuarioSesion } from "@/lib/auth";

export async function GET(
  req: NextRequest
) {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://proyectopina.com"
  ).replace(/\/$/, "");

  // También protegemos el callback.
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

  const query =
    req.nextUrl.searchParams;

  const oauthError =
    query.get("error");

  if (oauthError) {
    console.error(
      "TikTok OAuth error",
      oauthError,
      query.get(
        "error_description"
      )
    );

    return NextResponse.redirect(
      new URL(
        "/admin/videos?error=tiktok",
        base
      )
    );
  }

  const state =
    query.get("state");

  const jar =
    await cookies();

  const stateGuardado =
    jar.get(
      "tt_oauth_state"
    )?.value;

  if (
    !state ||
    state !== stateGuardado
  ) {
    console.error(
      "TikTok OAuth state mismatch"
    );

    return NextResponse.redirect(
      new URL(
        "/admin/videos?error=state",
        base
      )
    );
  }

  const code =
    query.get("code");

  if (!code) {
    console.error(
      "TikTok OAuth missing code"
    );

    return NextResponse.redirect(
      new URL(
        "/admin/videos?error=tiktok",
        base
      )
    );
  }

  const redirectUri =
    `${base}/api/social/tiktok/callback`;

  const body =
    new URLSearchParams({
      client_key:
        process.env
          .TIKTOK_CLIENT_KEY ||
        "",

      client_secret:
        process.env
          .TIKTOK_CLIENT_SECRET ||
        "",

      code,

      grant_type:
        "authorization_code",

      redirect_uri:
        redirectUri,
    });

  const tokenResponse =
    await fetch(
      "https://open.tiktokapis.com/v2/oauth/token/",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",

          "Cache-Control":
            "no-cache",
        },

        body,

        cache:
          "no-store",
      }
    );

  if (
    !tokenResponse.ok
  ) {
    console.error(
      "TikTok token error",
      tokenResponse.status,
      await tokenResponse.text()
    );

    return NextResponse.redirect(
      new URL(
        "/admin/videos?error=tiktok_token",
        base
      )
    );
  }

  const token =
    await tokenResponse.json();

  const userResponse =
    await fetch(
      "https://open.tiktokapis.com/v2/user/info/?fields=open_id,avatar_url,display_name,profile_deep_link",
      {
        headers: {
          Authorization:
            `Bearer ${token.access_token}`,
        },

        cache:
          "no-store",
      }
    );

  let user: {
    open_id?: string;
    avatar_url?: string;
    display_name?: string;
    profile_deep_link?: string;
  } = {};

  if (
    userResponse.ok
  ) {
    const respuesta =
      await userResponse.json();

    user =
      respuesta.data?.user ||
      {};
  } else {
    console.error(
      "TikTok user info error",
      userResponse.status,
      await userResponse.text()
    );
  }

  await prisma.conexionSocial.upsert({
    where: {
      plataforma:
        "TIKTOK",
    },

    update: {
      accessToken:
        token.access_token,

      refreshToken:
        token.refresh_token,

      tokenExpiresAt:
        new Date(
          Date.now() +
            (token.expires_in ||
              86400) *
              1000
        ),

      externalUserId:
        user.open_id ||
        token.open_id,

      displayName:
        user.display_name,

      profileUrl:
        user.profile_deep_link,

      avatarUrl:
        user.avatar_url,

      scope:
        token.scope,
    },

    create: {
      plataforma:
        "TIKTOK",

      accessToken:
        token.access_token,

      refreshToken:
        token.refresh_token,

      tokenExpiresAt:
        new Date(
          Date.now() +
            (token.expires_in ||
              86400) *
              1000
        ),

      externalUserId:
        user.open_id ||
        token.open_id,

      displayName:
        user.display_name,

      profileUrl:
        user.profile_deep_link,

      avatarUrl:
        user.avatar_url,

      scope:
        token.scope,
    },
  });

  jar.delete(
    "tt_oauth_state"
  );

  return NextResponse.redirect(
    new URL(
      "/admin/videos?conectado=tiktok",
      base
    )
  );
}