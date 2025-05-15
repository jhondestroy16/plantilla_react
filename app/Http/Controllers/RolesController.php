<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RolesController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $roles = Role::paginate(10);

        return Inertia::render('Roles', [
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $request->validate([
            'name' => 'required|string|max:191'
        ]);

        Role::create([
            'name' => $request->name,
            'guard_name' => 'web',
        ]);

        return redirect()->route('roles');
    }

    public function update(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $request->validate([
            'name' => 'required|string|max:191'
        ]);
        $rol = Role::findOrFail($id);
        $rol->update([
            'name' => $request->name
        ]);

        return redirect()->route('roles');
    }

    public function delete(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $rol = Role::findOrFail($id);
        $rol->estado = false;
        $rol->save();

        return redirect()->route('roles');
    }
    public function activar(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $rol = Role::findOrFail($id);
        $rol->estado = true;
        $rol->save();

        return redirect()->route('roles');
    }
}
