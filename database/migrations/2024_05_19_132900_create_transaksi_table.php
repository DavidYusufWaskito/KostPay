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
        Schema::create('transaksi', function (Blueprint $table) {
            $table->id();
            $table->foreignId('idTagihan')->constrained('tagihan');
            // $table->foreignId('idDetailKamar')->constrained('detail_kamar');
            $table->datetime('TanggalBayar')->nullable();
            $table->integer('TotalBayar');
            $table->integer('StatusPembayaran');
            $table->string('snapToken')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transaksi');
    }
};
