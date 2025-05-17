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
        Schema::create('citas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('persona_id');
            $table->unsignedBigInteger('servicio_id');
            $table->unsignedBigInteger('id_usuario'); // Dueño de la cita (ej. especialista)
            $table->dateTime('fecha');
            $table->enum('estado', ['pendiente', 'confirmada', 'cancelada', 'realizada'])->default('pendiente');
            $table->text('notas')->nullable();
            $table->timestamps();

            $table->foreign('persona_id')->references('id')->on('personas');
            $table->foreign('servicio_id')->references('id')->on('servicios');
            $table->foreign('id_usuario')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('citas');
    }
};
