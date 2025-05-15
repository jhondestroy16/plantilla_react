<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Rutas extends Model
{
    protected $table = 'rutas_react';
    protected $fillable = ['path', 'name', 'component', 'variable', 'estado'];
}
