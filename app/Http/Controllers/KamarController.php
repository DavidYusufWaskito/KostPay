<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Kamar;

class KamarController extends Controller
{
    //
    public function getAllKamar()
    {
        try {
            $Kamar = Kamar::all();
            return response()->json($Kamar, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching Kamar'], 500);
        }
    }

    public function storeKamar(Request $request)
    {

        $request->validate([
            'HargaSewa' => 'required',
        ],[
            'HargaSewa.required' => 'Harga Sewa harus diisi',
        ]);

        $Kamar = new Kamar();
        $Kamar->HargaSewa = $request->HargaSewa;
        $Kamar->save();
        return response()->json($Kamar, 200);

    }

    public function onDestroy(Request $request)
    {
        $Kamar = Kamar::find($request->id);

        if ($Kamar) {

            $Kamar->delete();
            return response()->json(['message' => 'berhasil terhapus','success' => 1], 200);

        }
        return response()->json(['message' => 'Tidak terhapus','success' => 0], 400);

    }
}
