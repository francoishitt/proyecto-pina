"use server";
import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { prisma } from "@/lib/prisma";
import { exigirGestorEstructura, mensajeErrorPermisos } from "@/lib/auth";
import { categoriaSchema } from "@/lib/validations/categoria.schema";
interface PrismaError extends Error { code:string }
const isPrismaError=(e:unknown):e is PrismaError=>typeof e==="object"&&e!==null&&"code" in e;
const limpiar=()=>{ revalidatePath("/","layout"); revalidatePath("/cursos"); revalidatePath("/admin/categorias"); };
export async function obtenerCategorias(){
 try{ const data=await prisma.categoria.findMany({orderBy:[{orden:"asc"},{nombre:"asc"}],include:{_count:{select:{subcategorias:true,cursos:true}},subcategorias:{orderBy:[{orden:"asc"},{nombre:"asc"}],select:{id:true,nombre:true,orden:true,visible:true,_count:{select:{cursos:true}}}},cursos:{select:{id:true,titulo:true}}}}); return {success:true,data}; }
 catch(e){console.error("obtenerCategorias",e);return{success:false,error:"No se pudieron cargar las categorías."}}
}
function raw(fd:FormData){return{nombre:fd.get("nombre"),slug:fd.get("slug"),descripcion:fd.get("descripcion"),orden:Number(fd.get("orden")||0),visible:fd.get("visible")==="true"}}
export async function crearCategoria(fd:FormData){try{await exigirGestorEstructura();const datos=categoriaSchema.parse(raw(fd));const data=await prisma.categoria.create({data:datos});limpiar();return{success:true,data}}catch(e){const p=mensajeErrorPermisos(e);if(p)return{success:false,error:p};if(e instanceof ZodError)return{success:false,error:e.issues[0].message};if(isPrismaError(e)&&e.code==="P2002")return{success:false,error:"El nombre o slug ya existe."};return{success:false,error:"Error al crear la categoría."}}}
export async function actualizarCategoria(id:string,fd:FormData){try{await exigirGestorEstructura();const datos=categoriaSchema.parse(raw(fd));const data=await prisma.categoria.update({where:{id},data:datos});limpiar();return{success:true,data}}catch(e){const p=mensajeErrorPermisos(e);if(p)return{success:false,error:p};if(e instanceof ZodError)return{success:false,error:e.issues[0].message};return{success:false,error:"Error al actualizar la categoría."}}}
export async function eliminarCategoria(id:string){try{await exigirGestorEstructura();await prisma.categoria.delete({where:{id}});limpiar();return{success:true}}catch(e){const p=mensajeErrorPermisos(e);if(p)return{success:false,error:p};if(isPrismaError(e)&&e.code==="P2003")return{success:false,error:"Primero elimina o reasigna las subcategorías y materiales asociados."};return{success:false,error:"No se pudo eliminar la categoría."}}}
