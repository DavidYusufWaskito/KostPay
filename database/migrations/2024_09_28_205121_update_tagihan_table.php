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
        //
        Schema::table('tagihan', function (Blueprint $table) {
            $table->dateTime('TanggalJatuhTempo')->nullable()->after('JumlahTagihan');
            $table->integer('StatusTagihan')->after('TanggalJatuhTempo')->default(0);
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tagihan', function (Blueprint $table) {
            $table->dropColumn('TanggalJatuhTempo');
            $table->dropColumn('StatusTagihan');
        });
        
    }
};
