<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;
class HomeController extends Controller
{
    //
    public function index(Request $request)
    {
        $kosImage = asset('/storage/img/kos_front.webp');
        return Inertia::render('Home', ['kosImage' => $kosImage]);
    }

    public function v_daftar(Request $request)
    {
        return Inertia::render('Penyewa/auth/Daftar');
    }
}
