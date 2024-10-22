<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Inertia\Middleware;
use App\Models\Notifikasi;

class ShareNotificationData extends Middleware
{
    public function share(Request $request) : array
    {
        $Notifikasi = Notifikasi::where('idPenyewa', $request->user()->id)->get();
        return [
            ...parent::share($request),
            'Notifikasi' => $Notifikasi
        ];        
    }
}
