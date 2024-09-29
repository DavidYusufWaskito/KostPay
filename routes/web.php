<?php

use App\Events\MessageEvent;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\PenyewaController;
use App\Http\Controllers\PenyewaDashboardController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\KamarController;
use App\Models\DetailSewa;
use App\Http\Controllers\DetailSewaController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\TagihanController;
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


Route::get('/msg',function()
{
    MessageEvent::dispatch('Hello World');
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

Route::get('/',[HomeController::class,'index'])->name('home');
Route::middleware('guest')->group(function ()
{
    Route::get('/daftar',[HomeController::class,'v_daftar'])->name('daftar');
});

// Route::middleware('auth:admin')->group(function (){
//     Route::get('/admin',[AdminController::class,'index'])->name('admin.dashboard');
// });

Route::group(['middleware' => ['auth:admin']],function(){
    Route::get('/admin',[AdminController::class,'index'])->name('admin.dashboard');
    Route::get('/admin/manage/penyewa',[AdminController::class,'v_ManagePenyewa'])->name('admin.manage.penyewa');


    Route::get('/admin/notif',[AdminController::class,'v_Notifikasi'])->name('admin.notifikasi');
    Route::post('/admin/send/notif',[NotificationController::class,'sendNotif']);

    Route::get('/admin/get/penyewa',[PenyewaController::class,'getAllPenyewa'])->name('admin.get.all.penyewa');

    Route::post('/admin/manage/penyewa/store',[PenyewaController::class,'storePenyewa'])->name('admin.manage.penyewa.store');
    Route::post('/admin/manage/penyewa/update',[PenyewaController::class,'updatePenyewa'])->name('admin.manage.penyewa.update');
    Route::post('/admin/manage/penyewa/delete',[PenyewaController::class,'onDestroy'])->name('admin.manage.penyewa.destroy');

    Route::post('/admin/get/all/detailSewa',[DetailSewaController::class,'getAllDetailSewa'])->name('admin.get.all.detailSewa');
    Route::post('/admin/add/detailSewa',[PenyewaController::class,'createDetailSewa'])->name('admin.add.detailSewa');
    Route::post('/admin/update/detailSewa',[DetailSewaController::class,'onEdit'])->name('admin.update.detailSewa');

    Route::get('/admin/manage/transaksi',[AdminController::class,'v_ManageTransaksi'])->name('admin.manage.transaksi');
    Route::post('/admin/get/all/transaksi',[TransactionController::class,'getAllTransaction'])->name('admin.get.all.transaction');
    Route::post('/admin/sync/all/transaksi',[TransactionController::class,'syncAllTransaction'])->name('admin.sync.all.transaction');


    Route::get('/admin/manage/kamar',[AdminController::class,'v_ManageKamar'])->name('admin.manage.kamar');
    Route::get('/admin/get/all/kamar',[KamarController::class,'getAllKamar'])->name('admin.get.kamar');

    Route::post('/admin/manage/kamar/store',[KamarController::class,'storeKamar'])->name('admin.manage.kamar.store');
    Route::post('/admin/manage/kamar/delete',[KamarController::class,'onDestroy'])->name('admin.manage.kamar.delete');
});


Route::group(['middleware' => ['auth:web']],function(){
    Route::get('/penyewa',[PenyewaDashboardController::class,'index'])->name('penyewa.dashboard');
    Route::post('/penyewa/bayar',[TransactionController::class,'checkOut'])->name('penyewa.bayar');
    Route::post('/penyewa/transactions',[TransactionController::class,'getTransactionsByIdPenyewa'])->name('penyewa.transactions');
    Route::post('/penyewa/tagihan/get/detailSewa',[TagihanController::class,'getTagihanByDetailSewaId']);
});
Route::group(['middleware' => ['auth:web,admin']],function(){
    
    Route::post('/notifikasi',[NotificationController::class,'getNotifByPenyewa']);
    Route::post('/notifikasi/change/status',[NotificationController::class,'changeNotifStatus']);
    Route::post('/notifikasi/change/status/all',[NotificationController::class,'changeAllNotifStatusByPenyewa']);

    Route::post('transaksi/update/by/snap',[TransactionController::class,'updateTransactionStatusBySnapToken']);
});

require __DIR__.'/auth.php';
