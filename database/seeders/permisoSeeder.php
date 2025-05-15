<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class permisoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('permissions')->insert([
            [
                'name'          => 'crear administración',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'editar administración',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'eliminar administración',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'buscar administración',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'crear configuración',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'editar configuración',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'eliminar configuración',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'buscar configuración',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'crear menu',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'editar menu',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'eliminar menu',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'buscar menu',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'crear rutas',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'editar rutas',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'eliminar rutas',
                'guard_name'     => 'web'
            ],
            [
                'name'          => 'buscar rutas',
                'guard_name'     => 'web'
            ],
        ]);
    }
}
