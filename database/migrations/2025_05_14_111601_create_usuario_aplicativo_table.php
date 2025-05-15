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
        Schema::create('usuario_aplicativo', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('id_aplicativo');
            $table->bigInteger('id_usuario');
            $table->boolean('asociar_empresa');
            $table->boolean('estado')->default(true);

            $table->foreign('id_aplicativo')->references('id')->on('departamento_tti');
            $table->foreign('id_usuario')->references('id')->on('users');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('usuario_aplicativo');
    }
};
