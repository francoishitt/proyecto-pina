import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { r2, R2_BUCKET } from "../../../../lib/r2";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ nombre: string }> }
) {
  try {
    const params = await props.params;
    const fileName = params.nombre;

    // Solo admitimos nombres simples generados por el sistema.
    if (
      !fileName ||
      fileName !== path.basename(fileName) ||
      fileName.includes("..")
    ) {
      return new NextResponse("Archivo no válido.", { status: 400 });
    }

    const resultado = await r2.send(
      new GetObjectCommand({
        Bucket: R2_BUCKET,
        Key: fileName,
      })
    );

    if (!resultado.Body) {
      return new NextResponse("Archivo no encontrado.", { status: 404 });
    }

    const bytes = await resultado.Body.transformToByteArray();
    const fileBuffer = Buffer.from(bytes);

    const ext = path.extname(fileName).toLowerCase();

    let contentType =
      resultado.ContentType || "application/octet-stream";

    if (!resultado.ContentType) {
      if (ext === ".pdf") contentType = "application/pdf";
      if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
      if (ext === ".png") contentType = "image/png";
      if (ext === ".webp") contentType = "image/webp";
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    if (
      error?.name === "NoSuchKey" ||
      error?.name === "NotFound" ||
      error?.$metadata?.httpStatusCode === 404
    ) {
      return new NextResponse("Archivo no encontrado.", { status: 404 });
    }

    console.error("Error al servir archivo desde R2:", error);

    return new NextResponse("Error de servidor.", {
      status: 500,
    });
  }
}