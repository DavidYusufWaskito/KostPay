<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notifikasi;

class NotificationController extends Controller
{
    //
    public function sendNotif (Request $request)
    {
        try {
            $notification = new Notifikasi();
            $notification->idPenyewa = $request->idPenyewa;
            $notification->Pesan = $request->Pesan;
            $notification->status = 0;
            $notification->idAdmin = $request->idAdmin;
            $notification->save();
            return response()->json(['message' => 'Notifikasi berhasil dikirim'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi Kesalahan: ' . $e->getMessage()], 400);
        }
    }

    public function getNotifByPenyewa (Request $request)
    {
        try {
            $notifications = Notifikasi::where('idPenyewa', $request->idPenyewa)->orderBy('created_at', 'desc')->get();
            return response()->json(['data' => $notifications], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Terjadi Kesalahan: ' . $e->getMessage()], 400);
        }
    }
}
