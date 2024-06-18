<?php

namespace App\Http\Controllers;

use App\Models\Penyewa;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
class PenyewaController extends Controller
{
    


    public function getPenyewa(Request $request)
    {
        $Penyewa = Penyewa::all();
        return response()->json($Penyewa, 200);
    }

    public function storePenyewa(Request $request){
        $validatedData = $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:'. Penyewa::class,
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($request->password !== $request->password_confirmation) {
            return response()->json(['message' => 'Password tidak sama'], 400);
        }

        $penyewa = new Penyewa();
        $penyewa->nama = $request->nama;
        $penyewa->email = $request->email;
        $penyewa->password = Hash::make($request->password);
        $penyewa->save();
        return response()->json($penyewa, 200);
    }

    public function updatePenyewa(Request $request)
    {
        $validatedData = $request->validate([
            'id' => 'required|exists:penyewa,id',
            'nama' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:penyewa,email,' . $request->id,
            'password' => 'nullable|string|min:8|confirmed',
            'tunggakan' => 'required|numeric|min:0',
        ]);
    
        $penyewa = Penyewa::findOrFail($request->id);
        $penyewa->nama = $request->nama;
        $penyewa->email = $request->email;
        if (!empty($request->password)) {
            $penyewa->password = Hash::make($request->password);
        }
        $penyewa->tunggakan = $request->tunggakan;
        $penyewa->save();
        return response()->json($penyewa, 200);
    }

    public function onDestroy(Request $request)
    {
        $Penyewa = Penyewa::find($request->id);

        if ($Penyewa) {

            $Penyewa->delete();
            return response()->json(['message' => 'berhasil terhapus','success' => 1], 200);

        }
        return response()->json(['message' => 'Tidak terhapus','success' => 0], 400);

    }
}
