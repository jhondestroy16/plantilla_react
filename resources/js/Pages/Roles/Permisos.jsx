import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function Permisos({ rol, menus, permisosAsignados }) {
    // Convertimos a array seguro y normalizamos
    const safePermissions = Array.isArray(permisosAsignados)
        ? permisosAsignados.map((p) => String(p).trim().toLowerCase())
        : [];

    // Usamos useState para manejar la lista de permisos de manera local
    const [permisos, setPermisos] = useState([...safePermissions]);

    // Usamos useForm para manejar el envío del formulario
    const { post, processing } = useForm();

    // Manejar el cambio en los checkboxes
    const handleCheckbox = (permiso) => {
        const normalizedPerm = String(permiso).trim().toLowerCase();
        setPermisos((prev) => {
            if (prev.includes(normalizedPerm)) {
                // Si el permiso ya está en el array, lo quitamos
                return prev.filter((p) => p !== normalizedPerm);
            } else {
                // Si no está en el array, lo agregamos
                return [...prev, normalizedPerm];
            }
        });
    };
    // Enviar el formulario con los permisos
    const handleSubmit = (e) => {
        e.preventDefault();

        // Enviar la solicitud con axios
        axios
            .post(route("roles.permisos.asignar", rol.id), {
                permisos: permisos,
            })
            .then((response) => {
                // Si la solicitud es exitosa
                Swal.fire({
                    title: "¡Éxito!",
                    text: "Los permisos se asignaron correctamente",
                    icon: "success",
                    confirmButtonText: "Aceptar",
                }).then(() => {
                    // Redirigir a la página de roles
                });
            })
            .catch((error) => {
                // Si la solicitud falla
                Swal.fire({
                    title: "Error",
                    text:
                        error.response?.data?.message ||
                        "Ocurrió un error al asignar los permisos",
                    icon: "error",
                    confirmButtonText: "Entendido",
                });
            });
    };

    // Verificar si un permiso está seleccionado
    const isChecked = (permiso) => {
        return permisos.includes(String(permiso).trim().toLowerCase());
    };

    // Sincronizamos el estado local con los permisos asignados cuando cambian
    useEffect(() => {
        setPermisos([...safePermissions]);
    }, [permisosAsignados]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestión de Roles
                </h2>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                            <h2 className="text-lg font-semibold mb-4">
                                Permisos del rol:{" "}
                                <span className="text-indigo-600">
                                    {rol.name}
                                </span>
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th>Menú</th>
                                            <th>Crear</th>
                                            <th>Editar</th>
                                            <th>Eliminar</th>
                                            <th>Buscar</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {menus?.map((menu) => {
                                            const base = String(menu.nombre)
                                                .toLowerCase()
                                                .trim();
                                            return (
                                                <tr key={menu.id}>
                                                    <td className="text-center">
                                                        {menu.nombre}
                                                    </td>
                                                    {[
                                                        "crear",
                                                        "editar",
                                                        "eliminar",
                                                        "buscar",
                                                    ].map((action) => {
                                                        const permiso = `${action} ${base}`;
                                                        return (
                                                            <td
                                                                key={`${menu.id}-${action}`}
                                                                className="text-center"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={isChecked(
                                                                        permiso
                                                                    )}
                                                                    onChange={() =>
                                                                        handleCheckbox(
                                                                            permiso
                                                                        )
                                                                    }
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                                />
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Botones con margen para un mejor espaciado */}
                            <div className="flex justify-between mt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-indigo-600 text-white px-6 py-3 rounded disabled:opacity-50 hover:bg-indigo-700 transition"
                                >
                                    {processing
                                        ? "Guardando..."
                                        : "Guardar Permisos"}
                                </button>

                                {/* Botón de Volver */}
                                <button
                                    type="button"
                                    onClick={() => window.history.back()}
                                    className="bg-gray-300 text-black px-6 py-3 rounded hover:bg-gray-400 transition"
                                >
                                    Volver
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
