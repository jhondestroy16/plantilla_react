<?php

namespace App\Http\Controllers;

use App\Models\DepartamentoTTI;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DepartamentoTTIController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        $departamentos = DepartamentoTTI::paginate(10);

        return Inertia::render('DepartamentoTTI', [
            'departamentos' => $departamentos
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        $request->validate([
            'nombre' => 'required|string|max:255',
            'nit' => 'required|max:20',
            'direccion' => 'required|string|max:100',
            'telefono' => 'max:10',
            'dependencia' => 'required|string|max:100',
            'url_produccion' => 'required|string|max:100',
            'url_db' => 'required|string|max:100',
            'url_logo' => 'required|string|max:100'
        ]);

        DepartamentoTTI::create([
            'nombre' => $request->nombre,
            'nit' => $request->nit,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'dependencia' => $request->dependencia,
            'url_produccion' => $request->url_produccion,
            'nombre_db' => $request->url_db,
            'url_logo' => $request->url_logo,
        ]);

        return redirect()->route('departamentos');
    }

    public function update(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');

        $request->validate([
            'nombre' => 'required|string|max:255',
            'nit' => 'required|max:20',
            'direccion' => 'required|string|max:100',
            'telefono' => 'max:10',
            'dependencia' => 'required|string|max:100',
            'url_produccion' => 'required|string|max:100',
            'url_db' => 'required|string|max:100',
            'url_logo' => 'required|string|max:100'
        ]);

        $departamento = DepartamentoTTI::findOrFail($id);


        $departamento->update([
            'nombre' => $request->nombre,
            'nit' => $request->nit,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
            'dependencia' => $request->dependencia,
            'url_produccion' => $request->url_produccion,
            'nombre_db' => $request->url_db,
            'url_logo' => $request->url_logo,
        ]);

        return redirect()->route('departamentos');
    }

    public function desactivar(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');

        $departamento = DepartamentoTTI::findOrFail($id);
        $departamento->estado = false;
        $departamento->save();

        return redirect()->route('departamentos');
    }
    public function activar(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');

        $departamento = DepartamentoTTI::findOrFail($id);
        $departamento->estado = true;
        $departamento->save();

        return redirect()->route('departamentos');
    }
}
