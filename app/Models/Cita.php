<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cita extends Model
{
    use HasFactory;
    protected $table = 'citas';

    protected $fillable = [
        'usuario_id', 'fecha', 'hora_inicio', 'hora_fin',
        'estado', 'total'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function servicios()
    {
        return $this->belongsToMany(Servicio::class, 'cita_servicio', 'cita_id', 'servicio_id')
                    ->withPivot('precio_unitario', 'duracion')
                    ->withTimestamps();
    }

    public function factura()
    {
        return $this->hasOne(Factura::class, 'cita_id');
    }
}
