<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\Rutas;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class MenuController extends Controller
{
    public function index(Request $request)
    {
        if (!$request->ajax()) return redirect('/');

        $menus = Menu::leftjoin('rutas_react', 'rutas_react.id', 'menu.componente')
            ->leftjoin('menu as m', 'm.id', 'menu.menu_padre')
            ->select('menu.id', 'menu.nombre', 'name', 'menu.ruta', 'menu.componente', 'menu.menu_padre', 'menu.icono', 'menu.estado', 'm.nombre as nombre_padre')
            ->paginate(20);
        $rutas = Rutas::all();
        return Inertia::render('Menu', [
            'menus' => $menus,
            'rutas' => $rutas
        ]);
    }

    public function store(Request $request)
    {
        if (!$request->ajax()) return redirect('/');
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);
        $ruta = ($request->ruta != null) ? $request->ruta : 'dashboard';

        $menu = Menu::create([
            'nombre' => $request->nombre,
            'componente' => $request->componente,
            'icono' => preg_replace("/[^a-zA-Z0-9\s]/", "", $request->icono),
            'menu_padre' => $request->menu_padre,
            'ruta' => $ruta,
            'orden' => 1,
        ]);

        $acciones = ['crear', 'editar', 'eliminar', 'buscar'];
        $permisosIds = [];

        foreach ($acciones as $accion) {
            $permiso = strtolower($accion . ' ' . $menu->nombre);
            $permission = Permission::firstOrCreate(['name' => $permiso]);
            $permisosIds[] = $permission->id;
        }

        // Asociar los permisos con el menú en la tabla pivot
        $menu->permisos()->sync($permisosIds);

        $admin = Role::where('name', 'Super Administrador')->first();
        if ($admin) {
            $permisos = Permission::whereIn('name', array_map(function ($accion) use ($menu) {
                return strtolower($accion . ' ' . $menu->nombre);
            }, $acciones))->get();

            $admin->syncPermissions($admin->permissions->merge($permisos));
        }

        return redirect()->route('menu');
    }

    public function update(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $request->validate([
            'nombre' => 'required|string|max:255',
        ]);

        $menu = Menu::findOrFail($id);

        $menu->update([
            'nombre' => $request->nombre,
            'componente' => $request->componente,
            'ruta' => $request->ruta,
            'menu_padre' => $request->menu_padre,
            'icono' => preg_replace("/[^a-zA-Z0-9\s]/", "", $request->icono),
            'orden' => 1,
        ]);

        return redirect()->route('menu');
    }

    public function delete(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $modulo = Menu::findOrFail($id);
        $modulo->estado = false;
        $modulo->save();

        return redirect()->route('menu');
    }

    public function activar(Request $request, $id)
    {
        if (!$request->ajax()) return redirect('/');
        $modulo = Menu::findOrFail($id);
        $modulo->estado = true;
        $modulo->save();

        return redirect()->route('menu');
    }
    public function getNavigationMenu()
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        $user = auth()->user();

        $menus = Menu::where('estado', true)
            ->with(['permisos:id,name'])
            ->orderBy('id', 'asc')
            ->get();

        $userPermissions = $user->getAllPermissions()->pluck('name');

        // Filtrar menús que el usuario puede ver
        $filteredMenus = $menus->filter(function ($menu) use ($userPermissions, $user) {
            if ($menu->permisos->isEmpty()) {
                $nombre = strtolower($menu->nombre);
                return $userPermissions->contains(function ($perm) use ($nombre) {
                    return str_contains($perm, $nombre);
                });
            }
            return $user->canAny($menu->permisos->pluck('name')->toArray());
        });

        // Convertir a array para manipulación
        $menuArray = $filteredMenus->map(function ($menu) {
            return [
                'id' => $menu->id,
                'menu_padre' => $menu->menu_padre,
                'name' => $menu->nombre,
                'icon' => $menu->icono,
                'href' => $menu->ruta ? route($menu->ruta) : '#',
                'active' => request()->routeIs($menu->ruta),
                'permissions' => $menu->permisos->pluck('name')->toArray(),
                'subItems' => null
            ];
        })->toArray();

        // Crear un índice rápido por ID
        $menuIndex = collect($menuArray)->keyBy('id')->toArray();

        // Construir árbol
        $menuTree = [];
        foreach ($menuIndex as $id => &$menu) {
            if ($menu['menu_padre'] && isset($menuIndex[$menu['menu_padre']])) {
                $menuIndex[$menu['menu_padre']]['subItems'][] = &$menu;
            } else {
                $menuTree[] = &$menu;
            }
        }

        unset($menu); // Limpiar referencia

        // Filtrar menús sin hijos y sin href
        $menuTree = array_filter($menuTree, function ($menu) {
            return !empty($menu['subItems']) || ($menu['href'] && $menu['href'] !== '#');
        });

        return response()->json([
            'success' => true,
            'data' => [
                [
                    'group' => 'Principal',
                    'items' => array_values($menuTree)
                ]
            ]
        ]);
    }

    public function permisos($id)
    {
        $rol = Role::findOrFail($id);
        $menus = Menu::get();
        $permisos = Permission::all()->groupBy(function ($permiso) {
            return explode(" ", $permiso->name)[1] ?? '';
        });
        return Inertia::render('Roles/Permisos', [
            'rol' => $rol,
            'menus' => $menus,
            'permisos' => $permisos,
            'permisosAsignados' => $rol->permissions->pluck('name')->toArray()
        ]);
    }

    public function asignarPermisos(Request $request, $id)
    {
        $rol = Role::findOrFail($id);
        $rol->syncPermissions($request->permisos); // array de nombres de permisos
        return redirect()->route('roles');
    }

    public function edit($id)
    {
        $rol = Role::findOrFail($id);
        $menus = Menu::where('estado', true)->get();
        $permisosAsignados = $rol->permissions->pluck('name')->toArray();
        return Inertia::render('Roles/Permisos', [
            'rol' => $rol,
            'menus' => $menus,
            'permisosAsignados' => $permisosAsignados
        ]);
    }
}
