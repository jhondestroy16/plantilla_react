import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState } from "react";
import Swal from "sweetalert2";

import {
    FaPlus,
    FaToggleOn,
    FaToggleOff,
    FaBoxOpen,
    FaEdit,
} from "react-icons/fa";

export default function RutasVue({ rutas }) {
    const [mostrarFormulario, setMostrarFormulario] = useState(false);
    const [editando, setEditando] = useState(false);
    const [rutaId, setRutaId] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const { data, setData, post, put, processing, errors, reset } = useForm({
        path: "",
        name: "",
        component: "",
        variable: "",
    });

    const RutasFiltrados = (rutas.data || []).filter((ruta) =>
        ruta?.name?.toLowerCase().includes(busqueda.toLowerCase())
    );

    const handleReset = () => {
        reset();
        setMostrarFormulario(false);
        setEditando(false);
        setRutaId(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = editando ? "actualizada" : "creada";
        if (editando && rutaId) {
            put(route("rutas.update", rutaId), {
                onSuccess: () => {
                    Swal.fire(
                        "Éxito",
                        `Ruta ${action} correctamente`,
                        "success"
                    );
                    handleReset();
                },
            });
        } else {
            post(route("rutas.store"), {
                onSuccess: () => {
                    Swal.fire(
                        "Éxito",
                        `Ruta ${action} correctamente`,
                        "success"
                    );
                    handleReset();
                },
            });
        }
    };

    const handleEditar = (ruta) => {
        setEditando(true);
        setRutaId(ruta.id);
        setData({
            path: ruta.path,
            name: ruta.name,
            component: ruta.component,
            variable: ruta.variable ?? "",
        });
        setMostrarFormulario(true);
    };

    const handleDesactivar = (ruta) => {
        Swal.fire({
            title: "¿Desactivar ruta?",
            text: `¿Seguro que deseas desactivar la ruta "${ruta.name}"?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, desactivar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("rutas.desactivar", ruta.id), {
                    onSuccess: () => {
                        Swal.fire("Éxito", "Empresa desactivada", "success");
                    },
                });
            }
        });
    };

    const handleActivar = (ruta) => {
        Swal.fire({
            title: "¿Activar empresa?",
            text: "La empresa volverá a estar disponible",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, activar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("rutas.activar", ruta.id), {
                    onSuccess: () => {
                        Swal.fire(
                            "Activada!",
                            "La empresa ha sido reactivada.",
                            "success"
                        );
                    },
                    onError: () => {
                        Swal.fire(
                            "Error",
                            "No se pudo activar la empresa",
                            "error"
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

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestión de Rutas React
                </h2>
            }
        >
            <Head title="Rutas React" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        {mostrarFormulario ? (
                            <>
                                <h3 className="text-lg font-semibold mb-4">
                                    {editando
                                        ? "Editar Ruta"
                                        : "Registrar Ruta"}
                                </h3>
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-4"
                                >
                                    <div>
                                        <label
                                            htmlFor="path"
                                            className="block text-sm font-medium"
                                        >
                                            Ruta
                                        </label>
                                        <input
                                            id="path"
                                            type="text"
                                            value={data.path}
                                            onChange={(e) =>
                                                setData("path", e.target.value)
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        />
                                        {errors.path && (
                                            <p className="text-sm text-red-600">
                                                {errors.path}
                                            </p>
                                        )}
                                    </div>

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

                                    <div>
                                        <label
                                            htmlFor="component"
                                            className="block text-sm font-medium"
                                        >
                                            Componente
                                        </label>
                                        <input
                                            id="component"
                                            type="text"
                                            value={data.component}
                                            onChange={(e) =>
                                                setData(
                                                    "component",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        />
                                        {errors.component && (
                                            <p className="text-sm text-red-600">
                                                {errors.component}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="variable"
                                            className="block text-sm font-medium"
                                        >
                                            Variable (opcional)
                                        </label>
                                        <input
                                            id="variable"
                                            type="text"
                                            value={data.variable}
                                            onChange={(e) =>
                                                setData(
                                                    "variable",
                                                    e.target.value
                                                )
                                            }
                                            className="mt-1 block w-full border-gray-300 rounded-md"
                                        />
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
                                            placeholder="Buscar ruta..."
                                            value={busqueda}
                                            onChange={(e) =>
                                                setBusqueda(e.target.value)
                                            }
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                        />
                                    </div>
                                    <button
                                        onClick={() =>
                                            setMostrarFormulario(true)
                                        }
                                        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                    >
                                        <FaPlus />
                                        Nueva Ruta
                                    </button>
                                </div>
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr className="bg-gray-100 text-left">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Path
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nombre
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Componente
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Variable
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {RutasFiltrados.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="px-4 py-2 text-gray-500"
                                                    >
                                                        No hay rutas
                                                        registradas.
                                                    </td>
                                                </tr>
                                            ) : (
                                                RutasFiltrados.map((ruta) => (
                                                    <tr key={ruta.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {ruta.path}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {ruta.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {ruta.component}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {ruta.variable}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            <button
                                                                onClick={() =>
                                                                    handleEditar(
                                                                        ruta
                                                                    )
                                                                }
                                                                className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    ruta.estado
                                                                        ? handleDesactivar(
                                                                              ruta
                                                                          )
                                                                        : handleActivar(
                                                                              ruta
                                                                          )
                                                                }
                                                                className={
                                                                    ruta.estado
                                                                        ? "text-red-600 hover:text-red-900"
                                                                        : "text-green-600 hover:text-green-900"
                                                                }
                                                                title={
                                                                    ruta.estado
                                                                        ? "Desactivar"
                                                                        : "Activar"
                                                                }
                                                            >
                                                                {ruta.estado ? (
                                                                    <FaToggleOn />
                                                                ) : (
                                                                    <FaToggleOff />
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Paginación */}
                                <div className="mt-4 flex justify-center">
                                    {rutas.links?.map((link, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                link.url &&
                                                router.visit(link.url)
                                            }
                                            className={`px-3 py-1 mx-1 rounded ${
                                                link.active
                                                    ? "bg-blue-500 text-white"
                                                    : "bg-gray-200"
                                            }`}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
