import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";
import {
    FaPlus,
    FaArrowLeft,
    FaEdit,
    FaToggleOn,
    FaToggleOff,
    FaBoxOpen,
    FaBriefcase,
} from "react-icons/fa";

export default function Roles({ roles }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(false);
    const [rutaId, setRutaId] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editando && rutaId) {
            put(route("roles.update", rutaId), {
                onSuccess: () => {
                    Swal.fire(
                        "Éxito",
                        "Rol Actualizado Correctamente.",
                        "success"
                    );
                    reset();
                    setMostrarFormulario(false);
                    setEditando(false);
                    setRutaId(null);
                },
            });
        } else {
            post(route("roles.store"), {
                onSuccess: () => {
                    Swal.fire("Éxito", "Rol Creado Correctamente.", "success");
                    reset();
                    setMostrarFormulario(false);
                },
            });
        }
    };

    const handleEditar = (ruta) => {
        setEditando(true);
        setRutaId(ruta.id);
        setData({
            name: ruta.name,
        });
        setMostrarFormulario(true);
    };

    const handleDesactivar = (ruta) => {
        Swal.fire({
            title: "¿Esta Seguro?",
            text: `¿Desactivar el rol "${ruta.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("roles.desactivar", ruta.id), {
                    ...ruta,
                    estado: false,
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire(
                            "Éxito",
                            "Rol Desactivado Exitosamente.",
                            "success"
                        );
                    },
                });
            }
        });
    };

    const handleActivar = (ruta) => {
        Swal.fire({
            title: "¿Esta Seguro?",
            text: `¿Activar el rol "${ruta.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, Activar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("roles.activar", ruta.id), {
                    ...ruta,
                    estado: false,
                    preserveScroll: true,
                    onSuccess: () => {
                        Swal.fire(
                            "Éxito",
                            "Rol Activado Exitosamente.",
                            "success"
                        );
                    },
                });
            }
        });
    };

    const cancelar = () => {
        reset();
        setMostrarFormulario(false);
        setEditando(false);
        setRutaId(null);
    };

    const renderPagination = () => (
        <div className="mt-4 flex justify-center space-x-1">
            {roles.links.map((link, index) => (
                <button
                    key={index}
                    disabled={!link.url}
                    onClick={() => link.url && router.visit(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1 rounded ${
                        link.active
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                    }`}
                />
            ))}
        </div>
    );

    const rolesFiltrados = roles.data.filter((rol) =>
        rol.name.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestión de Roles
                </h2>
            }
        >
            <Head title="Roles" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        {mostrarFormulario ? (
                            <>
                                <h3 className="text-lg font-semibold mb-4">
                                    {editando ? "Editar Rol" : "Registrar Rol"}
                                </h3>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="name"
                                            className="block text-sm font-medium"
                                        >
                                            Nombre
                                        </label>
                                        <input
                                            id="name"
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        />
                                        {errors.name && (
                                            <p className="text-sm text-red-600">
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                        >
                                            {editando
                                                ? "Actualizar"
                                                : "Guardar"}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={cancelar}
                                            className="text-gray-500 hover:text-gray-800"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
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
                                            className="w-full px-4 py-2 border rounded-md"
                                        />
                                    </div>
                                    <button
                                        onClick={() =>
                                            setMostrarFormulario(true)
                                        }
                                        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <FaPlus />
                                        Nuevo Rol
                                    </button>
                                </div>

                                {/* Buscador */}

                                {/* Tabla */}
                                <table className="min-w-full border border-gray-200">
                                    <thead>
                                        <tr className="bg-gray-100 text-left">
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nombre
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Opciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rolesFiltrados.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan="3"
                                                    className="px-4 py-2 text-gray-500"
                                                >
                                                    No hay roles registrados.
                                                </td>
                                            </tr>
                                        ) : (
                                            rolesFiltrados.map((ruta) => (
                                                <tr key={ruta.id}>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {ruta.name}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap">
                                                        {ruta.estado ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                                Activo
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                                Inactivo
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                                                        <button
                                                            onClick={() =>
                                                                handleEditar(
                                                                    ruta
                                                                )
                                                            }
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        {ruta.estado ? (
                                                            <button
                                                                onClick={() =>
                                                                    handleDesactivar(
                                                                        ruta
                                                                    )
                                                                }
                                                                className="text-red-600 hover:underline"
                                                            >
                                                                <FaToggleOn />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() =>
                                                                    handleActivar(
                                                                        ruta
                                                                    )
                                                                }
                                                                className="text-red-600 hover:underline"
                                                            >
                                                                <FaToggleOff />
                                                            </button>
                                                        )}

                                                        <button
                                                            onClick={() =>
                                                                router.visit(
                                                                    route(
                                                                        "roles.edit",
                                                                        ruta.id
                                                                    )
                                                                )
                                                            }
                                                            className="text-indigo-600 hover:underline"
                                                        >
                                                            <FaBriefcase />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>

                                {/* Paginación siempre visible */}
                                {renderPagination()}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
