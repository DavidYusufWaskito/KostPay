<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailKamar extends Model
{
    use HasFactory;
    protected $table = 'detail_kamar';
    protected $fillable = [
        'idKamar',
        'idPenyewa',
        'TanggalSewa',
        'TanggalJatuhTempo'
    ];

    // protected static function booted()
    // {
    //     static::updating(function ($detailKamar) {
    //         // Ambil informasi kamar untuk menghitung harga sewa
    //         $kamar = Kamar::find($detailKamar->idKamar);
    //         if (!$kamar) {
    //             return; // Jika kamar tidak ditemukan, hentikan proses
    //         }

    //         // Hitung selisih bulan antara TanggalSewa dan TanggalJatuhTempo
    //         $tanggalSewa = new \DateTime($detailKamar->TanggalSewa);
    //         $tanggalJatuhTempo = new \DateTime($detailKamar->TanggalJatuhTempo);
    //         $interval = $tanggalSewa->diff($tanggalJatuhTempo);
    //         $diffInMonths = $interval->y * 12 + $interval->m;

    //         if ($diffInMonths >= 1) {
    //             // Hitung TanggalJatuhTempo baru
    //             $newTanggalJatuhTempo = $tanggalSewa->modify('+1 month')->format('Y-m-d');
                
    //             // Update TanggalJatuhTempo
    //             $detailKamar->TanggalJatuhTempo = $newTanggalJatuhTempo;

    //             // Update tunggakan pada penyewa
    //             $hargaSewa = $kamar->HargaSewa;
    //             $penyewa = Penyewa::find($detailKamar->idPenyewa);
    //             if ($penyewa) {
    //                 $penyewa->increment('tunggakan', $hargaSewa); // Menambahkan harga sewa ke tunggakan
    //             }
    //         }
    //     });
    // }

    public function Kamar()
    {
        return $this->belongsTo(Kamar::class,'idKamar');
    }

    public function Penyewa()
    {
        return $this->belongsTo(Penyewa::class,'idPenyewa');
    }
}
