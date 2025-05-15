<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call(RolSeeder::class);
        $this->call(permisoSeeder::class);
        $this->call(RutasSeeder::class);
        $this->call(MenuSeeder::class);
        $this->call(MenuPermisoSeeder::class);
        $this->call(DefaultSuperAdminSeeder::class);
        $this->call(rolePermisoSeeder::class);
    }
}
