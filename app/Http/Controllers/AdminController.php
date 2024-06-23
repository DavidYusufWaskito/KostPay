<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Admin;
use App\Models\Kamar;
use App\Models\Transaksi;
use App\Models\Penyewa;
use App\Models\DetailKamar;
class AdminController extends Controller
{
    //
    public function index(Request $request)
    {
        $Kamar = Kamar::all();
        $Transaksi = Transaksi::all();
        return Inertia::render('Admin/dashboard',['Kamar' => $Kamar,'Transaksi' => $Transaksi]);
    }

    public function v_ManagePenyewa(Request $request)
    {
        $DetailKamar = DetailKamar::all();
        return Inertia::render('Admin/Penyewa/managePenyewa',['DetailKamar' => $DetailKamar]);
    }

    public function v_ManageTransaksi(Request $request)
    {
        return Inertia::render('Admin/Transaksi/manageTransaksi');
    }
}
