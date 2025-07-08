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

export default function Servicios({ servicios }) {
    const [busqueda, setBusqueda] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const ServiciosFiltrados = (servicios.data || []).filter((servicio) =>
        servicio?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );
    const renderPagination = () => {
        if (!servicios.links || servicios.links.length <= 1) return null;

        return (
            <div className="mt-4 flex justify-center space-x-1">
                {servicios.links.map((link, index) => (
                    <button
                        key={index}
                        disabled={!link.url}
                        onClick={() => link.url && router.visit(link.url)}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1 rounded ${link.active
                            ? "bg-indigo-600 text-white"
                            : "bg-gray-200 hover:bg-gray-300"
                            } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                    />
                ))}
            </div>
        );
    };

    const formatoPesosColombianos = new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
        minimumFractionDigits: 0, // Para quitar los decimales
    });
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
    const handlePrecioChange = (e) => {
        const raw = e.target.value.replace(/\D/g, ""); // quitar todo lo que no sea número
        const number = parseInt(raw || "0", 10);

        const formatted = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(number);

        setData({
            ...data,
            precio: raw,
            precioFormat: formatted,
        });
    };
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: "",
        descripcion: "",
        precio: "",
        duracion: "",
    });
    const handleReset = () => {
        setShowForm(false);
        setEditing(null);
        reset();
    };
    const handleEdit = (servicio) => {
        const precioNumerico = parseInt(servicio.precio || 0, 10);

        const precioFormateado = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            minimumFractionDigits: 0,
        }).format(precioNumerico);

        setShowForm(true);
        setEditing(servicio);
        setData({
            nombre: servicio.nombre || "",
            descripcion: servicio.descripcion || "",
            precio: servicio.precio || "", // valor real, útil para enviar
            duracion: servicio.duracion || "", // valor real, útil para enviar
            precioFormat: precioFormateado, // valor formateado para mostrar
        });
    };
    const handleSubmit = (e) => {
        e.preventDefault();

        const action = editing ? "actualizado" : "creado";
        const successMessage = `Servicio ${action} correctamente`;

        const precioNumerico = parseInt(
            data.precioFormat.replace(/\D/g, ""),
            10
        );

        const payload = {
            nombre: data.nombre,
            descripcion: data.descripcion,
            precio: precioNumerico,
        };

        if (editing) {
            put(route("servicios.update", editing.id), {
                data: payload,
                onSuccess: () => {
                    showSuccessAlert(successMessage);
                    handleReset();
                },
                onError: (errors) => {
                    showErrorAlert(
                        errors.message || "Error al actualizar el Servicio"
                    );
                },
            });
        } else {
            post(route("servicios.store"), {
                data: payload,
                onSuccess: () => {
                    showSuccessAlert(successMessage);
                    handleReset();
                },
                onError: (errors) => {
                    showErrorAlert(
                        errors.message || "Error al crear el Servicio"
                    );
                },
            });
        }
    };
    const handleDisable = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Desea desactivar este servicio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("servicios.desactivar", id), {
                    onSuccess: () => {
                        showSuccessAlert("Servicio Desactivada Correctamente");
                    },
                    onError: () => {
                        showErrorAlert("Error al desactivar el Servicio");
                    },
                });
            }
        });
    };
    const handleActive = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Desea activar este servicio?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, activar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("servicios.activar", id), {
                    onSuccess: () => {
                        showSuccessAlert("Servicio Activado Correctamente");
                        handleReset();
                    },
                    onError: () => {
                        showErrorAlert("Error al activar el Servicio");
                    },
                });
            }
        });
    };
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestión de Servicios
                </h2>
            }
        >
            <Head title="Servicios" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        {!showForm ? (
                            <>
                                <div className="flex justify-between items-center mb-6">
                                    <div className="w-full max-w-md">
                                        <input
                                            type="text"
                                            placeholder="Buscar servicio..."
                                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                            value={busqueda}
                                            onChange={(e) =>
                                                setBusqueda(e.target.value)
                                            }
                                        />
                                    </div>
                                    <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors" onClick={() => setShowForm(true)}>
                                        <FaPlus />
                                        Nuevo Servicio
                                    </button>
                                </div>
                                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-300">
                                        <thead className="bg-gray-50">
                                            <tr className="bg-gray-100 text-left">
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nombre
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Descripcion
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Duración
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Precio
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Estado
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Acciones
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ServiciosFiltrados.length === 0 ? (
                                                <tr>
                                                    <td colSpan="5" className="px-4 py-2 text-gray-500 text-center">
                                                        No hay servicios registradas.
                                                    </td>
                                                </tr>
                                            ) : (
                                                ServiciosFiltrados.map((servicio) => (
                                                    <tr key={servicio.id}>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                            {servicio.nombre}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {servicio.descripcion}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {servicio.duracion}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatoPesosColombianos.format(
                                                                servicio.precio
                                                            )}
                                                        </td>
                                                        <td className="px-4 py-3 text-sm">
                                                            {servicio.estado ? (
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
                                                            <button
                                                                title="Editar Producto"
                                                                className="text-blue-600 hover:text-blue-900 mr-3"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        servicio
                                                                    )
                                                                }
                                                            >
                                                                <FaEdit />
                                                            </button>
                                                            {servicio.estado ? (
                                                                <button
                                                                    title="Desactivar Producto"
                                                                    className="text-red-600 hover:underline"
                                                                    onClick={() =>
                                                                        handleDisable(
                                                                            servicio.id
                                                                        )
                                                                    }
                                                                >
                                                                    <FaToggleOn />
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    title="Activar Producto"
                                                                    className="text-green-600 hover:underline"
                                                                    onClick={() =>
                                                                        handleActive(
                                                                            servicio.id
                                                                        )
                                                                    }
                                                                >
                                                                    <FaToggleOff />
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                {renderPagination()}
                            </>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">
                                        {editing
                                            ? "Editar Servicio"
                                            : "Crear Nuevo Servicio"}
                                    </h3>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                            Nombre del Servicio
                                        </label>
                                        <input
                                            type="text"
                                            id="nombre"
                                            value={data.nombre}
                                            onChange={(e) => setData("nombre", e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Ej: Retoques"
                                        />
                                        {errors.nombre && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.nombre}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                                            Descripción del Servicio
                                        </label>
                                        <input
                                            type="text"
                                            id="descripcion"
                                            value={data.descripcion}
                                            onChange={(e) => setData("descripcion", e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Ej: Retoques"
                                        />
                                        {errors.descripcion && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.descripcion}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="duracion" className="block text-sm font-medium text-gray-700 mb-1">
                                            Duración del Servicio
                                        </label>
                                        <input
                                            type="text"
                                            id="duracion"
                                            value={data.duracion}
                                            onChange={(e) => setData("duracion", e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Ej: Retoques"
                                        />
                                        {errors.duracion && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.duracion}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="precio" className="block text-sm font-medium text-gray-700 mb-1">
                                            Precio del Producto
                                        </label>
                                        <input
                                            type="text"
                                            id="precio"
                                            value={data.precioFormat}
                                            onChange={handlePrecioChange}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            placeholder="Ej: $5.000"
                                        />
                                        {errors.precio && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.precio}
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
                                                "Actualizar Servicio"
                                            ) : (
                                                "Guardar Servicio"
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
