<?php

namespace App\Http\Controllers;

use App\Models\Producto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redis;
use Inertia\Inertia;

class ProductoController extends Controller
{
    public function index(Request $request)
    {

        $productos = Producto::orderBy('id', 'asc')->paginate(10);

        return Inertia::render('Productos', [
            'productos' => $productos,
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->ajax())
            return redirect('/');

        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|max:255',
            'precio' => 'required|max:10'
        ]);

        Producto::create([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'precio' => $request->precio
        ]);

        return redirect()->route('productos');
    }

    public function update(Request $request, $id)
    {
        if (!$request->ajax())
            return redirect('/');

        $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'required|max:255',
            'precio' => 'required|max:10'
        ]);
        $producto = Producto::findOrFail($id);

        $producto->update([
            'nombre' => $request->nombre,
            'descripcion' => $request->descripcion,
            'precio' => $request->precio
        ]);

        return redirect()->route('productos');
    }

    public function desactivar(Request $request, $id)
    {
        if (!$request->ajax())
            return redirect('/');
        $empresa = Producto::findOrFail($id);
        $empresa->estado = false;
        $empresa->save();

        return redirect()->route('productos');
    }
    public function activar(Request $request, $id)
    {
        if (!$request->ajax())
            return redirect('/');
        $empresa = Producto::findOrFail($id);
        $empresa->estado = true;
        $empresa->save();

        return redirect()->route('productos');
    }
}
