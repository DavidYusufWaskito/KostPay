<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
class HomeController extends Controller
{
    //
    public function index(Request $request)
    {
        return Inertia::render('Home');
    }

    public function v_daftar(Request $request)
    {
        return Inertia::render('Penyewa/Daftar');
    }
}
