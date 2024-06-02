<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Penyewa extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $table = 'penyewa';
    protected $fillable = [
        'nama',
        'email',
        'password',
        'tunggakan'
    ];
 
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    # Attribute member
    protected $attributes = [
        'tunggakan' => 0

    ];

    public function DetailKamar()
    {
        return $this->hasOne(DetailKamar::class,'idPenyewa');
    }
}
