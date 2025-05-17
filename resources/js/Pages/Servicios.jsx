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
    const ServiciosFiltrados = (servicios.data || []).filter((servicio) =>
        servicio?.nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );
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
                                <button className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
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
                                                        {servicio.precio}
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

                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
