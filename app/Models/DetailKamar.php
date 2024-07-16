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


    public function Kamar()
    {
        return $this->belongsTo(Kamar::class,'idKamar');
    }

    public function Penyewa()
    {
        return $this->belongsTo(Penyewa::class,'idPenyewa');
    }
}
