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
} from "react-icons/fa";
import usePermissions from "@/hooks/usePermissions";

export default function Empresa({
    empresas = { data: [], links: [] },
    auth,
    productos: initialProductos = [],
}) {
    // Estados
    const [busqueda, setBusqueda] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [showProducts, setShowProducts] = useState(false);
    const [empresaProductos, setEmpresaProductos] = useState([]);
    const [currentEmpresa, setCurrentEmpresa] = useState(null);
    const [loading, setLoading] = useState(false);
    const { can, canAny } = usePermissions();

    // Datos filtrados
    const EmpresasFiltrados = (empresas.data || []).filter((empresa) =>
        empresa?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );
    // Formulario
    const { data, setData, post, put, processing, errors, reset } = useForm({
        nombre: "",
        nit: "",
        direccion: "",
        telefono: "",
        producto: [],
    });

    const renderPagination = () => (
        <div className="mt-4 flex justify-center space-x-1">
            {empresas.links.map((link, index) => (
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

    // Reset al desmontar
    useEffect(() => {
        return () => reset();
    }, []);

    // Funciones CRUD
    const handleEdit = (empresa) => {
        setShowForm(true);
        setEditing(empresa);
        setData({
            nombre: empresa.nombre,
            nit: empresa.nit,
            direccion: empresa.direccion,
            telefono: empresa.telefono,
            producto: empresa.productos?.map((p) => p.id) || [],
        });
    };

    const handleReset = () => {
        setShowForm(false);
        setEditing(null);
        reset();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const action = editing ? "actualizada" : "creada";

        if (editing) {
            put(route("empresas.update", editing.id), {
                onSuccess: () => {
                    Swal.fire(
                        "Éxito",
                        `Empresa ${action} correctamente`,
                        "success"
                    );
                    handleReset();
                },
                onError: () => {
                    Swal.fire("Error", "Ocurrió un problema", "error");
                },
            });
        } else {
            post(route("empresas.store"), {
                onSuccess: () => {
                    Swal.fire(
                        "Éxito",
                        `Empresa ${action} correctamente`,
                        "success"
                    );
                    handleReset();
                },
                onError: () => {
                    Swal.fire("Error", "Ocurrió un problema", "error");
                },
            });
        }
    };

    const handleDisable = (id) => {
        Swal.fire({
            title: "¿Desactivar empresa?",
            text: "Esta acción puede revertirse",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, desactivar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("empresas.desactivar", id), {
                    onSuccess: () => {
                        Swal.fire("Éxito", "Empresa desactivada", "success");
                    },
                });
            }
        });
    };

    const handleActive = (id) => {
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
                put(route("empresas.activar", id), {
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

    const handleShowProducts = async (id) => {
        setLoading(true);
        setCurrentEmpresa(id);

        try {
            const response = await axios.get(
                route("empresas.productos", { id: id }),
                {
                    headers: {
                        "X-Requested-With": "XMLHttpRequest",
                    },
                }
            );

            const productosData = response.data.productos.data || [];
            setEmpresaProductos(productosData);
            setShowProducts(true);
        } catch (error) {
            Swal.fire("Error", "No se pudieron cargar los productos", "error");
            console.error("Error detallado:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    {showProducts
                        ? `Productos de ${currentEmpresa?.nombre || "Empresa"}`
                        : "Gestión de Empresas"}
                </h2>
            }
        >
            <Head title={showProducts ? "Productos" : "Empresas"} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {showProducts ? (
                                <div className="space-y-4">
                                    <button
                                        onClick={() => {
                                            setShowProducts(false);
                                            setEmpresaProductos([]);
                                        }}
                                        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
                                    >
                                        <FaArrowLeft className="mr-2" />
                                        Volver a empresas
                                    </button>
                                    <p>{empresaProductos.map}</p>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        N°
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Producto
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {empresaProductos.length > 0 ? (
                                                    empresaProductos.map(
                                                        (item, index) => (
                                                            <tr key={index}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {index + 1}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {
                                                                        item.nombre_producto
                                                                    }
                                                                </td>
                                                            </tr>
                                                        )
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan="2"
                                                            className="px-6 py-4 text-center text-sm text-gray-500"
                                                        >
                                                            No se encontraron
                                                            productos
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : showForm ? (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold">
                                            {editing
                                                ? "Editar Empresa"
                                                : "Nueva Empresa"}
                                        </h3>
                                    </div>
                                    <form
                                        onSubmit={handleSubmit}
                                        className="space-y-4"
                                    >
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Nombre
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nombre}
                                                onChange={(e) =>
                                                    setData(
                                                        "nombre",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            {errors.nombre && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.nombre}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                NIT
                                            </label>
                                            <input
                                                type="text"
                                                value={data.nit}
                                                onChange={(e) =>
                                                    setData(
                                                        "nit",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            {errors.nit && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.nit}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Dirección
                                            </label>
                                            <input
                                                type="text"
                                                value={data.direccion}
                                                onChange={(e) =>
                                                    setData(
                                                        "direccion",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            {errors.direccion && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.direccion}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Teléfono
                                            </label>
                                            <input
                                                type="text"
                                                value={data.telefono}
                                                onChange={(e) =>
                                                    setData(
                                                        "telefono",
                                                        e.target.value
                                                    )
                                                }
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                            />
                                            {errors.telefono && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.telefono}
                                                </p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Productos
                                            </label>
                                            <Select
                                                options={initialProductos.map(
                                                    (p) => ({
                                                        value: p.id,
                                                        label: p.nombre,
                                                    })
                                                )}
                                                placeholder="Seleccione Productos"
                                                isMulti
                                                value={initialProductos
                                                    .filter(
                                                        (p) =>
                                                            editing?.productos?.some(
                                                                (prod) =>
                                                                    prod.id ===
                                                                    p.id
                                                            ) ||
                                                            data.producto.includes(
                                                                p.id
                                                            )
                                                    )
                                                    .map((p) => ({
                                                        value: p.id,
                                                        label: p.nombre,
                                                    }))}
                                                onChange={(options) =>
                                                    setData(
                                                        "producto",
                                                        options.map(
                                                            (o) => o.value
                                                        )
                                                    )
                                                }
                                                className="mt-1"
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={handleReset}
                                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                            >
                                                Cancelar
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                            >
                                                {processing
                                                    ? "Procesando..."
                                                    : editing
                                                    ? "Actualizar"
                                                    : "Guardar"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
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
                                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                            />
                                        </div>
                                        {can("crear empresas") && (
                                            <button
                                                onClick={() =>
                                                    setShowForm(true)
                                                }
                                                className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                            >
                                                <FaPlus />
                                                Nueva Empresa
                                            </button>
                                        )}
                                    </div>

                                    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                        <table className="min-w-full divide-y divide-gray-300">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Nombre
                                                    </th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        NIT
                                                    </th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Dirección
                                                    </th>
                                                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Teléfono
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
                                                {EmpresasFiltrados.map(
                                                    (empresa) => (
                                                        <tr key={empresa.id}>
                                                            <td className="px-3 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                {empresa.nombre}
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {empresa.nit}
                                                            </td>
                                                            <td className="px-3 py-4 text-sm text-gray-500">
                                                                {
                                                                    empresa.direccion
                                                                }
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {
                                                                    empresa.telefono
                                                                }
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap">
                                                                <span
                                                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                        empresa.estado
                                                                            ? "bg-green-100 text-green-800"
                                                                            : "bg-red-100 text-red-800"
                                                                    }`}
                                                                >
                                                                    {empresa.estado
                                                                        ? "Activo"
                                                                        : "Inactivo"}
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                                                                {can("editar empresa") && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleEdit(
                                                                                empresa
                                                                            )
                                                                        }
                                                                        className="text-blue-600 hover:text-blue-900"
                                                                        title="Editar"
                                                                    >
                                                                        <FaEdit />
                                                                    </button>
                                                                )}
                                                                {can("editar empresa") && (
                                                                    <button
                                                                        onClick={() =>
                                                                            empresa.estado
                                                                                ? handleDisable(
                                                                                      empresa.id
                                                                                  )
                                                                                : handleActive(
                                                                                      empresa.id
                                                                                  )
                                                                        }
                                                                        className={
                                                                            empresa.estado
                                                                                ? "text-red-600 hover:text-red-900"
                                                                                : "text-green-600 hover:text-green-900"
                                                                        }
                                                                        title={
                                                                            empresa.estado
                                                                                ? "Desactivar"
                                                                                : "Activar"
                                                                        }
                                                                    >
                                                                        {empresa.estado ? (
                                                                            <FaToggleOn />
                                                                        ) : (
                                                                            <FaToggleOff />
                                                                        )}
                                                                    </button>
                                                                )}
                                                                {can("buscar empresa") && (
                                                                    <button
                                                                        onClick={() =>
                                                                            handleShowProducts(
                                                                                empresa.id
                                                                            )
                                                                        }
                                                                        disabled={
                                                                            loading
                                                                        }
                                                                        className="text-purple-600 hover:text-purple-900 disabled:opacity-50"
                                                                        title="Ver productos"
                                                                    >
                                                                        <FaBoxOpen />
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {EmpresasFiltrados.length > 0 &&
                                        renderPagination()}
                                    {EmpresasFiltrados.length === 0 && (
                                        <div className="text-center py-4 text-gray-500">
                                            No hay empresas registradas
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
