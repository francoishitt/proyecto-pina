import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const client = new S3Client({
  region: process.env.R2_REGION || "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

await client.send(
  new PutObjectCommand({
    Bucket: process.env.R2_BUCKET,
    Key: "prueba-api-r2.txt",
    Body: "Proyecto Piña está sirviendo este archivo desde Cloudflare R2.",
    ContentType: "text/plain; charset=utf-8",
  })
);

console.log("Archivo prueba-api-r2.txt subido correctamente a R2.");