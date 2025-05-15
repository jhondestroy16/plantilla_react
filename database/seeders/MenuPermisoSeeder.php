<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MenuPermisoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('menu_permission')->insert([
            [
                'menu_id'           => 1,
                'permission_id'     => 1
            ],
            [
                'menu_id'           => 1,
                'permission_id'     => 2
            ],
            [
                'menu_id'           => 1,
                'permission_id'     => 3
            ],
            [
                'menu_id'           => 1,
                'permission_id'     => 4
            ],
            [
                'menu_id'           => 2,
                'permission_id'     => 5
            ],
            [
                'menu_id'           => 2,
                'permission_id'     => 6
            ],
            [
                'menu_id'           => 2,
                'permission_id'     => 7
            ],
            [
                'menu_id'           => 2,
                'permission_id'     => 8
            ],
            [
                'menu_id'           => 3,
                'permission_id'     => 9
            ],
            [
                'menu_id'           => 3,
                'permission_id'     => 10
            ],
            [
                'menu_id'           => 3,
                'permission_id'     => 11
            ],
            [
                'menu_id'           => 3,
                'permission_id'     => 12
            ],
            [
                'menu_id'           => 4,
                'permission_id'     => 13
            ],
            [
                'menu_id'           => 4,
                'permission_id'     => 14
            ],
            [
                'menu_id'           => 4,
                'permission_id'     => 15
            ],
            [
                'menu_id'           => 4,
                'permission_id'     => 16
            ],
        ]);
    }
}
