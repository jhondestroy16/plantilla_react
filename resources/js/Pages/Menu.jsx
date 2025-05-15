import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Select from "react-select";
import usePermissions from "@/hooks/usePermissions";
import {
    IoHomeOutline,
    IoAccessibilityOutline,
    IoBuildOutline,
    IoLogoTux,
} from "react-icons/io5";
import {
    FaUser,
    FaCog,
    FaChartBar,
    FaDatabase,
    FaBeer,
    FaCoffee,
    FaApple,
    FaPlus,
    FaEdit,
    FaToggleOn,
    FaToggleOff,
} from "react-icons/fa";
import Swal from "sweetalert2";

const availableIcons = [
    {
        name: "IoHomeOutline",
        component: IoHomeOutline,
        icon: <IoHomeOutline className="inline mr-2" />,
    },
    {
        name: "IoAccessibilityOutline",
        component: IoAccessibilityOutline,
        icon: <IoAccessibilityOutline className="inline mr-2" />,
    },
    {
        name: "IoBuildOutline",
        component: IoBuildOutline,
        icon: <IoBuildOutline className="inline mr-2" />,
    },
    {
        name: "IoLogoTux",
        component: IoLogoTux,
        icon: <IoLogoTux className="inline mr-2" />,
    },
    {
        name: "FaUser",
        component: FaUser,
        icon: <FaUser className="inline mr-2" />,
    },
    {
        name: "FaCog",
        component: FaCog,
        icon: <FaCog className="inline mr-2" />,
    },
    {
        name: "FaChartBar",
        component: FaChartBar,
        icon: <FaChartBar className="inline mr-2" />,
    },
    {
        name: "FaDatabase",
        component: FaDatabase,
        icon: <FaDatabase className="inline mr-2" />,
    },
    {
        name: "FaBeer",
        component: FaBeer,
        icon: <FaBeer className="inline mr-2" />,
    },
    {
        name: "FaCoffee",
        component: FaCoffee,
        icon: <FaCoffee className="inline mr-2" />,
    },
    {
        name: "FaApple",
        component: FaApple,
        icon: <FaApple className="inline mr-2" />,
    },
];

export default function Menu({ menus, rutas }) {
    const { can, canAny } = usePermissions();
    const [busqueda, setBusqueda] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    // Verificar permisos al montar el componente
    useEffect(() => {
        if (!canAny(["buscar menu", "crear menu", "editar menu", "eliminar menu"])) {
            Swal.fire({
                title: "Acceso denegado",
                text: "No tienes permisos para acceder a esta sección",
                icon: "error",
                confirmButtonText: "Aceptar",
            }).then(() => {
                router.visit(route('dashboard'));
            });
        }
    }, [canAny]);

    // Si no tiene permisos, no renderizar el contenido completo
    if (!canAny(["buscar menu", "crear menu", "editar menu", "eliminar menu"])) {
        return (
            <AuthenticatedLayout
                header={
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Menú del Sistema
                    </h2>
                }
            >
                <Head title="Menú del Sistema" />
                <div className="py-6">
                    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 text-center text-gray-500">
                                No tienes permisos para ver esta sección
                            </div>
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    // Filter menus based on search term
    const MenuFiltrados = menus.data
        ? menus.data.filter((menu) =>
              menu.nombre.toLowerCase().includes(busqueda.toLowerCase())
          )
        : [];

    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: "",
        componente: null,
        ruta: "",
        menu_padre: null,
        icono: "",
    });

    const iconOptions = availableIcons.map((icon) => ({
        value: icon.name,
        label: (
            <div className="flex items-center">
                {icon.icon}
                <span className="ml-2">{icon.name}</span>
            </div>
        ),
        rawIcon: icon.icon,
    }));

    const showSuccessAlert = (message) => {
        Swal.fire({
            title: "¡Éxito!",
            text: message,
            icon: "success",
            confirmButtonText: "Aceptar",
            timer: 2000,
            timerProgressBar: true,
        });
    };

    const showErrorAlert = (message) => {
        Swal.fire({
            title: "Error",
            text: message,
            icon: "error",
            confirmButtonText: "Aceptar",
        });
    };

    const renderPagination = () => {
        if (!menus.links || menus.links.length <= 1) return null;

        return (
            <div className="mt-4 flex justify-center space-x-1">
                {menus.links.map((link, index) => (
                    <button
                        key={index}
                        disabled={!link.url}
                        onClick={() => link.url && router.visit(link.url)}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1 rounded ${
                            link.active
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-200 hover:bg-gray-300"
                        } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                ))}
            </div>
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const action = editing ? "actualizado" : "creado";
        const successMessage = `Módulo ${action} correctamente`;

        if (editing) {
            put(route("modulos.update", editing.id), {
                onSuccess: () => {
                    showSuccessAlert(successMessage);
                    handleReset();
                },
                onError: (errors) => {
                    showErrorAlert(
                        errors.message || "Error al actualizar el módulo"
                    );
                },
            });
        } else {
            post(route("modulos.store"), {
                onSuccess: () => {
                    showSuccessAlert(successMessage);
                    handleReset();
                },
                onError: (errors) => {
                    showErrorAlert(
                        errors.message || "Error al crear el módulo"
                    );
                },
            });
        }
    };

    const handleEdit = (menu) => {
        setShowForm(true);
        setEditing(menu);
        setData({
            nombre: menu.nombre || "",
            componente: menu.componente || null,
            ruta: menu.ruta || "",
            menu_padre: menu.menu_padre || null,
            icono: menu.icono || "",
        });
    };

    const handleDisable = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Desea desactivar este menú?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("modulos.desactivar", id), {
                    onSuccess: () => {
                        showSuccessAlert("Módulo desactivado correctamente");
                    },
                    onError: () => {
                        showErrorAlert("Error al desactivar el módulo");
                    },
                });
            }
        });
    };

    const handleActive = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Desea activar este menú?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, activar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("modulos.activar", id), {
                    onSuccess: () => {
                        showSuccessAlert("Módulo activado correctamente");
                    },
                    onError: () => {
                        showErrorAlert("Error al activar el módulo");
                    },
                });
            }
        });
    };

    const handleReset = () => {
        setShowForm(false);
        setEditing(null);
        reset();
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Menú del Sistema
                </h2>
            }
        >
            <Head title="Menú del Sistema" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {!showForm ? (
                                <>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="w-full max-w-md">
                                            <input
                                                type="text"
                                                placeholder="Buscar por nombre..."
                                                value={busqueda}
                                                onChange={(e) =>
                                                    setBusqueda(e.target.value)
                                                }
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                            />
                                        </div>
                                        {can("crear menu") && (
                                            <button
                                                onClick={() =>
                                                    setShowForm(true)
                                                }
                                                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                            >
                                                <FaPlus />
                                                Nuevo Módulo
                                            </button>
                                        )}
                                    </div>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nombre
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Componente
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Ruta
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Icono
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Menu Padre
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Estado
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {MenuFiltrados.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan="7"
                                                            className="px-6 py-4 text-center text-gray-500"
                                                        >
                                                            No hay módulos registrados
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    MenuFiltrados.map((menu) => {
                                                        const IconComponent =
                                                            availableIcons.find(
                                                                (icon) =>
                                                                    icon.name ===
                                                                    menu.icono
                                                            )?.icon || null;
                                                        return (
                                                            <tr
                                                                key={menu.id}
                                                                className="hover:bg-gray-50"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {menu.nombre}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {menu.name ??
                                                                        "No Aplica"}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {menu.ruta}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {IconComponent ??
                                                                        "No Aplica"}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {menu.nombre_padre ??
                                                                        "No Aplica"}
                                                                </td>
                                                                <td className="px-4 py-3 text-sm">
                                                                    {menu.estado ? (
                                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                            Activo
                                                                        </span>
                                                                    ) : (
                                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                            Inactivo
                                                                        </span>
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    {can("editar menu") && (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleEdit(
                                                                                    menu
                                                                                )
                                                                            }
                                                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                                        >
                                                                            <FaEdit />
                                                                        </button>
                                                                    )}
                                                                    {menu.estado ? (
                                                                        can("eliminar menu") && (
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleDisable(
                                                                                        menu.id
                                                                                    )
                                                                                }
                                                                                className="text-red-600 hover:underline"
                                                                            >
                                                                                <FaToggleOn />
                                                                            </button>
                                                                        )
                                                                    ) : (
                                                                        can("editar menu") && (
                                                                        <button
                                                                            onClick={() =>
                                                                                handleActive(
                                                                                    menu.id
                                                                                )
                                                                            }
                                                                            className="text-green-600 hover:underline"
                                                                        >
                                                                            <FaToggleOff />
                                                                        </button>
                                                                        )
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                )}
                                            </tbody>
                                        </table>
                                        {renderPagination()}
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">
                                            {editing
                                                ? "Editar Módulo"
                                                : "Crear Nuevo Módulo"}
                                        </h3>
                                        <button
                                            onClick={handleReset}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>

                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label
                                                htmlFor="nombre"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Nombre del Módulo
                                            </label>
                                            <input
                                                type="text"
                                                id="nombre"
                                                value={data.nombre}
                                                onChange={(e) =>
                                                    setData(
                                                        "nombre",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Ej: Dashboard"
                                            />
                                            {errors.nombre && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.nombre}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="componente"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Componente React
                                            </label>
                                            <Select
                                                id="componente"
                                                options={rutas.map((ruta) => ({
                                                    value: ruta.id,
                                                    label: ruta.name,
                                                }))}
                                                value={rutas
                                                    .map((ruta) => ({
                                                        value: ruta.id,
                                                        label: ruta.name,
                                                    }))
                                                    .find(
                                                        (option) =>
                                                            option.value ===
                                                            data.componente
                                                    )}
                                                onChange={(selected) =>
                                                    setData(
                                                        "componente",
                                                        selected?.value || ""
                                                    )
                                                }
                                                isClearable
                                                placeholder="Seleccione un componente"
                                                className="basic-single"
                                                classNamePrefix="select"
                                            />
                                            {errors.componente && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.componente}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="menu_padre"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Menú Padre (opcional)
                                            </label>
                                            <Select
                                                id="menu_padre"
                                                options={[
                                                    ...(menus.data || [])
                                                        .map((menu) => ({
                                                            value: menu.id,
                                                            label: menu.nombre,
                                                        })),
                                                ]}
                                                value={
                                                    data.menu_padre === null
                                                        ? {
                                                              value: null,
                                                              label: "Ninguno",
                                                          }
                                                        : (menus.data || [])
                                                              .filter(
                                                                  (menu) =>
                                                                      !menu.menu_padre
                                                              )
                                                              .map((menu) => ({
                                                                  value: menu.id,
                                                                  label: menu.nombre,
                                                              }))
                                                              .find(
                                                                  (option) =>
                                                                      option.value ===
                                                                      data.menu_padre
                                                              )
                                                }
                                                onChange={(selected) => {
                                                    setData(
                                                        "menu_padre",
                                                        selected?.value || null
                                                    );
                                                }}
                                                isClearable
                                                placeholder="Seleccione un menú padre"
                                                className="basic-single"
                                                classNamePrefix="select"
                                            />
                                            {errors.menu_padre && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.menu_padre}
                                                </p>
                                            )}
                                        </div>

                                        {data.componente == null && (
                                            <div>
                                                <label
                                                    htmlFor="icono"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                >
                                                    Icono
                                                </label>
                                                <Select
                                                    options={iconOptions}
                                                    value={iconOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            data.icono
                                                    )}
                                                    onChange={(selected) =>
                                                        setData(
                                                            "icono",
                                                            selected?.value ||
                                                                ""
                                                        )
                                                    }
                                                    isClearable
                                                    placeholder="Seleccione un icono..."
                                                    className="basic-single"
                                                    classNamePrefix="select"
                                                />
                                                {errors.icono && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.icono}
                                                    </p>
                                                )}
                                                {data.icono && (
                                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                                        <span className="mr-2">
                                                            Vista previa:
                                                        </span>
                                                        {
                                                            availableIcons.find(
                                                                (i) =>
                                                                    i.name ===
                                                                    data.icono
                                                            )?.icon
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {data.menu_padre !== null && (
                                            <div>
                                                <label
                                                    htmlFor="ruta"
                                                    className="block text-sm font-medium text-gray-700 mb-1"
                                                >
                                                    Ruta
                                                </label>
                                                <input
                                                    type="text"
                                                    id="ruta"
                                                    value={data.ruta}
                                                    onChange={(e) =>
                                                        setData(
                                                            "ruta",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                    placeholder="Ej: /dashboard"
                                                />
                                                {errors.ruta && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.ruta}
                                                    </p>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex justify-end space-x-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {processing ? (
                                                    <>
                                                        <svg
                                                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <circle
                                                                className="opacity-25"
                                                                cx="12"
                                                                cy="12"
                                                                r="10"
                                                                stroke="currentColor"
                                                                strokeWidth="4"
                                                            ></circle>
                                                            <path
                                                                className="opacity-75"
                                                                fill="currentColor"
                                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                            ></path>
                                                        </svg>
                                                        Procesando...
                                                    </>
                                                ) : editing ? (
                                                    "Actualizar Módulo"
                                                ) : (
                                                    "Guardar Módulo"
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
