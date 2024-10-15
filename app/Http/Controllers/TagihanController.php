<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tagihan;
use App\Models\DetailSewa;
use App\Models\Kamar;

class TagihanController extends Controller
{
    //
    public function getTagihanByDetailSewaId($idDetailSewa)
    {
        $Tagihan = Tagihan::where('idDetailSewa', $idDetailSewa)->where('StatusTagihan', 0)->get();
        return response()->json($Tagihan);
    }

    public function addTagihanNextMonthByDetailSewaId($idDetailSewa)
    {
        $Detailsewa = DetailSewa::find($idDetailSewa);
        $Kamar = Kamar::find($Detailsewa->idKamar);
        $TagihanLast = Tagihan::where('idDetailSewa', $idDetailSewa)
            ->whereRaw('DATE(TanggalJatuhTempo) < CURDATE()')
            ->orderBy('TanggalJatuhTempo', 'desc')
            ->first();
        if ($TagihanLast) {
            $TagihanNew = new Tagihan();
            $TagihanNew->idDetailSewa = $TagihanLast->idDetailSewa;
            $TagihanNew->TanggalTagihan = $TagihanLast->TanggalJatuhTempo;
            $TagihanNew->TanggalJatuhTempo = date('Y-m-01', strtotime($TagihanLast->TanggalJatuhTempo . ' +1 month'));
            $TagihanNew->StatusTagihan = 0;
            $TagihanNew->JumlahTagihan = $Kamar->HargaSewa;
            $TagihanNew->save();
        }
        return response()->json($TagihanNew);
    }
}
