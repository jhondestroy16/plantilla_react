<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
     use HasFactory;

    protected $table = 'facturas';

    protected $fillable = [
        'cita_id', 'numero', 'fecha', 'total',
        'metodo_pago', 'estado', 'xml_dte'
    ];

    public function cita()
    {
        return $this->belongsTo(Cita::class, 'cita_id');
    }

    public function detalles()
    {
        return $this->hasMany(DetalleFactura::class, 'factura_id');
    }
}
