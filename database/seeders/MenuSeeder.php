<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('menu')->insert([
            [
                'nombre'         => 'Administración',
                'componente' => null,
                'icono'         => 'IoHomeOutline',
                'menu_padre'   => null,
                'orden' => '1',
                'ruta'        => 'dashboard',
                'estado'     => true
            ],
            [
                'nombre'         => 'Configuración',
                'componente' => null,
                'icono'         => 'FaCog',
                'menu_padre'   => null,
                'orden' => '2',
                'ruta'        => 'dashboard',
                'estado'     => true
            ],
            [
                'nombre'         => 'Menu',
                'componente' => 1,
                'icono'         => null,
                'menu_padre'   => 1,
                'orden' => '1',
                'ruta'        => 'menu',
                'estado'     => true
            ],
            [
                'nombre'         => 'Rutas',
                'componente' => 2,
                'icono'         => null,
                'menu_padre'   => 1,
                'orden' => '2',
                'ruta'        => 'rutas',
                'estado'     => true
            ],
        ]);
    }
}
