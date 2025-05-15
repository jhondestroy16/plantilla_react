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
        Schema::create('empresa_productos', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('id_empresa');
            $table->bigInteger('id_producto');
            $table->foreign('id_empresa')->references('id')->on('empresas');
            $table->foreign('id_producto')->references('id')->on('productos');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('empresa_productos');
    }
};
