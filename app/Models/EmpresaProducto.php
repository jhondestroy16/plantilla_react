<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmpresaProducto extends Model
{
    protected $table = 'empresa_productos';
    protected $fillable = ['id_empresa','id_producto'];
}
