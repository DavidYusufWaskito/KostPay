<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Admin;
class AdminController extends Controller
{
    //
    public function index(Request $request)
    {
        return Inertia::render('Admin/dashboard');
    }
}
