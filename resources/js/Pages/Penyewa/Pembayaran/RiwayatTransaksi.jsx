import { useState,useEffect } from "react";
import { useMidtrans } from "@/Components/useMidtrans";
import PenyewaHeader from "@/Layouts/Penyewa/PenyewaHeader";
import { Snackbar,SnackbarContent } from "@mui/material";
export default function RiwayatTransaksi({auth,Tagihan,MIDTRANS_CLIENT_KEY,Transaksi}) {

    const [pendingTransaction ,setPendingTransaction] = useState(null);
    const [openSnackbar,setOpenSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    })
    // Use midtrans
    useMidtrans(MIDTRANS_CLIENT_KEY);
    useEffect(() => {
       console.log(Transaksi); 
    },[])

    const getPendingTransaction = async () => {
        axios.get("/api/transaksi/pending/"+Tagihan.id)
            .then((response) => {
                console.log(response.data);
                setPendingTransaction(response.data);
                
            }).catch((error) => {
                console.log(error);
            });
        // setPaymentData({ ...paymentData, TotalBayar: data.total });

    };

    const cancelPendingTransaction = async (idTransaksi) => {
        axios.put("/api/transaksi/pending/cancel/"+idTransaksi)
            .then((response) => {
                console.log(response.data);
                setCancelModal(false);
                setOpenSnackbar({
                    open: true,
                    message: 'Transaksi dibatalkan',
                    severity: 'success',
                });
                setPendingTransaction(null);
            }).catch((error) => {
                console.log(error);
            });
    };

    // Fungsi untuk mengelompokkan transaksi berdasarkan bulan dan tahun
    const groupByMonth = (transactions) => {
        return transactions.reduce((groups, transaction) => {
            const date = new Date(transaction.TanggalBayar);
            const monthYear = date.toLocaleString('id-ID', { month: 'long', year: 'numeric' });
            
            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }
            groups[monthYear].push(transaction);
            return groups;
        }, {});
    };

    const groupedTransactions = groupByMonth(Transaksi);
    const sortMonthYear = (a, b) => {
        // Pisahkan dan convert bulan dan tahun ke date
        const [monthA, yearA] = a.split(' ');
        const [monthB, yearB] = b.split(' ');
        const monthNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
        const dateA = new Date(`${yearA}-${monthNames.indexOf(monthA) + 1}-01`);
        const dateB = new Date(`${yearB}-${monthNames.indexOf(monthB) + 1}-01`);
        
        // Sort Descending
        return new Date(dateB) - new Date(dateA);
    }

    return (
        <div className="overflow-y-auto h-full">
            <PenyewaHeader auth={auth} />
            <Snackbar open={openSnackbar.open} onClose={() => setOpenSnackbar({open: false})} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                <SnackbarContent style={{backgroundColor: openSnackbar.severity === 'success' ? 'green' : 'red'}} message={openSnackbar.message} />
            </Snackbar>
            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded border border-gray-200 p-4">
                        <div className="flex flex-col">
                        {
                            Object.keys(groupedTransactions).length > 0 ? (
                                Object.keys(groupedTransactions).sort(sortMonthYear).map((monthYear, index) => {
                                    // Filter transaksi berdasarkan StatusPembayaran == 1
                                    const filteredTransactions = groupedTransactions[monthYear].filter(data => data.StatusPembayaran == 1).sort((a, b) => new Date(b.TanggalBayar) - new Date(a.TanggalBayar)); // Urutkan secara descending berdasarkan TanggalBayar;
                                    return filteredTransactions.length > 0 ? (
                                        <div className="flex flex-col" key={index}>
                                            <div className="w-full font-bold text-lg">{monthYear}</div>
                                            <div className="w-full">
                                                {filteredTransactions.map((data, idx) => (
                                                    <div className="flex justify-between odd:bg-gray-100 pl-4" key={idx}>
                                                        <p>Pembayaran tagihan kost</p>
                                                        <div className="flex flex-col gap-2">
                                                            <p className="font-bold text-green-600 text-end">Rp{new Intl.NumberFormat('id-ID').format(data.TotalBayar)}</p>
                                                            <div>{new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(data.TanggalBayar))}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null; // Hanya tampilkan jika ada transaksi yang sesuai
                                })
                            ) : (
                                <div className="w-full">
                                    Belum ada transaksi
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}