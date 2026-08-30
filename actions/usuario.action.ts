"use server";

import bcrypt from "bcryptjs";
import { z } from "zod";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import {
  exigirAdmin,
  mensajeErrorPermisos,
} from "@/lib/auth";

// =============================================================================
// VALIDACIONES
// =============================================================================

const passwordSchema = z
  .string()
  .min(
    8,
    "La contraseña debe tener al menos 8 caracteres."
  )
  .max(
    72,
    "La contraseña es demasiado larga."
  )
  .regex(
    /[A-Z]/,
    "Debe contener al menos una mayúscula."
  )
  .regex(
    /[a-z]/,
    "Debe contener al menos una minúscula."
  )
  .regex(
    /[0-9]/,
    "Debe contener al menos un número."
  )
  .regex(
    /[^A-Za-z0-9]/,
    "Debe contener al menos un carácter especial."
  );

const rolCreableSchema = z.enum([
  "ADMIN",
  "SUPERVISOR",
  "EDITOR",
]);

const rolOperativoSchema = z.enum([
  "SUPERVISOR",
  "EDITOR",
]);

const datosPersonalesSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(
      2,
      "Ingresa el nombre."
    ),

  apellidos: z
    .string()
    .trim()
    .min(
      2,
      "Ingresa los apellidos."
    ),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email(
      "Ingresa un correo válido."
    ),
});

const usuarioCreableSchema =
  datosPersonalesSchema.extend({
    password:
      passwordSchema,

    rol:
      rolCreableSchema,
  });

// =============================================================================
// TIPOS AUXILIARES
// =============================================================================

interface PrismaError extends Error {
  code: string;
}

const isPrismaError = (
  error: unknown
): error is PrismaError =>
  typeof error === "object" &&
  error !== null &&
  "code" in error;

// =============================================================================
// REVALIDACIÓN
// =============================================================================

function limpiarUsuarios() {
  revalidatePath(
    "/admin/usuarios"
  );

  revalidatePath(
    "/admin"
  );
}

// =============================================================================
// OBTENER USUARIOS
// ADMIN + SUPERVISOR + EDITOR
// =============================================================================

export async function obtenerUsuariosOperativos() {
  try {
    await exigirAdmin();

    const usuarios =
      await prisma.usuario.findMany({
        where: {
          rol: {
            in: [
              "ADMIN",
              "SUPERVISOR",
              "EDITOR",
            ],
          },
        },

        orderBy: [
          {
            rol: "asc",
          },
          {
            createdAt:
              "desc",
          },
        ],

        select: {
          id: true,
          nombre: true,
          apellidos: true,
          email: true,
          rol: true,
          emailVerificado:
            true,
          createdAt: true,
        },
      });

    return {
      success: true,

      data:
        usuarios.map(
          (usuario) => ({
            ...usuario,

            createdAt:
              usuario.createdAt.toISOString(),
          })
        ),
    };
  } catch (error: unknown) {
    const permiso =
      mensajeErrorPermisos(
        error
      );

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    console.error(
      "obtenerUsuariosOperativos:",
      error
    );

    return {
      success: false,
      error:
        "No se pudieron cargar los usuarios.",
    };
  }
}

// =============================================================================
// CREAR USUARIO
// ADMIN PUEDE CREAR ADMIN, SUPERVISOR O EDITOR
// =============================================================================

export async function crearUsuarioOperativo(
  datos: {
    nombre: string;
    apellidos: string;
    email: string;
    password: string;

    rol:
      | "ADMIN"
      | "SUPERVISOR"
      | "EDITOR";
  }
) {
  try {
    await exigirAdmin();

    const validado =
      usuarioCreableSchema.parse(
        datos
      );

    const existente =
      await prisma.usuario.findUnique({
        where: {
          email:
            validado.email,
        },

        select: {
          id: true,
        },
      });

    if (existente) {
      return {
        success: false,
        error:
          "Ya existe un usuario con ese correo.",
      };
    }

    const password =
      await bcrypt.hash(
        validado.password,
        10
      );

    await prisma.usuario.create({
      data: {
        nombre:
          validado.nombre,

        apellidos:
          validado.apellidos,

        email:
          validado.email,

        password,

        rol:
          validado.rol,

        emailVerificado:
          true,

        otp: null,

        otpExpires:
          null,
      },
    });

    limpiarUsuarios();

    return {
      success: true,
    };
  } catch (error: unknown) {
    const permiso =
      mensajeErrorPermisos(
        error
      );

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    if (
      error instanceof
      z.ZodError
    ) {
      return {
        success: false,

        error:
          error.issues[0]
            ?.message ||
          "Datos inválidos.",
      };
    }

    if (
      isPrismaError(
        error
      ) &&
      error.code ===
        "P2002"
    ) {
      return {
        success: false,
        error:
          "Ya existe un usuario con ese correo.",
      };
    }

    console.error(
      "crearUsuarioOperativo:",
      error
    );

    return {
      success: false,
      error:
        "No se pudo crear el usuario.",
    };
  }
}

// =============================================================================
// EDITAR NOMBRE, APELLIDOS Y CORREO
// SOLO ADMIN
//
// Puede editar:
// - ADMIN
// - SUPERVISOR
// - EDITOR
// =============================================================================

export async function actualizarUsuarioGestionado(
  id: string,
  datos: {
    nombre: string;
    apellidos: string;
    email: string;
  }
) {
  try {
    await exigirAdmin();

    const validado =
      datosPersonalesSchema.parse(
        datos
      );

    const usuario =
      await prisma.usuario.findFirst({
        where: {
          id,

          rol: {
            in: [
              "ADMIN",
              "SUPERVISOR",
              "EDITOR",
            ],
          },
        },

        select: {
          id: true,
        },
      });

    if (!usuario) {
      return {
        success: false,
        error:
          "Usuario no encontrado.",
      };
    }

    const correoExistente =
      await prisma.usuario.findFirst({
        where: {
          email:
            validado.email,

          NOT: {
            id,
          },
        },

        select: {
          id: true,
        },
      });

    if (correoExistente) {
      return {
        success: false,
        error:
          "Ya existe otro usuario con ese correo.",
      };
    }

    await prisma.usuario.update({
      where: {
        id,
      },

      data: {
        nombre:
          validado.nombre,

        apellidos:
          validado.apellidos,

        email:
          validado.email,
      },
    });

    limpiarUsuarios();

    return {
      success: true,
    };
  } catch (error: unknown) {
    const permiso =
      mensajeErrorPermisos(
        error
      );

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    if (
      error instanceof
      z.ZodError
    ) {
      return {
        success: false,

        error:
          error.issues[0]
            ?.message ||
          "Datos inválidos.",
      };
    }

    if (
      isPrismaError(
        error
      ) &&
      error.code ===
        "P2002"
    ) {
      return {
        success: false,
        error:
          "Ya existe otro usuario con ese correo.",
      };
    }

    console.error(
      "actualizarUsuarioGestionado:",
      error
    );

    return {
      success: false,
      error:
        "No se pudieron actualizar los datos del usuario.",
    };
  }
}

// =============================================================================
// CAMBIAR ROL OPERATIVO
//
// Se mantiene deliberadamente limitado a:
// SUPERVISOR <-> EDITOR
//
// Un ADMIN no se degrada accidentalmente desde esta pantalla.
// =============================================================================

export async function cambiarRolUsuarioOperativo(
  id: string,
  rol:
    | "SUPERVISOR"
    | "EDITOR"
) {
  try {
    await exigirAdmin();

    const rolValidado =
      rolOperativoSchema.parse(
        rol
      );

    const usuario =
      await prisma.usuario.findFirst({
        where: {
          id,

          rol: {
            in: [
              "SUPERVISOR",
              "EDITOR",
            ],
          },
        },

        select: {
          id: true,
        },
      });

    if (!usuario) {
      return {
        success: false,
        error:
          "El rol de un ADMIN no se cambia desde esta pantalla.",
      };
    }

    await prisma.usuario.update({
      where: {
        id,
      },

      data: {
        rol:
          rolValidado,
      },
    });

    limpiarUsuarios();

    return {
      success: true,
    };
  } catch (error: unknown) {
    const permiso =
      mensajeErrorPermisos(
        error
      );

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    if (
      error instanceof
      z.ZodError
    ) {
      return {
        success: false,
        error:
          "Rol inválido.",
      };
    }

    console.error(
      "cambiarRolUsuarioOperativo:",
      error
    );

    return {
      success: false,
      error:
        "No se pudo cambiar el rol.",
    };
  }
}

// =============================================================================
// CAMBIAR CONTRASEÑA
//
// ADMIN puede restablecer la contraseña de:
// - ADMIN
// - SUPERVISOR
// - EDITOR
// =============================================================================

export async function cambiarPasswordUsuarioOperativo(
  id: string,
  nuevaPassword: string
) {
  try {
    await exigirAdmin();

    const passwordValidada =
      passwordSchema.parse(
        nuevaPassword
      );

    const usuario =
      await prisma.usuario.findFirst({
        where: {
          id,

          rol: {
            in: [
              "ADMIN",
              "SUPERVISOR",
              "EDITOR",
            ],
          },
        },

        select: {
          id: true,
        },
      });

    if (!usuario) {
      return {
        success: false,
        error:
          "Usuario no encontrado.",
      };
    }

    const password =
      await bcrypt.hash(
        passwordValidada,
        10
      );

    await prisma.usuario.update({
      where: {
        id,
      },

      data: {
        password,
      },
    });

    return {
      success: true,
    };
  } catch (error: unknown) {
    const permiso =
      mensajeErrorPermisos(
        error
      );

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    if (
      error instanceof
      z.ZodError
    ) {
      return {
        success: false,

        error:
          error.issues[0]
            ?.message ||
          "Contraseña inválida.",
      };
    }

    console.error(
      "cambiarPasswordUsuarioOperativo:",
      error
    );

    return {
      success: false,
      error:
        "No se pudo cambiar la contraseña.",
    };
  }
}

// =============================================================================
// ELIMINAR ACCESO
//
// Se mantiene únicamente para SUPERVISOR y EDITOR.
// Un ADMIN no puede eliminar otro ADMIN desde esta pantalla.
// =============================================================================

export async function eliminarUsuarioOperativo(
  id: string
) {
  try {
    await exigirAdmin();

    const usuario =
      await prisma.usuario.findUnique({
        where: {
          id,
        },

        select: {
          id: true,
          rol: true,
        },
      });

    if (!usuario) {
      return {
        success: false,
        error:
          "Usuario no encontrado.",
      };
    }

    if (
      usuario.rol ===
      "ADMIN"
    ) {
      return {
        success: false,
        error:
          "No se puede eliminar un ADMIN desde esta pantalla.",
      };
    }

    if (
      ![
        "SUPERVISOR",
        "EDITOR",
      ].includes(
        usuario.rol
      )
    ) {
      return {
        success: false,
        error:
          "Este usuario no puede eliminarse desde esta pantalla.",
      };
    }

    await prisma.usuario.delete({
      where: {
        id,
      },
    });

    limpiarUsuarios();

    return {
      success: true,
    };
  } catch (error: unknown) {
    const permiso =
      mensajeErrorPermisos(
        error
      );

    if (permiso) {
      return {
        success: false,
        error: permiso,
      };
    }

    console.error(
      "eliminarUsuarioOperativo:",
      error
    );

    return {
      success: false,
      error:
        "No se pudo eliminar el acceso.",
    };
  }
}