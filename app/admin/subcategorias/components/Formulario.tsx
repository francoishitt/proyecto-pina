"use client";

import {
  useEffect,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import {
  subcategoriaSchema,
  SubcategoriaFormData,
} from "@/lib/validations/subcategoria.schema";

import {
  crearSubcategoria,
  actualizarSubcategoria,
} from "@/actions/subcategoria.action";

import type {
  SubcategoriaConRelaciones,
  CategoriaOption,
} from "../types";

interface Props {
  modo: "crear" | "editar";

  subcategoria:
    | SubcategoriaConRelaciones
    | null;

  categorias: CategoriaOption[];

  onGuardado: () => void;

  onCancelar: () => void;
}

type SubcategoriaFormInput =
  z.input<
    typeof subcategoriaSchema
  >;

function generarSlug(
  texto: string
) {
  return texto
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      ""
    )
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(
      /[^a-z0-9-]/g,
      ""
    );
}

export default function Formulario({
  modo,
  subcategoria,
  categorias,
  onGuardado: _onGuardado,
  onCancelar,
}: Props) {
  const [busy, setBusy] =
    useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: {
      errors,
    },
  } = useForm<
    SubcategoriaFormInput,
    unknown,
    SubcategoriaFormData
  >({
    resolver:
      zodResolver(
        subcategoriaSchema
      ),

    defaultValues: {
      nombre:
        subcategoria?.nombre ||
        "",

      slug:
        subcategoria?.slug ||
        "",

      categoriaId:
        subcategoria?.categoriaId ||
        "",

      orden:
        subcategoria?.orden ??
        0,

      visible:
        subcategoria?.visible ??
        true,
    },
  });

  useEffect(() => {
    reset({
      nombre:
        subcategoria?.nombre ||
        "",

      slug:
        subcategoria?.slug ||
        "",

      categoriaId:
        subcategoria?.categoriaId ||
        "",

      orden:
        subcategoria?.orden ??
        0,

      visible:
        subcategoria?.visible ??
        true,
    });
  }, [
    subcategoria,
    reset,
  ]);

  const visible =
    watch("visible");

  const submit = async (
    data: SubcategoriaFormData
  ) => {
    setBusy(true);

    const fd =
      new FormData();

    fd.append(
      "nombre",
      data.nombre
    );

    fd.append(
      "slug",
      data.slug
    );

    fd.append(
      "categoriaId",
      data.categoriaId
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
          ? await crearSubcategoria(
              fd
            )
          : await actualizarSubcategoria(
              subcategoria!.id,
              fd
            );

      if (
        resultado.success
      ) {
        toast.success(
          "Cambios guardados correctamente"
        );

        window.location.assign(
          "/admin/subcategorias?guardado=1"
        );

        return;
      }

      toast.error(
        resultado.error ||
          "No se pudo guardar"
      );
    } catch (error) {
      console.error(
        error
      );

      toast.error(
        "No se pudo guardar la subcategoría"
      );
    } finally {
      setBusy(false);
    }
  };

  const registroNombre =
    register("nombre");

  return (
    <form
      onSubmit={
        handleSubmit(
          submit
        )
      }
      className="bg-white rounded-xl border border-slate-300 p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold">
        {modo === "crear"
          ? "Nueva subcategoría"
          : "Editar subcategoría"}
      </h2>

      <div className="grid md:grid-cols-2 gap-5">
        {/* NOMBRE */}

        <label className="text-sm font-semibold">
          Nombre

          <input
            {...registroNombre}
            onChange={(
              event
            ) => {
              registroNombre.onChange(
                event
              );

              setValue(
                "slug",
                generarSlug(
                  event.target
                    .value
                ),
                {
                  shouldValidate:
                    true,
                }
              );
            }}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />

          {errors.nombre && (
            <small className="text-red-500">
              {
                errors.nombre
                  .message
              }
            </small>
          )}
        </label>

        {/* SLUG */}

        <label className="text-sm font-semibold">
          Slug

          <input
            {...register(
              "slug"
            )}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />

          {errors.slug && (
            <small className="text-red-500">
              {
                errors.slug
                  .message
              }
            </small>
          )}
        </label>

        {/* CATEGORÍA PADRE */}

        <label className="text-sm font-semibold">
          Categoría padre

          <select
            {...register(
              "categoriaId"
            )}
            className="mt-1 w-full border rounded-lg px-3 py-2 bg-white"
          >
            <option value="">
              Seleccionar
            </option>

            {categorias.map(
              (categoria) => (
                <option
                  key={
                    categoria.id
                  }
                  value={
                    categoria.id
                  }
                >
                  {
                    categoria.nombre
                  }
                </option>
              )
            )}
          </select>

          {errors.categoriaId && (
            <small className="text-red-500">
              {
                errors
                  .categoriaId
                  .message
              }
            </small>
          )}
        </label>

        {/* ORDEN */}

        <label className="text-sm font-semibold">
          Orden

          <input
            type="number"
            min="0"
            {...register(
              "orden"
            )}
            className="mt-1 w-full border rounded-lg px-3 py-2"
          />

          {errors.orden && (
            <small className="text-red-500">
              {
                errors.orden
                  .message
              }
            </small>
          )}
        </label>

        {/* VISIBLE */}

        <label className="md:col-span-2 text-sm font-semibold flex gap-3 items-center">
          <input
            type="checkbox"
            checked={Boolean(
              visible
            )}
            onChange={(
              event
            ) =>
              setValue(
                "visible",
                event.target
                  .checked,
                {
                  shouldDirty:
                    true,
                  shouldValidate:
                    true,
                }
              )
            }
            className="w-5 h-5"
          />

          Visible en el menú
          público
        </label>
      </div>

      <div className="flex justify-end gap-3 border-t pt-4">
        <button
          type="button"
          onClick={
            onCancelar
          }
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
            ? "Crear subcategoría"
            : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}