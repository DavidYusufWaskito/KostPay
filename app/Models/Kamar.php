<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kamar extends Model
{
    use HasFactory;

    protected $table = 'kamar';
    
    public $timestamps = false;
    protected $fillable = [
        'HargaSewa',
        'StatusKamar'
    ];

    # Attribute member
    protected $attributes = [
        'StatusKamar' => 0

    ];
}
