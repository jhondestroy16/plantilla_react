<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'empresas';
    protected $fillable = ['nombre', 'nit', 'direccion', 'telefono'];

    public function productos()
    {
        return $this->belongsToMany(Empresa::class, 'empresa_productos', 'id_empresa', 'id_producto');
    }
}
