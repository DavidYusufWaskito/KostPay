<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Membuat trigger untuk mengurangi jumlah tunggakan setelah transaksi
        DB::statement('
            CREATE TRIGGER update_tunggakan_after_insert_transaksi
            AFTER INSERT ON transaksi
            FOR EACH ROW
            BEGIN
                IF NEW.StatusPembayaran = 1 THEN
                    UPDATE penyewa
                    SET tunggakan = tunggakan - NEW.TotalBayar
                    WHERE id = NEW.idPenyewa;
                END IF;
            END
        ');

        // Membuat trigger untuk menambahkan tunggakan sesuai harga sewa kamar saat menyewa kamar
        DB::statement('
            CREATE TRIGGER add_tunggakan_after_insert_detail_kamar
            AFTER INSERT ON detail_kamar
            FOR EACH ROW
            BEGIN
                UPDATE penyewa
                SET tunggakan = tunggakan + (SELECT HargaSewa FROM kamar WHERE id = NEW.idKamar)
                WHERE id = NEW.idPenyewa;

                -- Mengubah status kamar menjadi occupied (1)
                UPDATE kamar
                SET StatusKamar = 1
                WHERE id = NEW.idKamar;
            END
        ');

        // Membuat trigger untuk mengubah status kamar menjadi vacant (0) atau occupied (1) setelah update detail_kamar
        DB::statement('
            CREATE TRIGGER update_kamar_status_after_update_detail_kamar
            AFTER UPDATE ON detail_kamar
            FOR EACH ROW
            BEGIN
                -- Jika penyewa tidak ada di detail_kamar lain, set kamar ke vacant (0)
                IF NOT EXISTS (SELECT 1 FROM detail_kamar WHERE idKamar = NEW.idKamar AND idPenyewa <> NEW.idPenyewa) THEN
                    UPDATE kamar
                    SET StatusKamar = 0
                    WHERE id = NEW.idKamar;
                ELSE
                    UPDATE kamar
                    SET StatusKamar = 1
                    WHERE id = NEW.idKamar;
                END IF;
            END
        ');

        // Membuat trigger untuk mengubah status kamar menjadi vacant (0) setelah delete detail_kamar
        DB::statement('
            CREATE TRIGGER update_kamar_status_after_delete_detail_kamar
            AFTER DELETE ON detail_kamar
            FOR EACH ROW
            BEGIN
                -- Jika penyewa tidak ada di detail_kamar lain, set kamar ke vacant (0)
                IF NOT EXISTS (SELECT 1 FROM detail_kamar WHERE idKamar = OLD.idKamar) THEN
                    UPDATE kamar
                    SET StatusKamar = 0
                    WHERE id = OLD.idKamar;
                END IF;
            END
        ');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Menghapus trigger jika ada
        DB::statement('DROP TRIGGER IF EXISTS update_tunggakan_after_insert_transaksi');
        DB::statement('DROP TRIGGER IF EXISTS add_tunggakan_after_insert_detail_kamar');
        DB::statement('DROP TRIGGER IF EXISTS update_kamar_status_after_update_detail_kamar');
        DB::statement('DROP TRIGGER IF EXISTS update_kamar_status_after_delete_detail_kamar');
    }
};
