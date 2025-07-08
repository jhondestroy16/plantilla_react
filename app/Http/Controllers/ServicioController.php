<?php

namespace App\Http\Controllers;

use App\Models\Servicio;
use Illuminate\Http\Request;
use Inertia\Controller;
use Inertia\Inertia;

class ServicioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $servicios = Servicio::orderBy('id', 'desc')->paginate(10);

        return Inertia::render('Servicios', [
            'servicios' => $servicios,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string|max:255',
            'duracion' => 'required',
            'precio' => 'required',
        ]);

        $menu = Servicio::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'duracion' => $request->duracion,
            'precio' => $request->precio,
        ]);

        return redirect()->route('servicios');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|max:255',
            'duracion' => 'required',
            'precio' => 'required|max:10'
        ]);
        $producto = Servicio::findOrFail($id);

        $producto->update([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'duracion' => $request->duracion,
            'precio' => $request->precio
        ]);

        return redirect()->route('servicios');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function desactivar(Request $request, $id)
    {
        $empresa = Servicio::findOrFail($id);
        $empresa->estado = false;
        $empresa->save();

        return redirect()->route('servicios');
    }
    public function activar(Request $request, $id)
    {
        $empresa = Servicio::findOrFail($id);
        $empresa->estado = true;
        $empresa->save();

        return redirect()->route('servicios');
    }
}
