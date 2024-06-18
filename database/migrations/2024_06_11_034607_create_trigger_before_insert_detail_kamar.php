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

        DB::statement('
            CREATE TRIGGER before_insert_detail_kamar
            BEFORE INSERT ON detail_kamar
            FOR EACH ROW
            BEGIN
            
                SELECT idKamar INTO @idKamar FROM detail_kamar WHERE NEW.idKamar = @idKamar;
                SELECT StatusKamar INTO @statusKamar FROM kamar WHERE id = @idKamar;
            
                IF @statusKamar = 1 THEN
                    SIGNAL SQLSTATE "45000"
                    SET MESSAGE_TEXT = "Insert dibatalkan: Kamar sudah terisi.";
                END IF;
            END
            ');


        // Membuat trigger untuk mengubah status kamar menjadi vacant (0) atau occupied (1) setelah update detail_kamar
        // Jika penyewa yang sudah menyewa kamar dan mendapatkan detail kamar pindah kamar namun tunggakan nya jangan ikut naik
        
        DB::statement('
            CREATE TRIGGER update_status_kamar_after_update_detail_kamar
            AFTER UPDATE ON detail_kamar
            FOR EACH ROW
            BEGIN
                IF NEW.idKamar <> OLD.idKamar THEN
                    SELECT StatusKamar INTO @statusKamar FROM kamar WHERE id = NEW.idKamar;
                    IF @statusKamar = 1 THEN
                        SIGNAL SQLSTATE "45000"
                        SET MESSAGE_TEXT = "Update dibatalkan: Kamar sudah terisi.";
                    ELSE
                        -- Set StatusKamar = 1 untuk kamar baru (NEW.idKamar)
                        UPDATE kamar
                        SET StatusKamar = 1
                        WHERE id = NEW.idKamar;

                        -- Cek apakah tidak ada detail_kamar lagi untuk kamar lama (OLD.idKamar)
                        SELECT COUNT(*) INTO @count FROM detail_kamar WHERE idKamar = OLD.idKamar;
                        IF @count = 0 THEN
                            UPDATE kamar
                            SET StatusKamar = 0
                            WHERE id = OLD.idKamar;
                        END IF;
                    END IF;
                END IF;
            END
        ');

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP TRIGGER IF EXISTS before_insert_detail_kamar');
        DB::statement('DROP TRIGGER IF EXISTS update_status_kamar_after_update_detail_kamar');
    }
};
