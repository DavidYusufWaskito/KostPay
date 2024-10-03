<?php

use App\Http\Controllers\TagihanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\PenyewaController;
use App\Http\Controllers\DetailSewaController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\KamarController;
use App\Http\Controllers\NotificationController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('midtrans-callback', [TransactionController::class, 'midtransCallback']);


Route::group(['middleware' => ['auth:sanctum']], function () {
    Route::get('/tagihan/detail-sewa/{id}', [TagihanController::class, 'getTagihanByDetailSewaId']);
    // Resource Pembayaran Penyewa (Tenant Payments)
    Route::post('/penyewa/bayar', [TransactionController::class, 'checkOut'])->name('penyewa.bayar'); // Pembayaran penyewa
    Route::get('/penyewa/{idPenyewa}/transaksi', [TransactionController::class, 'getTransactionsByIdPenyewa'])->name('penyewa.transactions'); // Mendapatkan transaksi berdasarkan ID penyewa
    Route::get('/penyewa/{idPenyewa}/tagihan', [TagihanController::class, 'getTagihanByDetailSewaId'])->name('penyewa.tagihan'); // Mendapatkan tagihan berdasarkan detail sewa

    // Resource Notifikasi (Notifications)
    Route::get('/notifikasi/{id}', [NotificationController::class, 'getNotifByPenyewa'])->name('notifikasi.index'); // Mendapatkan notifikasi berdasarkan ID penyewa
    Route::put('/notifikasi/{id}/status', [NotificationController::class, 'changeNotifStatus'])->name('notifikasi.update-status'); // Mengubah status notifikasi
    Route::put('/notifikasi/{id}/status/all', [NotificationController::class, 'changeAllNotifStatusByPenyewa'])->name('notifikasi.update-all-status'); // Mengubah semua status notifikasi untuk penyewa

    // Resource Transaksi dengan Snap Token
    Route::put('/transaksi/snap/{snap_token}', [TransactionController::class, 'updateTransactionStatusBySnapToken'])->name('transaksi.update-status-snap'); // Mengubah status transaksi dengan Snap Token
    Route::post('/transaksi/payment/snap', [TransactionController::class, 'paymentWithSnap'])->name('transaksi.payment.snap');
    Route::get('/transaksi/pending/{idTagihan}', [TransactionController::class, 'getPendingTransaction'])->name('transaksi.pending');
    Route::put('/transaksi/pending/cancel/{idTransaksi}', [TransactionController::class, 'cancelPendingTransaction'])->name('transaksi.pending.cancel');
});

Route::group(['middleware' => ['auth:sanctum','penyewa-auth-id']], function () {
    Route::get('/transaksi/penyewa/{idPenyewa}', [TransactionController::class, 'getTransactionByIdPenyewa'])->name('transaksi.index');
});

Route::group(['middleware' => ['auth:sanctum', 'verify-auth:admin']], function () {
    // Resource Penyewa (Tenants)
    Route::get('/admin/penyewa', [PenyewaController::class, 'getAllPenyewa'])->name('admin.penyewa.getAll'); // Mendapatkan semua penyewa
    Route::get('/admin/penyewa/{id}', [PenyewaController::class, 'getPenyewaById'])->name('admin.penyewa.getById'); // Mendapatkan penyewa berdasarkan ID
    Route::post('/admin/penyewa', [PenyewaController::class, 'storePenyewa'])->name('admin.penyewa.store'); // Menambahkan penyewa
    Route::put('/admin/penyewa/{id}', [PenyewaController::class, 'updatePenyewa'])->name('admin.penyewa.update'); // Memperbarui penyewa
    Route::delete('/admin/penyewa/{id}', [PenyewaController::class, 'onDestroy'])->name('admin.penyewa.destroy'); // Menghapus penyewa

    // Resource Detail Sewa (Rental Details)
    Route::get('/admin/detail-sewa', [DetailSewaController::class, 'getAllDetailSewa'])->name('admin.detail-sewa.index'); // Mendapatkan semua detail sewa
    Route::post('/admin/detail-sewa', [PenyewaController::class, 'createDetailSewa'])->name('admin.detail-sewa.store'); // Menambahkan detail sewa
    Route::put('/admin/detail-sewa/{id}', [DetailSewaController::class, 'onEdit'])->name('admin.detail-sewa.update'); // Memperbarui detail sewa

    // Resource Transaksi (Transactions)
    // Route::get('/admin/transaksi', [AdminController::class, 'v_ManageTransaksi'])->name('admin.transaksi.index'); // Melihat halaman manajemen transaksi (opsi jika ada view)
    Route::get('/admin/transaksi', [TransactionController::class, 'getAllTransaction'])->name('admin.transaksi.index'); // Mendapatkan semua transaksi
    Route::post('/admin/transaksi/sync', [TransactionController::class, 'syncAllTransaction'])->name('admin.transaksi.sync'); // Sinkronisasi semua transaksi

    // Resource Kamar (Rooms)
    Route::get('/admin/kamar', [KamarController::class, 'getAllKamar'])->name('admin.kamar.index'); // Mendapatkan semua kamar
    Route::post('/admin/kamar', [KamarController::class, 'storeKamar'])->name('admin.kamar.store'); // Menambahkan kamar
    Route::put('/admin/kamar/{id}', [KamarController::class, 'updateKamar'])->name('admin.kamar.update'); // Memperbarui kamar
    Route::delete('/admin/kamar/{id}', [KamarController::class, 'onDestroy'])->name('admin.kamar.destroy'); // Menghapus kamar

    // Mengirim notifikasi (Admin)
    Route::post('/admin/notifikasi', [NotificationController::class, 'sendNotif'])->name('admin.notifikasi.send'); // Admin mengirim notifikasi
});

Route::post('login', [AuthenticatedSessionController::class, 'store']);
