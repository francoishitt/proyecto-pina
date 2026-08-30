"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";
import Image from "next/image";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { Toaster } from "sonner";

import {
  LayoutDashboard,
  BookOpen,
  FolderTree,
  ListTree,
  CircleUser,
  PanelLeft,
  PanelLeftClose,
  Menu,
  X,
  LogOut,
  User as UserIcon,
  Users,
  Settings,
  Video,
} from "lucide-react";

import { cerrarSesion } from "@/actions/auth.action";

// =============================================================================
// TIPOS
// =============================================================================

interface UsuarioInicial {
  nombre: string;
  apellidos: string;
  email: string;
  rol: string;
}

// =============================================================================
// COMPONENTE
// =============================================================================

export default function AdminClientLayout({
  children,
  usuarioInicial,
}: {
  children: React.ReactNode;
  usuarioInicial: UsuarioInicial;
}) {
  const [
    isSidebarOpen,
    setIsSidebarOpen,
  ] = useState<
    boolean | null
  >(null);

  const [
    isProfileOpen,
    setIsProfileOpen,
  ] = useState(false);

  const pathname =
    usePathname();

  const router =
    useRouter();

  const profileRef =
    useRef<HTMLDivElement>(
      null
    );

  // ===========================================================================
  // SIDEBAR RESPONSIVO
  // ===========================================================================

  useEffect(() => {
    const handleResize =
      () =>
        setIsSidebarOpen(
          window.innerWidth >=
            768
        );

    handleResize();

    window.addEventListener(
      "resize",
      handleResize
    );

    return () =>
      window.removeEventListener(
        "resize",
        handleResize
      );
  }, []);

  // ===========================================================================
  // CERRAR PERFIL AL HACER CLIC FUERA
  // ===========================================================================

  useEffect(() => {
    const handleClickOutside =
      (
        event: MouseEvent
      ) => {
        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target as Node
          )
        ) {
          setIsProfileOpen(
            false
          );
        }
      };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  // ===========================================================================
  // ESTADO ACTIVO
  // ===========================================================================

  const isActive = (
    ruta: string
  ) => {
    if (
      ruta === "/admin"
    ) {
      return (
        pathname ===
        "/admin"
      );
    }

    return pathname.startsWith(
      ruta
    );
  };

  // ===========================================================================
  // LOGOUT
  // ===========================================================================

  const handleLogout =
    async () => {
      await cerrarSesion();

      router.push(
        "/login"
      );

      router.refresh();
    };

  // ===========================================================================
  // CARGA
  // ===========================================================================

  if (
    isSidebarOpen === null
  ) {
    return (
      <div className="flex h-screen bg-slate-100 items-center justify-center">
        <div className="animate-pulse text-slate-500 font-medium">
          Cargando panel...
        </div>
      </div>
    );
  }

  // ===========================================================================
  // ROLES
  // ===========================================================================

  const esAdmin =
    usuarioInicial.rol ===
    "ADMIN";

  const esSupervisor =
    usuarioInicial.rol ===
    "SUPERVISOR";

  // ADMIN y SUPERVISOR pueden entrar
  // a Categorías.
  //
  // ADMIN:
  // - CRUD
  // - orden
  //
  // SUPERVISOR:
  // - solo orden
  const puedeOrdenarCategorias =
    esAdmin ||
    esSupervisor;

  const toggleSidebar =
    () =>
      setIsSidebarOpen(
        (prev) => !prev
      );

  const iniciales =
    `${usuarioInicial.nombre.charAt(
      0
    )}${usuarioInicial.apellidos.charAt(
      0
    )}`.toUpperCase();

  // ===========================================================================
  // MENÚ
  // ===========================================================================

  const links = [
    {
      href: "/admin",
      label: "Panel",
      icon:
        LayoutDashboard,
      visible: true,
    },

    {
      href:
        "/admin/cursos",
      label: "Materiales",
      icon: BookOpen,
      visible: true,
    },

    {
      href:
        "/admin/categorias",
      label: "Categorías",
      icon: FolderTree,
      visible:
        puedeOrdenarCategorias,
    },

    {
      href:
        "/admin/subcategorias",
      label:
        "Subcategorías",
      icon: ListTree,
      visible: esAdmin,
    },

    {
      href:
        "/admin/configuracion",
      label:
        "Configuración web",
      icon: Settings,
      visible: esAdmin,
    },

    {
      href:
        "/admin/videos",
      label:
        "Videos y redes",
      icon: Video,
      visible: esAdmin,
    },

    {
      href:
        "/admin/usuarios",
      label: "Usuarios",
      icon: Users,
      visible: esAdmin,
    },

    {
      href:
        "/admin/perfil",
      label: "Perfil",
      icon: CircleUser,
      visible: true,
    },
  ].filter(
    (link) =>
      link.visible
  );

  // ===========================================================================
  // UI
  // ===========================================================================

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800 overflow-hidden">
      <Toaster
        position="top-right"
        richColors
      />

      {/* SIDEBAR */}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* LOGO */}

        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link
            href="/admin"
            className="block transition-transform hover:scale-105"
          >
            <div className="bg-white px-3 py-2 rounded-xl shadow-sm">
              <Image
                src="/log-pina.webp"
                alt="Logo Proyecto Piña"
                width={
                  160
                }
                height={
                  60
                }
                className="w-auto h-10 object-contain"
                priority
              />
            </div>
          </Link>

          <button
            className="md:hidden text-slate-400 hover:text-white shrink-0 ml-2"
            onClick={
              toggleSidebar
            }
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ROL */}

        <div className="px-5 pt-4">
          <span className="inline-flex rounded-full bg-slate-800 border border-slate-700 px-3 py-1 text-[10px] font-bold tracking-wider text-orange-400">
            {esAdmin
              ? "ADMINISTRADOR"
              : esSupervisor
                ? "SUPERVISOR"
                : "EDITOR"}
          </span>
        </div>

        {/* NAVEGACIÓN */}

        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(
            (link) => {
              const Icono =
                link.icon;

              const activo =
                isActive(
                  link.href
                );

              return (
                <Link
                  key={
                    link.href
                  }
                  href={
                    link.href
                  }
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition text-sm font-medium ${
                    activo
                      ? "bg-orange-600 text-white shadow-md shadow-orange-900/20"
                      : "hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <Icono
                    className={`w-4 h-4 ${
                      activo
                        ? "text-white"
                        : "text-orange-500"
                    }`}
                  />

                  {
                    link.label
                  }
                </Link>
              );
            }
          )}
        </nav>
      </aside>

      {/* OVERLAY MÓVIL */}

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={
            toggleSidebar
          }
        />
      )}

      {/* CONTENIDO */}

      <div
        className={`flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ${
          isSidebarOpen
            ? "md:ml-64"
            : "ml-0"
        }`}
      >
        {/* HEADER */}

        <header className="bg-white border-b border-slate-200 flex items-center justify-between px-4 py-3 shrink-0 h-[64px] shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={
                toggleSidebar
              }
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              aria-label="Alternar menú"
            >
              <span className="hidden md:block">
                {isSidebarOpen ? (
                  <PanelLeftClose className="w-5 h-5" />
                ) : (
                  <PanelLeft className="w-5 h-5" />
                )}
              </span>

              <span className="md:hidden">
                {isSidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </span>
            </button>

            <div>
              <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">
                Administración
              </h2>

              <p className="text-[11px] text-slate-400 hidden md:block">
                {esAdmin
                  ? "Control total del sistema"
                  : esSupervisor
                    ? "Gestión de materiales y orden de categorías"
                    : "Carga y edición de materiales"}
              </p>
            </div>
          </div>

          {/* PERFIL */}

          <div className="flex items-center gap-4">
            <div
              className="relative"
              ref={
                profileRef
              }
            >
              <button
                onClick={() =>
                  setIsProfileOpen(
                    !isProfileOpen
                  )
                }
                className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 text-slate-100 border-2 border-slate-200 hover:border-orange-500 hover:shadow-md transition cursor-pointer font-semibold tracking-wider text-sm"
                aria-label="Abrir perfil"
              >
                {iniciales ? (
                  iniciales
                ) : (
                  <UserIcon className="w-5 h-5" />
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {`${usuarioInicial.nombre} ${usuarioInicial.apellidos}`.trim() ||
                        usuarioInicial.email}
                    </p>

                    <p className="text-xs text-slate-500 truncate">
                      {
                        usuarioInicial.email
                      }
                    </p>

                    <p className="text-[10px] font-bold text-orange-600 mt-1">
                      {
                        usuarioInicial.rol
                      }
                    </p>
                  </div>

                  <Link
                    href="/admin/perfil"
                    onClick={() =>
                      setIsProfileOpen(
                        false
                      )
                    }
                    className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                  >
                    <CircleUser className="w-4 h-4 text-slate-400" />

                    Mi Perfil
                  </Link>

                  <button
                    onClick={
                      handleLogout
                    }
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />

                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PÁGINA */}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-50">
          {children}
        </main>
      </div>
    </div>
  );
}