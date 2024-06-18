<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\DetailKamar;
use App\Models\Penyewa;
use App\Models\Kamar;
use Carbon\Carbon;

class UpdateDetailKamarAndTunggakan extends Command
{
    protected $signature = 'update:detailkamar';
    protected $description = 'Update TanggalJatuhTempo dan tunggakan pada detail_kamar setiap bulan';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        $detailKamarList = DetailKamar::all();
        
        foreach ($detailKamarList as $detailKamar) {
            $kamar = Kamar::find($detailKamar->idKamar);
            if (!$kamar) {
                continue;
            }

            $tanggalJatuhTempo = new Carbon($detailKamar->TanggalJatuhTempo);
            $now = Carbon::now();

            // Jika sudah melewati atau sama dengan tanggal jatuh tempo
            if ($now->greaterThanOrEqualTo($tanggalJatuhTempo)) {
                // Hitung TanggalJatuhTempo baru
                $newTanggalJatuhTempo = $tanggalJatuhTempo->addMonth()->format('Y-m-d');
                
                // Update TanggalJatuhTempo
                $detailKamar->update(['TanggalJatuhTempo' => $newTanggalJatuhTempo]);

                // Update tunggakan pada penyewa
                $hargaSewa = $kamar->HargaSewa;
                $penyewa = Penyewa::find($detailKamar->idPenyewa);
                if ($penyewa) {
                    $penyewa->increment('tunggakan', $hargaSewa);
                }
            }
        }

        $this->info('DetailKamar updated successfully.');
    }
}
