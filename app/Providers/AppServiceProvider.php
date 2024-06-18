<?php

namespace App\Providers;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Accessing any route from localhost besides ngrok with HTTPS enabled may cause ERR_CONNECTION_REFUSED, use http instead when accessing route from localhost
        URL::forceScheme('https');
    }
}
