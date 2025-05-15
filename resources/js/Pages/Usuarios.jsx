import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Modal from "@/Components/Modal";
import Select from "react-select";
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

export default function Usuarios({ usuarios, auth, roles }) {
    console.log(usuarios);
    const [busqueda, setBusqueda] = useState("");
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        rol: "",
        usuario: "",
        password_confirmation: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("usuarios.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowModal(false);
            },
            onError: () => {
                console.log(errors);
            },
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    // Filtrar usuarios basados en la búsqueda
    const usuariosFiltrados = usuarios?.data?.filter((usuario) =>
        usuario.name.toLowerCase().includes(busqueda.toLowerCase())
    );

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

    const renderPagination = () => (
        <div className="mt-4 flex justify-center space-x-1">
            {usuarios.links.map((link, index) => (
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

    const opcionesRoles = roles.map((rol) => ({
        value: rol.name,
        label: rol.name,
    }));

    const handleDisable = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Desea desactivar este Usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, desactivar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("usuarios.desactivar", id), {
                    onSuccess: () => {
                        showSuccessAlert("Usuario desactivado correctamente");
                    },
                    onError: () => {
                        showErrorAlert("Error al desactivar el Usuario");
                    },
                });
            }
        });
    };
    const handleActive = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "¿Desea activar este Usuario?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, activar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                put(route("usuarios.activar", id), {
                    onSuccess: () => {
                        showSuccessAlert("Usuario activado correctamente");
                    },
                    onError: () => {
                        showErrorAlert("Error al activar el Usuario");
                    },
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Gestión de Usuarios
                </h2>
            }
        >
            <Head title="Usuarios" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
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
                                    onClick={() => setShowModal(true)}
                                    className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <FaPlus />
                                    <span>Nuevo Usuario</span>
                                </button>
                            </div>

                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
                                <table className="min-w-full divide-y divide-gray-300">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Nombre
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Usuario
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Rol
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Opciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {usuariosFiltrados?.map((usuario) => (
                                            <tr key={usuario.id}>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {usuario.name}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {usuario.email}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {usuario.usuario}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    {usuario.nombre_rol}
                                                </td>
                                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                            usuario.estado
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-red-100 text-red-800"
                                                        }`}
                                                    >
                                                        {usuario.estado
                                                            ? "Activo"
                                                            : "Inactivo"}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500 flex space-x-2">
                                                    {usuario.estado ? (
                                                        <button
                                                            title="Desactivar Departamento TTI"
                                                            className="text-red-600 hover:underline"
                                                            onClick={() =>
                                                                handleDisable(
                                                                    usuario.id
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
                                                                    usuario.id
                                                                )
                                                            }
                                                        >
                                                            <FaToggleOff />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            {renderPagination()}
                        </>
                    </div>
                </div>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} maxWidth="lg">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">
                        Registrar Nuevo Usuario
                    </h2>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Nombre Completo"
                                />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="email"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Usuario */}
                            <div>
                                <InputLabel
                                    htmlFor="usuario"
                                    value="Nombre de Usuario"
                                />
                                <TextInput
                                    id="usuario"
                                    type="text"
                                    name="usuario"
                                    value={data.usuario}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("usuario", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.usuario}
                                    className="mt-2"
                                />
                            </div>

                            {/* Rol */}
                            <div>
                                <InputLabel htmlFor="rol" value="Rol" />
                                <Select
                                    id="rol"
                                    name="rol"
                                    options={opcionesRoles}
                                    value={opcionesRoles.find(
                                        (option) => option.value === data.rol
                                    )}
                                    onChange={(selected) =>
                                        setData("rol", selected?.value || "")
                                    }
                                    className="mt-1 block w-full"
                                    classNamePrefix="select"
                                    placeholder="Seleccione un rol"
                                    isClearable
                                    required
                                />
                                <InputError
                                    message={errors.rol}
                                    className="mt-2"
                                />
                            </div>

                            {/* Contraseña */}
                            <div>
                                <InputLabel
                                    htmlFor="password"
                                    value="Contraseña"
                                />
                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Confirmar Contraseña */}
                            <div>
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirmar Contraseña"
                                />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4 pt-4">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition duration-200"
                            >
                                Cancelar
                            </button>
                            <PrimaryButton
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2"
                            >
                                {processing
                                    ? "Registrando..."
                                    : "Registrar Usuario"}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
