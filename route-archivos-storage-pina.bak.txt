import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ nombre: string }> }
) {
  try {
    const params = await props.params;
    const fileName = params.nombre;

    // Solo admitimos nombres simples generados por el sistema.
    // Esto impide intentar salir de storage_pina con rutas manipuladas.
    if (!fileName || fileName !== path.basename(fileName) || fileName.includes("..")) {
      return new NextResponse("Archivo no válido.", { status: 400 });
    }

    const projectRoot = process.cwd();
    const persistentDir = path.resolve(projectRoot, "..", "storage_pina");
    const filePath = path.resolve(persistentDir, fileName);

    if (!filePath.startsWith(`${persistentDir}${path.sep}`)) {
      return new NextResponse("Archivo no válido.", { status: 400 });
    }

    if (!fs.existsSync(filePath)) {
      return new NextResponse("Archivo no encontrado.", { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(fileName).toLowerCase();

    let contentType = "application/octet-stream";
    if (ext === ".pdf") contentType = "application/pdf";
    if (ext === ".jpg" || ext === ".jpeg") contentType = "image/jpeg";
    if (ext === ".png") contentType = "image/png";
    if (ext === ".webp") contentType = "image/webp";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error al servir archivo:", error);
    return new NextResponse("Error de servidor.", { status: 500 });
  }
}
