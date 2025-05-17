<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('historial_citas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('cita_id');
            $table->unsignedBigInteger('id_usuario'); // quien realizó el cambio (opcional)
            $table->enum('accion', ['creada', 'confirmada', 'cancelada', 'reprogramada', 'realizada']);
            $table->text('descripcion')->nullable(); // motivo o detalle
            $table->timestamps();

            $table->foreign('cita_id')->references('id')->on('citas');
            $table->foreign('id_usuario')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_citas');
    }
};
