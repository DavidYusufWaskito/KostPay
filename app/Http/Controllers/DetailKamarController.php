<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DetailKamar;
class DetailKamarController extends Controller
{
    //
    public function getAllDetailKamar(Request $request)
    {
        try {
            $data = DetailKamar::all();
            return response()->json($data, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error fetching DetailKamar'], 500);
        }
    }

    public function onEdit(Request $request)
    {
        try {

            $data = DetailKamar::find($request->id);
            $data->idKamar = $request->idKamar;
            $data->TanggalSewa = $request->TanggalSewa;
            $data->TanggalJatuhTempo = $request->TanggalJatuhTempo;
            $data->StatusAktif = $request->StatusAktif;
            $data->save();

            return response()->json($data, 200);
        }catch(\Exception $e) {

            return response()->json(['error' => 'Error edit DetailKamar'], 500);
        }
    }
}
