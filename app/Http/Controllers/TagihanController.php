<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Tagihan;

class TagihanController extends Controller
{
    //
    public function getTagihanByDetailSewaId($idDetailSewa)
    {
        $Tagihan = Tagihan::where('idDetailSewa', $idDetailSewa)->where('StatusTagihan', 0)->get();
        return response()->json($Tagihan);
    }
}
