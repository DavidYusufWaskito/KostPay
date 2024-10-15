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
        $kosImageSmall = asset('/storage/img/kos_front-small.webp');
        $kosImage = asset('/storage/img/kos_front.webp');
        return Inertia::render('Home', ['kosImageSmall' => $kosImageSmall, 'kosImage' => $kosImage]);
    }

    public function v_daftar(Request $request)
    {
        return Inertia::render('Auth/RegisterPenyewa');
    }
}
