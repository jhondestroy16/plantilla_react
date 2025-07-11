<?php

use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\EmpresaController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RolesController;
use App\Http\Controllers\RutasController;
use App\Http\Controllers\ServicioController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return redirect()->route('login'); // Redirige directamente al login
});

require __DIR__ . '/auth.php';

Route::middleware('auth')->group(function () {
    Route::get('/api/permisos', function () {
        return auth()->user()->getAllPermissions()->pluck('name');
    })->middleware('auth');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/api/navigation', [MenuController::class, 'getNavigationMenu'])
        ->name('api.navigation');

    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    Route::get('/menu', [MenuController::class, 'index'])
        ->middleware('permission:buscar menu')
        ->name('menu');

    Route::post('/modulos/store', [MenuController::class, 'store'])
        ->middleware('permission:crear menu')
        ->name('modulos.store');

    Route::put('/modulos/update/{id}', [MenuController::class, 'update'])
        ->middleware('permission:editar menu')
        ->name('modulos.update');

    Route::put('/modulos/delete/{id}', [MenuController::class, 'delete'])
        ->middleware('permission:eliminar menu')
        ->name('modulos.desactivar');

    Route::put('/modulos/activar/{id}', [MenuController::class, 'activar'])
        ->middleware('permission:editar menu')
        ->name('modulos.activar');

    Route::get('/rutas', [RutasController::class, 'index'])
        ->name('rutas');

    Route::post('/rutas/store', [RutasController::class, 'store'])
        ->name('rutas.store');

    Route::put('/rutas/update/{id}', [RutasController::class, 'update'])
        ->name('rutas.update');

    Route::put('/rutas/delete/{id}', [RutasController::class, 'delete'])
        ->name('rutas.desactivar');

    Route::put('/rutas/activar/{id}', [RutasController::class, 'activar'])
        ->name('rutas.activar');

    Route::get('/roles', [RolesController::class, 'index'])
        ->name('roles');

    Route::post('/roles/store', [RolesController::class, 'store'])
        ->name('roles.store');

    Route::put('/roles/update/{id}', [RolesController::class, 'update'])
        ->name('roles.update');

    Route::put('/roles/delete/{id}', [RolesController::class, 'delete'])
        ->name('roles.desactivar');

    Route::put('/roles/activar/{id}', [RolesController::class, 'activar'])
        ->name('roles.activar');

    Route::get('/productos', [ProductoController::class, 'index'])
        ->name('productos');

    Route::post('/productos/store', [ProductoController::class, 'store'])
        ->name('productos.store');

    Route::put('/productos/update/{id}', [ProductoController::class, 'update'])
        ->name('productos.update');

    Route::put('/productos/delete/{id}', [ProductoController::class, 'desactivar'])
        ->name('productos.desactivar');

    Route::put('/productos/activar/{id}', [ProductoController::class, 'activar'])
        ->name('productos.activar');

    Route::get('/usuarios', [RegisteredUserController::class, 'index'])
        ->name('usuarios');

    Route::put('/usuarios/desactivar/{id}', [RegisteredUserController::class, 'desactivar'])
        ->name('usuarios.desactivar');

    Route::put('/usuarios/activar/{id}', [RegisteredUserController::class, 'activar'])
        ->name('usuarios.activar');

    Route::get('/roles/{id}/permisos', [MenuController::class, 'permisos'])
        ->name('roles.permisos');

    Route::post('/roles/{id}/permisos', [MenuController::class, 'asignarPermisos'])
        ->name('roles.permisos.asignar');

    Route::get('/roles/{roleId}/edit', [MenuController::class, 'edit'])
        ->name('roles.edit');

    Route::get('/servicios', [ServicioController::class, 'index'])
        ->name('servicios');

    Route::post('/servicios/store', [ServicioController::class, 'store'])
        ->name('servicios.store');

    Route::put('/servicios/update/{id}', [ServicioController::class, 'update'])
        ->name('servicios.update');

    Route::put('/servicios/desactivar/{id}', [ServicioController::class, 'desactivar'])
        ->name('servicios.desactivar');

    Route::put('/servicios/activar/{id}', [ServicioController::class, 'activar'])
        ->name('servicios.activar');
});
