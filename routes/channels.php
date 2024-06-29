<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\Notifikasi;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});


/**
 * $user adalah instance dari model User yang sedang login
 * $id adalah id dari user yang sedang berkomunikasi
 * 
 * Contoh penggunaan:
 * 
 * Route::get('/chat/{id}', function ($id) {
 *     broadcast(new \App\Events\NewMessage($id, Auth::user()->id, 'Hello!'));
 * });
 */
Broadcast::channel('messagechannel.{id}', function ($user, $id) {
    
});

Broadcast::channel('notificationchannel.{idPenyewaNotif}', function ($user, $idPenyewaNotif) {
    
    return $idPenyewaNotif == $user->id;
});


