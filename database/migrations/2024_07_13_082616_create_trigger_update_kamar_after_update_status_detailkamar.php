<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::unprepared('
            CREATE TRIGGER after_detail_kamar_statusAktif_update
            AFTER UPDATE ON detail_kamar
            FOR EACH ROW
            BEGIN
                IF NEW.StatusAktif = 1 THEN
                    UPDATE kamar
                    SET StatusKamar = 1
                    WHERE id = NEW.idKamar;
                ELSE
                    UPDATE kamar
                    SET StatusKamar = 0
                    WHERE id = NEW.idKamar;
                END IF;
            END;
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared('DROP TRIGGER after_detail_kamar_statusAktif_update');
    }
};
