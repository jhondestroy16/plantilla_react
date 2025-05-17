import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";
import Sidebar from "@/Layouts/Sidebar";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar para desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <Sidebar user={user} />
            </div>

            {/* Sidebar móvil */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                    <div className="fixed inset-y-0 left-0 z-40 w-64">
                        <Sidebar
                            user={user}
                            closeSidebar={() => setSidebarOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Contenido principal */}
            <div className="flex flex-1 flex-col lg:pl-64">
                {/* Navbar superior */}
                <nav className="border-b border-pink-300 bg-[#ec4899]">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between items-center">
                            {/* Botón para abrir sidebar en mobile */}
                            <div className="flex items-center lg:hidden">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-pink-400 hover:text-black focus:outline-none"
                                >
                                    <span className="sr-only">Abrir sidebar</span>
                                    <svg
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 6h16M4 12h16M4 18h16"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Logo en mobile */}
                            <div className="flex shrink-0 items-center lg:hidden">
                                <Link href="/">
                                    <img
                                        src="/img/marca.png"
                                        alt="Logo"
                                        className="h-12 w-auto bg-[#ec4899] p-1 rounded"
                                    />
                                </Link>
                            </div>
                            {/* Menú de usuario */}
                            <div className="ml-auto flex items-center">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md border border-transparent bg-[#ec4899] px-3 py-2 text-sm font-medium leading-4 text-black transition duration-150 ease-in-out hover:text-white focus:outline-none"
                                            >
                                                {user.name}
                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link href={route("profile.edit")}>
                                            Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route("logout")} method="post" as="button">
                                            Cerrar Sesión
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Header */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* Contenido principal */}
                <main className="flex-1 overflow-y-auto">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="bg-white border-t border-gray-200 text-center py-4 text-sm text-gray-500">
                    &copy; {new Date().getFullYear()} Diana Valencia Eyelashes. Todos los derechos reservados.
                </footer>
            </div>
        </div>
    );
}
