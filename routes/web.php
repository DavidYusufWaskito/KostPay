<?php

use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PenyewaController;
use App\Http\Controllers\PenyewaDashboardController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Home', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth:web', 'verified'])->name('dashboard');

// Route::get('/home',function(){
//     return Inertia::render('Penyewa/Home');
// });

// Route::get('/daftar',function(){
//     return Inertia::render('Penyewa/Daftar');
// })->name('penyewa.daftar');

Route::middleware('auth:web')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware('guest')->group(function ()
{
    Route::get('/home',[HomeController::class,'index'])->name('home');
    Route::get('/daftar',[HomeController::class,'v_daftar'])->name('daftar');
});

// Route::middleware('auth:admin')->group(function (){
//     Route::get('/admin',[AdminController::class,'index'])->name('admin.dashboard');
// });

Route::group(['middleware' => ['auth:admin']],function(){
    Route::get('/admin',[AdminController::class,'index'])->name('admin.dashboard');
    Route::get('/admin/manage/penyewa',[AdminController::class,'v_ManagePenyewa'])->name('admin.manage.penyewa');




    Route::get('/admin/get/penyewa',[PenyewaController::class,'getPenyewa'])->name('admin.get.penyewa');

    Route::post('/admin/manage/penyewa/store',[PenyewaController::class,'storePenyewa'])->name('admin.manage.penyewa.store');
    Route::post('/admin/manage/penyewa/update',[PenyewaController::class,'updatePenyewa'])->name('admin.manage.penyewa.update');
    Route::post('/admin/manage/penyewa/delete',[PenyewaController::class,'onDestroy'])->name('admin.manage.penyewa.destroy');

    Route::get('/admin/manage/transaksi',[AdminController::class,'v_ManageTransaksi'])->name('admin.manage.transaksi');
    Route::post('/admin/get/all/transaksi',[TransactionController::class,'getAllTransaction'])->name('admin.get.all.transaction');
    Route::post('/admin/sync/all/transaksi',[TransactionController::class,'syncAllTransaction'])->name('admin.sync.all.transaction');
});


Route::group(['middleware' => ['auth:web']],function(){
    Route::get('/penyewa',[PenyewaDashboardController::class,'index'])->name('penyewa.dashboard');
    Route::post('/penyewa/bayar',[TransactionController::class,'checkOut'])->name('penyewa.bayar');
    Route::post('/penyewa/transactions',[TransactionController::class,'getTransactionsByIdPenyewa'])->name('penyewa.transactions');
});

require __DIR__.'/auth.php';
