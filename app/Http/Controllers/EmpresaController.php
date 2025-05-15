<?php

namespace App\Http\Controllers;

use App\Models\Empresa;
use App\Models\EmpresaProducto;
use App\Models\Producto;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EmpresaController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        $empresas = Empresa::with('productos')->orderBy('id', 'asc')->paginate(10);
        $productos = Producto::where('estado', true)->get();
        return Inertia::render('Empresa', [
            'empresas' => $empresas,
            'productos' => $productos,
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
        ]);

        $empresa = Empresa::create([
            'nombre' => $request->nombre,
            'nit' => $request->nit,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
        ]);
        if(count($request->producto) > 0){
            foreach ($request->producto as $producto) {

                $empresa_producto = new EmpresaProducto();
                $empresa_producto->id_empresa = $empresa->id;
                $empresa_producto->id_producto = $producto;
                $empresa_producto->save();
            }
        }

        return redirect()->route('empresas');
    }

    public function update(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $request->validate([
            'nombre' => 'required|string|max:255',
            'nit' => 'required|max:20',
            'direccion' => 'required|string|max:100',
            'telefono' => 'max:20',
        ]);
        $empresa = Empresa::findOrFail($id);

        $empresa->update([
            'nombre' => $request->nombre,
            'nit' => $request->nit,
            'direccion' => $request->direccion,
            'telefono' => $request->telefono,
        ]);
        $empresas_productos = EmpresaProducto::where('id_empresa', $id)->get();
        if(count($empresas_productos) > 0){
            foreach($empresas_productos as $e_producto){
                $e_producto->delete();
            }
        }
        foreach ($request->producto as $producto) {
            $empresa_producto = new EmpresaProducto();
            $empresa_producto->id_empresa = $id;
            $empresa_producto->id_producto = $producto;
            $empresa_producto->save();
        }

        return redirect()->route('empresas');
    }

    public function productosEmpresas(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $productos = EmpresaProducto::join('productos', 'productos.id', 'empresa_productos.id_producto')
            ->join('empresas', 'empresas.id', 'empresa_productos.id_empresa')
            ->select('empresas.nombre as nombre_empresa', 'productos.nombre as nombre_producto','productos.id')
            ->where('empresas.id', $id)
            ->paginate(10);

        return response()->json([
            'productos' => $productos
        ]);
    }

    public function desactivar(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $empresa = Empresa::findOrFail($id);
        $empresa->estado = false;
        $empresa->save();

        return redirect()->route('empresas');
    }

    public function activar(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $empresa = Empresa::findOrFail($id);
        $empresa->estado = true;
        $empresa->save();

        return redirect()->route('empresas');
    }
}
