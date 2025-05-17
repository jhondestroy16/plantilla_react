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
        if (!$request->ajax()) return redirect('/');

        $servicios = Servicio::paginate(10);

        return Inertia::render('Servicios', [
            'servicios' => $servicios,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|string|max:255',
            'precio' => 'required',
        ]);

        $menu = Servicio::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'precio' => $request->precio,
        ]);

        return redirect()->route('servicios');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id)
    {
        //
    }
}
