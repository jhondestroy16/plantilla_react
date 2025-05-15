import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import {
    FaPlus,
    FaArrowLeft,
    FaEdit,
    FaToggleOn,
    FaToggleOff,
    FaBoxOpen,
    FaBackspace,
} from "react-icons/fa";
import usePermissions from "@/hooks/usePermissions";

export default function DepartamentoTTI({ departamentos, auth }) {
    const [busqueda, setBusqueda] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const DepartamentosFiltrados = departamentos.data.filter((departamento) =>
        departamento.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
    const renderPagination = () => (
        <div className="mt-4 flex justify-center space-x-1">
            {departamentos.links.map((link, index) => (
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
    const limpiar = () => {
        setData({
            nombre: "",
            nit: "",
            telefono: "",
            direccion: "",
            dependencia: "",
            url_produccion: "",
            url_db: "",
            url_logo: "",
        });
    };
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: "",
        nit: "",
        telefono: "",
        direccion: "",
        dependencia: "",
        url_produccion: "",
        url_db: "",
        url_logo: "",
    });
    const handleReset = () => {
        setShowForm(false);
        setEditing(null);
        limpiar();
    };
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
    const handleSubmit = (e) => {
        e.preventDefault();

        const payload = {
            nombre: data.nombre,
            nit: data.nit,
            telefono: data.telefono,
            direccion: data.direccion,
            dependencia: data.dependencia,
            url_produccion: data.url_produccion,
            url_db: data.url_db,
            url_logo: data.url_logo,
        };

        const action = editing ? "Actualizado" : "Creado";
        const successMessage = `Departamento ${action} Correctamente`;

        if (editing) {
            put(route("departamentos.update", editing.id), {
                data: payload,
                onSuccess: () => {
                    showSuccessAlert(successMessage);
                    handleReset();
                },
                onError: (errors) => {
                    showErrorAlert(
                        errors.message || "Error al actualizar el departamento."
                    );
                },
            });
        } else {
            post(route("departamentos.store"), {
                data: payload,
                onSuccess: () => {
                    showSuccessAlert(successMessage);
                    handleReset();
                },
                onError: (errors) => {
                    showErrorAlert(
                        errors.message || "Error al crear el departamento."
                    );
                },
            });
        }
    };
    const handleEdit = (departamento) => {
        setShowForm(true);
        setEditing(departamento);
        setData({
            nombre: departamento.nombre,
            nit: departamento.nit,
            telefono: departamento.telefono,
            direccion: departamento.direccion,
            dependencia: departamento.dependencia,
            url_produccion: departamento.url_produccion,
            url_db: departamento.nombre_db,
            url_logo: departamento.url_logo,
        });
    };
    const handleDisable = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Desea desactivar este departamento TTI?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("departamentos.desactivar", id), {
                    onSuccess: () => {
                        showSuccessAlert(
                            "Departamento TTI desactivado correctamente"
                        );
                    },
                    onError: () => {
                        showErrorAlert("Error al desactivar el Departamento");
                    },
                });
            }
        });
    };
    const handleActive = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Desea activar este departamento TTI?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, activar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("departamentos.activar", id), {
                    onSuccess: () => {
                        showSuccessAlert(
                            "Departamento TTI activado correctamente"
                        );
                        handleReset();
                    },
                    onError: () => {
                        showErrorAlert("Error al activar el Departamento");
                    },
                });
            }
        });
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Listado de Departamentos TTI
                </h2>
            }
        >
            <Head title="Departamentos" />
            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                                                className="w-full px-4 py-2 border rounded-md"
                                            />
                                        </div>
                                        <button
                                            onClick={() => setShowForm(true)}
                                            className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                        >
                                            <FaPlus />
                                            Nuevo Departamento TTI
                                        </button>
                                    </div>
                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-100">
                                                <tr>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nombre
                                                    </th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Url Producción
                                                    </th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Logo
                                                    </th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nombre DB
                                                    </th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Estado
                                                    </th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Acciones
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {DepartamentosFiltrados.map(
                                                    (departamento) => (
                                                        <tr
                                                            key={
                                                                departamento.id
                                                            }
                                                        >
                                                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {
                                                                    departamento.nombre
                                                                }
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {
                                                                    departamento.url_produccion
                                                                }
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {
                                                                    departamento.url_logo
                                                                }
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {
                                                                    departamento.nombre_db
                                                                }
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                        departamento.estado
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-red-100 text-red-800"
                                                                    }`}
                                                                >
                                                                    {departamento.estado
                                                                        ? "Activo"
                                                                        : "Inactivo"}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <button
                                                                    title="Editar Departamento"
                                                                    className="text-blue-600 hover:text-blue-900 mr-3"
                                                                    onClick={() =>
                                                                        handleEdit(
                                                                            departamento
                                                                        )
                                                                    }
                                                                >
                                                                    <FaEdit />
                                                                </button>
                                                                {departamento.estado ? (
                                                                    <button
                                                                        title="Desactivar Departamento TTI"
                                                                        className="text-red-600 hover:underline"
                                                                        onClick={() =>
                                                                            handleDisable(
                                                                                departamento.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <FaToggleOn />
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        title="Activar Departamento TTI"
                                                                        className="text-green-600 hover:underline"
                                                                        onClick={() =>
                                                                            handleActive(
                                                                                departamento.id
                                                                            )
                                                                        }
                                                                    >
                                                                        <FaToggleOff />
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    {DepartamentosFiltrados.length > 0 &&
                                        renderPagination()}
                                    {DepartamentosFiltrados.length === 0 && (
                                        <div className="text-center py-4 text-gray-500">
                                            No hay departamentos registrados
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">
                                            {editing
                                                ? "Editar Departamento TTI"
                                                : "Crear Nuevo Departamento TTI"}
                                        </h3>
                                        <button
                                            onClick={handleReset}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <FaBackspace />
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
                                                Nombre del Departamento
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
                                                placeholder="Ej: Cundinamarca TTI"
                                            />
                                            {errors.nombre && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.nombre}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="nit"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                NIT
                                            </label>
                                            <input
                                                type="text"
                                                id="nit"
                                                value={data.nit}
                                                onChange={(e) =>
                                                    setData(
                                                        "nit",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Ej: 123456789-1"
                                            />
                                            {errors.nit && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.nit}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="telefono"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Telefono
                                            </label>
                                            <input
                                                type="text"
                                                id="telefono"
                                                value={data.telefono}
                                                onChange={(e) =>
                                                    setData(
                                                        "telefono",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Ej: 123456789"
                                            />
                                            {errors.telefono && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.telefono}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="direccion"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                id="direccion"
                                                value={data.direccion}
                                                onChange={(e) =>
                                                    setData(
                                                        "direccion",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Ej: Calle Falsa 123"
                                            />
                                            {errors.direccion && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.direccion}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="dependencia"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Dependencia
                                            </label>
                                            <input
                                                type="text"
                                                id="dependencia"
                                                value={data.dependencia}
                                                onChange={(e) =>
                                                    setData(
                                                        "dependencia",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Ej: Desarrollo"
                                            />
                                            {errors.dependencia && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.dependencia}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="url_produccion"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Url Producción
                                            </label>
                                            <input
                                                type="text"
                                                id="url_produccion"
                                                value={data.url_produccion}
                                                onChange={(e) =>
                                                    setData(
                                                        "url_produccion",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Ej: http://127.0.0.1:8000"
                                            />
                                            {errors.url_produccion && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.url_produccion}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="url_db"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Url Base de Datos
                                            </label>
                                            <input
                                                type="text"
                                                id="url_db"
                                                value={data.url_db}
                                                onChange={(e) =>
                                                    setData(
                                                        "url_db",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Ej: prueba_db"
                                            />
                                            {errors.url_db && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.url_db}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="url_logo"
                                                className="block text-sm font-medium text-gray-700 mb-1"
                                            >
                                                Logo
                                            </label>
                                            <input
                                                type="text"
                                                id="url_logo"
                                                value={data.url_logo}
                                                onChange={(e) =>
                                                    setData(
                                                        "url_logo",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                placeholder="Ej: logo"
                                            />
                                            {errors.url_logo && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.url_logo}
                                                </p>
                                            )}
                                        </div>
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
                                                    "Actualizar Departamento"
                                                ) : (
                                                    "Guardar Departamento"
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
