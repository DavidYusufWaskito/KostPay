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
        'idPenyewa',
        'idDetailKamar',
        'TanggalBayar',
        'TotalBayar',
        'StatusPembayaran'
    ];
    public function DetailKamar()
    {
        return $this->belongsTo(DetailKamar::class,'idDetailKamar');
    }

    public function Penyewa()
    {
        return $this->belongsTo(Penyewa::class,'idPenyewa');
    }
}
