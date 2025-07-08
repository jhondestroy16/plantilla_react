<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CitaServicio extends Model
{
    use HasFactory;

    protected $table = 'cita_servicio';

    protected $fillable = ['cita_id', 'servicio_id', 'precio_unitario', 'duracion'];
}
