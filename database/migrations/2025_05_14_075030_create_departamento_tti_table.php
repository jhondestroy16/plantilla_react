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
        Schema::create('departamento_tti', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->nullable();
            $table->string('nit')->nullable();
            $table->string('direccion')->nullable();
            $table->string('dependencia')->nullable();
            $table->string('telefono')->nullable();
            $table->string('url_produccion')->nullable();
            $table->string('url_logo')->nullable();
            $table->string('nombre_db')->nullable();
            $table->boolean('estado')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departamento_tti');
    }
};
