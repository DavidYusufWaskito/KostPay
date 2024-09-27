<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use App\Models\Transaksi;
use Illuminate\Support\Facades\Log;
use App\Models\DetailSewa;
use App\Models\Penyewa;
use PhpParser\JsonDecoder;

class TransactionController extends Controller
{
    // Harusnya jangan bikin data transaksi dulu di database
    public function checkOut(Request $request)
    {
        try {

            // Cari transaksi yang status pembayaran nya 5 (Belum dibayar), jika ada response error
            $transaction = Transaksi::where('StatusPembayaran', 5)
                ->where('idPenyewa', auth()->user()->id)
                ->first();
            if ($transaction) {
                return response()->json(['error' => 'Selesaikan transaksi terlebih dahulu (Id transaksi: ' . $transaction->id . ', total: Rp. ' . $transaction->TotalBayar . ')'], 400);
            }

            if ($request->TotalBayar < config('helper.minimal_pembayaran') && !(auth()->user()->Tunggakan < config('helper.minimal_pembayaran'))){
                return response()->json(['error' => 'Total Bayar minimal Rp. ' . config('helper.minimal_pembayaran')], 400);
            }

            if ($request->TotalBayar > auth()->user()->tunggakan) {
                return response()->json(['error' => 'Total Bayar melebihi tunggakan'], 400);
            } elseif ($request->TotalBayar == 0) {
                return response()->json(['error' => 'Total Bayar tidak boleh 0'], 400);
            }


            $idPenyewa = auth()->user()->id;
            $tanggal = date('Ymd');
            $jam = date('His');
            $idTransaksi = $idPenyewa . $tanggal . $jam;
            $Transaksi = new Transaksi();
            $Transaksi->id = $idTransaksi;
            $Transaksi->idPenyewa = auth()->user()->id;
            $Transaksi->idDetailSewa = $request->idDetailSewa;
            $Transaksi->TanggalBayar = date('Y-m-d H:i:s');
            $Transaksi->TotalBayar = $request->TotalBayar;
            $Transaksi->StatusPembayaran = 5;

            \Midtrans\Config::$serverKey = config('midtrans.server_key');
            \Midtrans\Config::$isProduction = false;
            \Midtrans\Config::$isSanitized = true;
            \Midtrans\Config::$is3ds = true;

            $params = array(
                'transaction_details' => array(
                    'order_id' => $Transaksi->id,
                    'gross_amount' => $Transaksi->TotalBayar,
                ),
                'customer_details' => array(
                    'first_name' => auth()->user()->nama,
                    'email' => auth()->user()->email
                ),
            );

            $snapToken = \Midtrans\Snap::getSnapToken($params);

            $Transaksi->snapToken = $snapToken;
            $Transaksi->save();

            return response()->json(['snapToken' => $snapToken], 200);
        } catch (\Exception $e) {
            // Log the error message
            Log::error('Error generating snap token: ' . $e->getMessage());
            Log::error($e->getTraceAsString());

            return response()->json(['error' => 'Failed to generate snap token'], 500);
        }
    }

    public function midtransCallback(Request $request)
    {
        $serverKey = config('midtrans.server_key');
        $hashed = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . $serverKey);

        // Verifikasi signature key
        if ($hashed === $request->signature_key) {
            // Dapatkan transaksi berdasarkan order_id
            $Transaksi = Transaksi::where('id', $request->order_id)->first();

            if (!$Transaksi) {
                Log::error('Transaction not found: ' . $request->order_id);
                return response()->json(['message' => 'Transaction not found'], 404);
            }

            // Update status transaksi berdasarkan status dari Midtrans
            switch ($request->transaction_status) {
                case 'capture': {
                        $Transaksi->update(['StatusPembayaran' => 1]);
                        Log::info('Payment captured successfully for Order ID: ' . $request->order_id);
                    }
                    break;
                case 'settlement':
                    $Transaksi->update(['StatusPembayaran' => 1]);
                    Log::info('Payment settled successfully for Order ID: ' . $request->order_id);
                    break;
                case 'pending':
                    $Transaksi->update(['StatusPembayaran' => 2]);
                    Log::info('Payment pending for Order ID: ' . $request->order_id);
                    break;
                case 'deny':
                    $Transaksi->update(['StatusPembayaran' => 0]);
                    Log::warning('Payment denied for Order ID: ' . $request->order_id);
                    break;
                case 'expire':
                    $Transaksi->update(['StatusPembayaran' => 4]);
                    Log::info('Payment expired for Order ID: ' . $request->order_id);
                    break;
                case 'cancel':
                    $Transaksi->update(['StatusPembayaran' => 3]);
                    Log::info('Payment canceled for Order ID: ' . $request->order_id);
                    break;
                default:
                    Log::warning('Unhandled transaction status for Order ID: ' . $request->order_id);
                    break;
            }

            // Kembalikan respon sukses ke Midtrans
            return response()->json(['message' => 'Notification handled successfully'], 200);
        } else {
            Log::warning('Invalid signature key for Order ID: ' . $request->order_id);
            return response()->json(['message' => 'Invalid signature key'], 400);
        }
    }
    // public function checkOut(Request $request)
    // {
    //     try {
    //         \Midtrans\Config::$serverKey = config('midtrans.server_key');
    //         \Midtrans\Config::$isProduction = false;
    //         \Midtrans\Config::$isSanitized = true;
    //         \Midtrans\Config::$is3ds = true;

    //         $idPenyewa = auth()->user()->id;
    //         $tanggal = date('Ymd');
    //         $jam = date('His');
    //         $idTransaksi = $idPenyewa . $tanggal . $jam;

    //         $params = array(
    //             'transaction_details' => array(
    //                 'order_id' => $idTransaksi,
    //                 'gross_amount' => $request->TotalBayar,
    //             ),
    //             'customer_details' => array(
    //                 'first_name' => auth()->user()->nama,
    //                 'email' => auth()->user()->email
    //             ),
    //             'item_details' => array (
    //                 array(
    //                     'id' => 'kos',
    //                     'price' => $request->TotalBayar,
    //                     'quantity' => 1,
    //                     'name' => 'bayar kos'
    //                 )
    //             ),
    //             // 'callbacks' => array(
    //             //     'finish' => route('transaction.midtrans-callback'),
    //             // ),
    //         );

    //         $snapToken = \Midtrans\Snap::getSnapToken($params);

    //         return response()->json(['snapToken' => $snapToken], 200);
    //     } catch (\Exception $e) {
    //         Log::error('Error checkout: ' . $e->getMessage());
    //         return response()->json(['error' => 'Terjadi kesalahan saat melakukan checkout'], 500);
    //     }
    // }


    // public function midtransCallback(Request $request)
    // {
    //     $serverKey = config('midtrans.server_key');
    //     $hashed = hash('sha512', $request->order_id . $request->status_code . $request->gross_amount . $serverKey);
    //     if ($hashed === $request->signature_key) {
    //         $DetailSewa = DetailSewa::where('idPenyewa', auth()->user()->id)->first();
    //         $Transaksi = new Transaksi();
    //         $Transaksi->id = $request->order_id;
    //         $Transaksi->idPenyewa = auth()->user()->id;
    //         $Transaksi->idDetailSewa = $DetailSewa->id;
    //         $Transaksi->TanggalBayar = date('Y-m-d');
    //         $Transaksi->TotalBayar = $request->gross_amount;
    //         if($request->transaction_status == 'capture')
    //         {
    //             $Transaksi->StatusPembayaran = 1;
    //             $Transaksi->save();
    //         }
    //     }
    // }


    // Perlu di optimisasi lagi, soal nya ini dia ngerequest setiap user refresh
    public function getTransactionsByIdPenyewa(Request $request)
    {
        // $AuthString = 'Basic ' . base64_encode(config('midtrans.server_key') . ':');
        // Log::info("Auth string: " . $AuthString);
        $transactions = Transaksi::where('idPenyewa', $request->id)->orderBy('TanggalBayar', 'desc')->get();

        // foreach($transactions as $transaction){

        //     $TransactionStatusResponse = http::withHeaders([
        //         'Accept' => 'application/json',
        //         'Content-Type' => 'application/json',
        //         'Authorization' => $AuthString,
        //     ])->get('https://api.sandbox.midtrans.com/v2/'. $transaction->id .'/status');
        //     $transactionStatus = $TransactionStatusResponse->json('transaction_status');
        //     $statusToUpdate = match($transactionStatus) {
        //         'capture', 'settlement' => 1,
        //         'pending' => 2,
        //         'failure' => 0,
        //         'expire' => 4,
        //         'cancel' => 3,
        //         'deny' => 0,
        //         default => null,
        //     };
        //     if($statusToUpdate !== null){
        //         $transaction->update(['StatusPembayaran' => $statusToUpdate]);
        //         Log::info('Status transaksi diupdate: ' . $transactionStatus);
        //     }else{
        //         Log::warning('Status transaksi tidak dikenali: ' . $transactionStatus);
        //     }

        // }
        return response()->json($transactions);
    }

    public function getAllTransaction(Request $request)
    {
        $transaction = Transaksi::all();
        Log::info('Page requesting all transaction)');
        return response()->json($transaction);
    }

    public function syncAllTransaction(Request $request)
    {

        $AuthString = 'Basic ' . base64_encode(config('midtrans.server_key') . ':');
        Log::info("Auth string: " . $AuthString);
        $transactions = Transaksi::all();
        foreach ($transactions as $transaction) {

            $TransactionStatusResponse = http::withHeaders([
                'Accept' => 'application/json',
                'Content-Type' => 'application/json',
                'Authorization' => $AuthString,
            ])->get('https://api.sandbox.midtrans.com/v2/' . $transaction->id . '/status');
            $transactionStatus = $TransactionStatusResponse->json('transaction_status');
            $statusToUpdate = match ($transactionStatus) {
                'capture', 'settlement' => 1,
                'pending' => 2,
                'failure' => 0,
                'expire' => 4,
                'cancel' => 3,
                'deny' => 0,
                default => null,
            };
            if ($statusToUpdate !== null) {
                $transaction->update(['StatusPembayaran' => $statusToUpdate]);
                Log::info('Status transaksi diupdate: ' . $transactionStatus);
            } else {
                Log::warning('Status transaksi tidak dikenali: ' . $transactionStatus);
            }
        }

        return response()->json($transactions);
    }

    public function updateTransactionStatusBySnapToken(Request $request)
    {
        $transaction = Transaksi::where('snapToken', $request->snapToken)->first();
        $transactionStatus = match ($request->transactionStatus) {
            'capture' => 1,
            'settlement' => 1,
            'pending' => 2,
            'failure' => 0,
            'expire' => 4,
            'cancel' => 3,
            'deny' => 0,
            default => null,
        };

        if ($transaction->StatusPembayaran !== $transactionStatus) {
            // Update status transaksi berdasarkan status dari request
            switch ($request->transactionStatus) {
                case 'capture':
                case 'settlement':
                    $transaction->update(['StatusPembayaran' => 1]);
                    Log::info('Payment ' . $transactionStatus . ' successfully for Order ID: ' . $transaction->id);
                    break;
                case 'pending':
                    $transaction->update(['StatusPembayaran' => 2]);
                    Log::info('Payment ' . $transactionStatus . ' for Order ID: ' . $transaction->id);
                    break;
                case 'cancel':
                    $transaction->update(['StatusPembayaran' => 3]);
                    Log::info('Payment ' . $transactionStatus . ' for Order ID: ' . $transaction->id);
                    break;
                case 'deny':
                    $transaction->update(['StatusPembayaran' => 0]);
                    Log::info('Payment ' . $transactionStatus . ' for Order ID: ' . $transaction->id);
                    break;
                case 'expire':
                    $transaction->update(['StatusPembayaran' => 4]);
                    Log::info('Payment ' . $transactionStatus . ' for Order ID: ' . $transaction->id);
                    break;
                default:
                    Log::error('Invalid transaction status: ' . $transactionStatus);
                    break;
            }
        }
        else{
            Log::info('SnapToken ' . $request->snapToken . ' already updated');
        }
    }
}
