<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tagihan extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $fillable = [
        'id',
        'idDetailSewa',
        'JumlahTagihan',
        'TanggalTagihan',
        'TanggalJatuhTempo',
    ];

    public function detailSewa()
    {
        return $this->belongsTo(DetailSewa::class, 'idDetailSewa');
    }
    public function Transaksi()
    {
        return $this->belongsToMany(Transaksi::class, 'idTagihan');
    }
}
