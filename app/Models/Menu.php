<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Permission;

class Menu extends Model
{
    protected $table = 'menu';
    protected $fillable = ['nombre', 'componente', 'icono', 'menu_padre', 'ruta', 'orden'];

    public function permisos()
    {
        return $this->belongsToMany(Permission::class, 'menu_permission');
    }
}
