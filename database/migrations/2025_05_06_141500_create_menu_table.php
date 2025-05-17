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
        Schema::create('menu', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->integer('componente')->nullable();
            $table->string('icono')->nullable();
            $table->integer('menu_padre')->nullable();
            $table->string('ruta');
            $table->boolean('estado')->default(true);
            $table->integer('orden');

            $table->foreign('componente')->references('id')->on('rutas_react');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menu');
    }
};
