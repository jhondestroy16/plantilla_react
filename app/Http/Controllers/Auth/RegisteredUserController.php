<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function index(Request $request)
    {
        $usuario = User::join('model_has_roles', 'model_has_roles.model_id', 'users.id')
            ->join('roles', 'roles.id', 'model_has_roles.role_id')
            ->select('roles.name as nombre_rol', 'users.name', 'email', 'usuario', 'users.estado', 'users.id')
            ->paginate(10);
        $roles = Role::where('estado', true)->get();

        return Inertia::render('Usuarios', [
            'usuarios' => $usuario,
            'roles' => $roles
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Auth/Register');
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'usuario' => 'required|string|lowercase|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'usuario' => $request->usuario,
            'password' => Hash::make($request->password),
        ]);

        $user->assignRole($request->rol);

        return redirect(route('usuarios'));
    }

    public function activar(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');

        $User = User::findOrFail($id);
        $User->estado = true;
        $User->save();

        return redirect(route('usuarios'));
    }
    public function desactivar(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');

        $User = User::findOrFail($id);
        $User->estado = false;
        $User->save();

        return redirect(route('usuarios'));
    }
}
