<?php

namespace App\Http\Controllers;

use App\Models\Rutas;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RutasController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        $rutas = Rutas::paginate(10);

        return Inertia::render('Rutas', [
            'rutas' => $rutas,
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $request->validate([
            'path' => 'required|string|max:191',
            'name' => 'required|string|max:191',
            'component' => 'required|string|max:191',
            'variable' => 'nullable|string|max:191',
        ]);

        Rutas::create([
            'path' => "/{$request->path}",
            'name' => $request->name,
            'component' => $request->component,
            'variable' => $request->variable
        ]);

        return redirect()->route('rutas');
    }

    public function update(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $menu = Rutas::findOrFail($id);
        $request->validate([
            'path' => 'required|string|max:191',
            'name' => 'required|string|max:191',
            'component' => 'required|string|max:191',
            'variable' => 'nullable|string|max:191',
        ]);

        $menu->update([
            'path' => $request->path,
            'name' => $request->name,
            'component' => $request->component,
            'variable' => $request->variable
        ]);

        return redirect()->route('rutas');
    }

    public function delete(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $modulo = Rutas::findOrFail($id);
        $modulo->estado = false;
        $modulo->save();

        return redirect()->route('rutas');
    }

    public function activar(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $modulo = Rutas::findOrFail($id);
        $modulo->estado = true;
        $modulo->save();

        return redirect()->route('rutas');
    }
}
