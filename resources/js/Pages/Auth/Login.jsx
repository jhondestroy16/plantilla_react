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
            <div className="min-h-screen bg-pink-100 flex items-center justify-center px-4 py-8">
                <div className="flex flex-col md:flex-row w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden bg-white">
                    {/* Sección izquierda */}
                    <div className="w-full md:w-1/2 bg-pink-200 flex flex-col items-center justify-center p-10 text-center">
                        <h1 className="text-3xl font-extrabold text-black mb-2">Diana Valencia Eyelashes</h1>
                        <p className="text-sm text-black">Bienvenida a tu espacio de belleza</p>
                        {/* Puedes poner aquí un logo o ilustración */}
                        <img src="/img/marca.png" alt="Logo Diana Valencia" className="w-56 h-auto mt-6 rounded-xl shadow-lg" />
                    </div>

                    {/* Formulario */}
                    <div className="w-full md:w-1/2 bg-white p-8 md:p-10 text-black">
                        <h2 className="text-xl md:text-2xl font-semibold text-center mb-6">INGRESA A TU CUENTA</h2>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <div className="mb-4">
                                <label htmlFor="usuario" className="block mb-1 text-sm font-medium">Usuario:</label>
                                <input
                                    type="text"
                                    id="usuario"
                                    value={data.usuario}
                                    onChange={(e) => setData('usuario', e.target.value)}
                                    placeholder="Escribe tu usuario"
                                    className="w-full px-3 py-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    required
                                />
                                {errors.usuario && <p className="text-red-500 text-sm mt-1">{errors.usuario}</p>}
                            </div>

                            <div className="mb-4">
                                <label htmlFor="password" className="block mb-1 text-sm font-medium">Contraseña:</label>
                                <input
                                    type="password"
                                    id="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Escribe tu contraseña"
                                    className="w-full px-3 py-2 border border-pink-300 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
                                    required
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
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

                            <button type="submit" disabled={processing} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 rounded transition">
                                INGRESAR
                            </button>

                            <div className="mt-4 text-center text-sm">
                                <Link href="/password-reset" className="text-pink-600 underline">¿Olvidaste tu contraseña?</Link>
                            </div>

                            <p className="text-xs text-center text-gray-500 mt-4">© Diana Valencia Eyelashes &copy; {new Date().getFullYear()}</p>
                        </form>
                    </div>
                </div>

                {/* Botón WhatsApp */}
                <a
                    href="https://wa.me/3144170612"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-4 left-4 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full shadow flex items-center font-medium text-sm z-50"
                >
                    <ImWhatsapp className="mr-2" /> Contáctanos
                </a>
            </div>
        </>
    );
}
