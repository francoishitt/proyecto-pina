import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.R2_BUCKET;
const key = "pruebas/prueba-r2.txt";

async function probarR2() {
  console.log("1. Conectando con Cloudflare R2...");

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: "Proyecto Piña conectado correctamente con Cloudflare R2.",
      ContentType: "text/plain",
    })
  );

  console.log("2. Archivo subido correctamente:");
  console.log(key);

  const resultado = await client.send(
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  const contenido = await resultado.Body.transformToString();

  console.log("3. Archivo leído correctamente:");
  console.log(contenido);

  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );

  console.log("4. Archivo eliminado correctamente.");
  console.log("PRUEBA R2 COMPLETADA.");
}

probarR2().catch((error) => {
  console.error("ERROR EN R2:");
  console.error(error);
  process.exit(1);
});