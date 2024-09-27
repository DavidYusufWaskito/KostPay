<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaksi extends Model
{
    use HasFactory;
    protected $table = 'transaksi';
    public $timestamps = false;
    protected $fillable = [
        'id',
        'idTagihan',
        'TanggalBayar',
        'TotalBayar',
        'StatusPembayaran'
    ];

    public function Tagihan()
    {
        return $this->hasOne(Tagihan::class,'idTagihan');
    }

    public function Penyewa()
    {
        return $this->belongsTo(Penyewa::class,'idPenyewa');
    }
}
