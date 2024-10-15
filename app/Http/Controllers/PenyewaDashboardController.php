<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\DetailSewa;
use App\Models\Tagihan;
use Illuminate\Support\Facades\Log;
use App\Models\Transaksi;
class PenyewaDashboardController extends Controller
{
    //
    
    public function index()
    {
        $Penyewa = auth()->user();
        
        $DetailSewa = DetailSewa::where('idPenyewa', $Penyewa->id)->first();
        $Tagihan = Tagihan::where('idDetailSewa', $DetailSewa->id)->where('StatusTagihan', 0)->get();

        if (!$DetailSewa || $DetailSewa->StatusAktif == 0) {
            return Inertia::render('Penyewa/belumSewa');
        }

        // To get the Kamar data, you need to eager load it.
        // Otherwise, it will return only the DetailKamar data.
        // $DetailSewa->load('Kamar');

        // return response()->json($DetailSewa->Kamar);

        

        return Inertia::render('Penyewa/dashboard',['DetailSewa' => $DetailSewa,'Kamar' => $DetailSewa->Kamar,'MIDTRANS_CLIENT_KEY' => config('midtrans.client_key'),'minimal_pembayaran' => config('helper.minimal_pembayaran'),'Tagihan' => $Tagihan]);
    }

    public function v_pembayaran($idTagihan)
    {
        $DetailSewa = DetailSewa::where('idPenyewa', auth()->user()->id)->first();
        $Tagihan = Tagihan::where('idDetailSewa', $DetailSewa->id)->where('id', $idTagihan)->first();
        Log::info($Tagihan);
        return Inertia::render('Penyewa/Pembayaran/Pembayaran',['DetailSewa' => $DetailSewa,'Tagihan' => $Tagihan,'MIDTRANS_CLIENT_KEY' => config('midtrans.client_key'),'minimal_pembayaran' => config('helper.minimal_pembayaran')]);
    }

    public function v_riwayatTransaksi(Request $request)
    {
        $Transaksi = Transaksi::where('idPenyewa', auth()->user()->id)->get();
        return Inertia::render('Penyewa/Pembayaran/RiwayatTransaksi',['Transaksi' => $Transaksi]);
    }

    public function v_daftarTagihan(Request $request)
    {
        $DetailSewa = DetailSewa::where('idPenyewa', auth()->user()->id)->first();
        $Tagihan = Tagihan::where('idDetailSewa', $DetailSewa->id)->where('StatusTagihan', 0)->get();
        return Inertia::render('Penyewa/Pembayaran/DaftarTagihan',['Tagihan' => $Tagihan,'DetailSewa' => $DetailSewa]);
    }
}
