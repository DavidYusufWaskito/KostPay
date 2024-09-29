<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DetailSewa;
class PenyewaDashboardController extends Controller
{
    //
    
    public function index()
    {
        $Penyewa = auth()->user();
        
        $DetailSewa = DetailSewa::where('idPenyewa', $Penyewa->id)->first();

        if (!$DetailSewa || $DetailSewa->StatusAktif == 0) {
            return Inertia::render('Penyewa/belumSewa');
        }

        // To get the Kamar data, you need to eager load it.
        // Otherwise, it will return only the DetailKamar data.
        // $DetailSewa->load('Kamar');

        // return response()->json($DetailSewa->Kamar);
        

        return Inertia::render('Penyewa/dashboard',['DetailSewa' => $DetailSewa,'Kamar' => $DetailSewa->Kamar,'MIDTRANS_CLIENT_KEY' => config('midtrans.client_key'),'minimal_pembayaran' => config('helper.minimal_pembayaran')]);
    }

}
