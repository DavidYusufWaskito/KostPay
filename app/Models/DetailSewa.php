<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DetailSewa extends Model
{
    use HasFactory;
    protected $table = 'detail_sewa';
    public $timestamps = false;
    protected $fillable = [
        'idKamar',
        'idPenyewa',
        'TanggalSewa',
        'StatusAktif'
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
