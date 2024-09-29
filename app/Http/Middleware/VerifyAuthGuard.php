<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class VerifyAuthGuard
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $guard): Response
    {
        if (auth()->guard($guard)->check()) {
            Log::info('Authorized access from ' . $request->ip());
            return $next($request);
        }
        Log::warning('Unauthorized access from ' . $request->ip());
        Log::warning('User auth guard is not '.$guard);
        return response()->json(['message' => 'Unauthorized api access!'], 401);

    }
}
