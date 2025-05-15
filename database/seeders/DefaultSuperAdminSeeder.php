<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DefaultSuperAdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si ya existe el rol
        $role = Role::where('name', 'Super Administrador')->first();

        if (!$role) {
            $this->command->error('El rol Super Administrador no existe. Corre primero el seeder que lo crea.');
            return;
        }

        // Crear el usuario por defecto
        $user = User::firstOrCreate(
            ['email' => 'admin@ejemplo.com'],
            [
                'name' => 'Administrador Principal',
                'usuario' => 'super_administrador',
                'password' => Hash::make('Super123*'),
            ]
        );

        // Asignar el rol
        if (!$user->hasRole($role->name)) {
            $user->assignRole($role);
            $this->command->info('Rol Super Administrador asignado al usuario.');
        } else {
            $this->command->info('El usuario ya tiene el rol asignado.');
        }
    }
}
