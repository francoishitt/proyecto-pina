"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  categoriaSchema,
  CategoriaFormData,
} from "@/lib/validations/categoria.schema";

import {
  crearCategoria,
  actualizarCategoria,
} from "@/actions/categoria.action";

import type { CategoriaConRelaciones } from "../types";

interface Props {
  modo: "crear" | "editar";
  categoria: CategoriaConRelaciones | null;
  onGuardado: () => void;
  onCancelar: () => void;
}

type CategoriaFormInput = z.input<typeof categoriaSchema>;

function generarSlug(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function Formulario({
  modo,
  categoria,
  onGuardado: _onGuardado,
  onCancelar,
}: Props) {
  const [busy, setBusy] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<
    CategoriaFormInput,
    unknown,
    CategoriaFormData
  >({
    resolver: zodResolver(categoriaSchema),

    defaultValues: {
      nombre: categoria?.nombre || "",
      slug: categoria?.slug || "",
      descripcion: categoria?.descripcion || "",
      orden: categoria?.orden ?? 0,
      visible: categoria?.visible ?? true,
    },
  });

  useEffect(() => {
    reset({
      nombre: categoria?.nombre || "",
      slug: categoria?.slug || "",
      descripcion: categoria?.descripcion || "",
      orden: categoria?.orden ?? 0,
      visible: categoria?.visible ?? true,
    });
  }, [categoria, reset]);

  const visible = watch("visible");

  const submit = async (
    data: CategoriaFormData
  ) => {
    setBusy(true);

    const fd = new FormData();

    fd.append("nombre", data.nombre);
    fd.append("slug", data.slug);
    fd.append(
      "descripcion",
      data.descripcion || ""
    );
    fd.append(
      "orden",
      String(data.orden)
    );
    fd.append(
      "visible",
      String(data.visible)
    );

    try {
      const resultado =
        modo === "crear"
          ? await crearCategoria(fd)
          : await actualizarCategoria(
              categoria!.id,
              fd
            );

      if (resultado.success) {
        toast.success(
          "Cambios guardados correctamente"
        );

        window.location.assign(
          "/admin/categorias?guardado=1"
        );

        return;
      }

      toast.error(
        resultado.error ||
          "No se pudo guardar"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        "No se pudo guardar la categoría"
      );
    } finally {
      setBusy(false);
    }
  };

  const registroNombre =
    register("nombre");

  return (
    <form
      onSubmit={handleSubmit(submit)}
      className="bg-white rounded-xl border border-slate-300 p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold">
        {modo === "crear"
          ? "Nueva categoría"
          : "Editar categoría"}
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {/* NOMBRE */}
        <label className="text-sm font-semibold">
          Nombre

          <input
            {...registroNombre}
            onChange={(event) => {
              registroNombre.onChange(
                event
              );

              setValue(
                "slug",
                generarSlug(
                  event.target.value
                ),
                {
                  shouldValidate: true,
                }
              );
            }}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />

          {errors.nombre && (
            <small className="text-red-500">
              {errors.nombre.message}
            </small>
          )}
        </label>

        {/* SLUG */}
        <label className="text-sm font-semibold">
          Slug

          <input
            {...register("slug")}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />

          {errors.slug && (
            <small className="text-red-500">
              {errors.slug.message}
            </small>
          )}
        </label>

        {/* ORDEN */}
        <label className="text-sm font-semibold">
          Orden en la cinta

          <input
            type="number"
            min="0"
            {...register("orden")}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />

          <small className="block text-slate-400 mt-1">
            El orden también puede
            modificarse desde las
            flechas ↑ ↓ del listado.
          </small>

          {errors.orden && (
            <small className="text-red-500">
              {errors.orden.message}
            </small>
          )}
        </label>

        {/* VISIBLE */}
        <label className="text-sm font-semibold flex items-center gap-3 mt-6">
          <input
            type="checkbox"
            checked={Boolean(visible)}
            onChange={(event) =>
              setValue(
                "visible",
                event.target.checked,
                {
                  shouldDirty: true,
                  shouldValidate: true,
                }
              )
            }
            className="w-5 h-5"
          />

          Visible en la cinta pública
        </label>

        {/* DESCRIPCIÓN */}
        <label className="md:col-span-2 text-sm font-semibold">
          Descripción

          <textarea
            {...register(
              "descripcion"
            )}
            rows={3}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />

          {errors.descripcion && (
            <small className="text-red-500">
              {
                errors.descripcion
                  .message
              }
            </small>
          )}
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={onCancelar}
          disabled={busy}
          className="px-5 py-2.5 border rounded-lg disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-semibold flex gap-2 items-center disabled:opacity-50"
        >
          {busy && (
            <Loader2
              size={16}
              className="animate-spin"
            />
          )}

          {modo === "crear"
            ? "Crear categoría"
            : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}