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

  // El callback también exige una sesión ADMIN.
  // El state OAuth sigue siendo una segunda protección.
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

  const jar =
    await cookies();

  const query =
    req.nextUrl.searchParams;

  const state =
    query.get("state");

  const stateGuardado =
    jar.get(
      "ig_oauth_state"
    )?.value;

  if (
    !state ||
    state !== stateGuardado
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin/videos?error=state",
        base
      )
    );
  }

  const code =
    (
      query.get("code") ||
      ""
    ).replace(/#_$/, "");

  if (!code) {
    return NextResponse.redirect(
      new URL(
        "/admin/videos?error=instagram",
        base
      )
    );
  }

  const redirectUri =
    `${base}/api/social/instagram/callback`;

  const body =
    new URLSearchParams({
      client_id:
        process.env
          .INSTAGRAM_APP_ID ||
        "",

      client_secret:
        process.env
          .INSTAGRAM_APP_SECRET ||
        "",

      grant_type:
        "authorization_code",

      redirect_uri:
        redirectUri,

      code,
    });

  const shortResponse =
    await fetch(
      "https://api.instagram.com/oauth/access_token",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body,
      }
    );

  if (
    !shortResponse.ok
  ) {
    return NextResponse.redirect(
      new URL(
        "/admin/videos?error=instagram_token",
        base
      )
    );
  }

  const short =
    await shortResponse.json();

  const longUrl =
    new URL(
      "https://graph.instagram.com/access_token"
    );

  longUrl.searchParams.set(
    "grant_type",
    "ig_exchange_token"
  );

  longUrl.searchParams.set(
    "client_secret",
    process.env
      .INSTAGRAM_APP_SECRET ||
      ""
  );

  longUrl.searchParams.set(
    "access_token",
    short.access_token
  );

  const longResponse =
    await fetch(
      longUrl
    );

  const long =
    longResponse.ok
      ? await longResponse.json()
      : short;

  const token =
    long.access_token ||
    short.access_token;

  const profileUrl =
    new URL(
      "https://graph.instagram.com/me"
    );

  profileUrl.searchParams.set(
    "fields",
    "id,username,name,profile_picture_url"
  );

  profileUrl.searchParams.set(
    "access_token",
    token
  );

  const profileResponse =
    await fetch(
      profileUrl
    );

  const profile =
    profileResponse.ok
      ? await profileResponse.json()
      : {};

  await prisma.conexionSocial.upsert({
    where: {
      plataforma:
        "INSTAGRAM",
    },

    update: {
      accessToken:
        token,

      tokenExpiresAt:
        new Date(
          Date.now() +
            (long.expires_in ||
              5184000) *
              1000
        ),

      externalUserId:
        String(
          profile.id ||
            short.user_id ||
            ""
        ),

      username:
        profile.username,

      displayName:
        profile.name,

      profileUrl:
        profile.username
          ? `https://www.instagram.com/${profile.username}/`
          : null,

      avatarUrl:
        profile.profile_picture_url,

      scope:
        "instagram_business_basic",
    },

    create: {
      plataforma:
        "INSTAGRAM",

      accessToken:
        token,

      tokenExpiresAt:
        new Date(
          Date.now() +
            (long.expires_in ||
              5184000) *
              1000
        ),

      externalUserId:
        String(
          profile.id ||
            short.user_id ||
            ""
        ),

      username:
        profile.username,

      displayName:
        profile.name,

      profileUrl:
        profile.username
          ? `https://www.instagram.com/${profile.username}/`
          : null,

      avatarUrl:
        profile.profile_picture_url,

      scope:
        "instagram_business_basic",
    },
  });

  jar.delete(
    "ig_oauth_state"
  );

  return NextResponse.redirect(
    new URL(
      "/admin/videos?conectado=instagram",
      base
    )
  );
}