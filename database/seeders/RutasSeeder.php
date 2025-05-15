<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RutasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('rutas_react')->insert([
            [
                'path'         => '/Menu',
                'name'          => 'Menu',
                'component'     => 'Menu',
                'variable'      => 'Menu',
                'estado'         => true
            ],
            [
                'path'             => '/Rutas',
                'name'          => 'Rutas',
                'component'     => 'Rutas',
                'variable'      => 'Rutas',
                'estado'         => true
            ],
        ]);
    }
}
