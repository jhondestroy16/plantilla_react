<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DepartamentoTTI extends Model
{
    protected $table = 'departamento_tti';
    protected $fillable = ['nombre','nit','telefono','direccion','dependencia','url_produccion','nombre_db','url_logo'];
}
