import { Head, Link, useForm } from '@inertiajs/react';
import { ImWhatsapp } from "react-icons/im";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        usuario: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Iniciar Sesión" />

            <div className="min-h-screen bg-[url('/img/bg-cafe.png')] bg-cover bg-center flex items-center justify-center px-4 py-8">
                <div className="flex flex-col md:flex-row w-full max-w-5xl rounded-xl shadow-xl bg-white/10 backdrop-blur-sm md:backdrop-blur-0 md:bg-transparent">

                    {/* LOGO Y BIENVENIDA */}
                    <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-12 text-white text-center">
                        <img src="/img/logo_cafe.png" alt="Logo" className="w-40 mb-4" />
                        <h1 className="text-3xl font-bold mb-2">WEBCAFFA</h1>
                        <p className="text-sm">Bienvenido a Web Caffa</p>
                        <span className="text-xs mt-2">Taza de café</span>
                    </div>

                    {/* FORMULARIO */}
                    <div className="w-full md:w-1/2 bg-[#3E2723]/90 p-6 md:p-10 rounded-xl text-white">
                        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">INGRESO A TU CUENTA</h2>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-300">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label htmlFor="usuario" className="block mb-1 text-sm">Usuario:</label>
                                <input
                                    type="text"
                                    id="usuario"
                                    value={data.usuario}
                                    onChange={(e) => setData('usuario', e.target.value)}
                                    placeholder="Escribe tu usuario"
                                    className="w-full px-3 py-2 rounded text-black focus:outline-none"
                                    required
                                />
                                {errors.usuario && <p className="text-red-300 text-sm mt-1">{errors.usuario}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block mb-1 text-sm">Contraseña:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Escribe tu contraseña"
                                    className="w-full px-3 py-2 rounded text-black focus:outline-none"
                                    required
                                />
                                {errors.password && <p className="text-red-300 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div className="mb-4 flex items-center">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="mr-2"
                                />
                                <label htmlFor="remember" className="text-sm">Recordarme</label>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-amber-400 hover:bg-amber-500 text-brown-900 font-bold py-2 rounded transition"
                            >
                                INGRESAR
                            </button>

                            <div className="mt-4 text-center text-sm">
                                <Link href="/password-reset" className="underline">Recuperar Contraseña</Link>
                            </div>
                            <p className="text-xs text-center text-gray-300 mt-4">© Web Caffa 2025</p>
                        </form>
                    </div>
                </div>

                {/* WHATSAPP */}
                <a
                    href="https://wa.me/1234567890"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-4 left-4 bg-amber-500 hover:bg-amber-600 text-brown-900 px-4 py-2 rounded-full shadow flex items-center font-medium text-sm"
                >
                    <ImWhatsapp />&nbsp; Contáctanos
                </a>
            </div>
        </>
    );
}
