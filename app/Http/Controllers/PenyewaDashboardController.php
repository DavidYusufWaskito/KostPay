<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DetailKamar;
class PenyewaDashboardController extends Controller
{
    //
    
    public function index()
    {
        $Penyewa = auth()->user();
        
        $DetailKamar = DetailKamar::where('idPenyewa', $Penyewa->id)->first();

        if (!$DetailKamar) {
            return Inertia::render('Penyewa/belumSewa');
        }

        // To get the Kamar data, you need to eager load it.
        // Otherwise, it will return only the DetailKamar data.
        // $DetailKamar->load('Kamar');

        // return response()->json($DetailKamar->Kamar);
        

        return Inertia::render('Penyewa/dashboard',['DetailKamar' => $DetailKamar,'Kamar' => $DetailKamar->Kamar,'MIDTRANS_CLIENT_KEY' => config('midtrans.client_key')]);
    }

}
