<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApiVerifyAuthUserId
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $idPenyewa = $request->route('idPenyewa');
        if ($request->user()->id != $idPenyewa) {
            return response()->json([
                'message' => 'Unauthorized api access! User id does not match authenticated user id. Param: ' . $idPenyewa
            ], 401);
        }
        return $next($request);
    }
}
