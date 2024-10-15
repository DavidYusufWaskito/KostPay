import PenyewaHeader from "@/Layouts/Penyewa/PenyewaHeader";
import PenyewaFooter from "@/Layouts/Penyewa/PenyewaFooter";
import { useState,useEffect } from "react";
import { useMidtrans } from "@/Components/useMidtrans";
import NumberInput from "@/Components/NumberInput";
import { Snackbar,SnackbarContent } from "@mui/material";
import Modal from "@/Components/Modal";

export default function Pembayaran({auth,Tagihan,MIDTRANS_CLIENT_KEY,minimal_pembayaran}) {
    const [paymentData,setPaymentData] = useState({
        TotalBayar: 0,
    });
    const [pendingTransaction ,setPendingTransaction] = useState(null);
    const [cancelModal,setCancelModal] = useState(false);
    const [openSnackbar,setOpenSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    })

    const getNumber = (_str) => {
        const arr = _str.split('');
        const out = arr.filter(c => !isNaN(c)).join('');
        return Number(out);
    };
    // Use midtrans
    useMidtrans(MIDTRANS_CLIENT_KEY);
    useEffect(() => {
       getPendingTransaction(); 

    },[])


    const openSnapWindow = (snapToken) => {
        window.snap.pay(snapToken, {
            onSuccess: function (result) {
                /* You may add your own implementation here */
                setOpenSnackbar({
                    open: true,
                    message: "Pembayaran berhasil!",
                    severity: "success",
                });
            },
            onPending: function (result) {
                /* You may add your own implementation here */
                setOpenSnackbar({
                    open: true,
                    message: "Menunggu pembayaran!",
                    severity: "pending",
                });
            },
            onError: function (result) {
                /* You may add your own implementation here */
                axios.post("transaksi/update/by/snap", {
                    snapToken: snapToken,
                    transactionStatus: "expire",
                });
                setOpenSnackbar({
                    open: true,
                    message: "Pembayaran gagal!",
                    severity: "error",
                });
            },
            onClose: function () {
                /* You may add your own implementation here */
                // alert('Kamu belum bayar loh!, silahkan klik kolom riwayat transaksi yang berstatus belum bayar untuk membayar tagihanmu!');
                setOpenSnackbar({
                    open: true,
                    message:
                        "Ada transaksi yang menunggu pembayaran!, silahkan klik bayar pada kolom transaksi yang berlangsung dibawah untuk membayar tagihanmu!",
                    severity: "warning",
                });
                getPendingTransaction();
            },
        });
    };

    const getSnapToken = async () => {
        console.log("Requesting snap token");
        console.log(paymentData);

        axios
            .post(
                "/api/transaksi/payment/snap",
                {
                    TotalBayar: paymentData.TotalBayar,
                    // idDetailSewa: paymentData.idDetailSewa,
                    idTagihan: Tagihan.id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        // 'X-CSRF-TOKEN': token
                    },
                }
            )
            .then((response) => {
                console.log(response);
                openSnapWindow(response.data.snapToken);
            })
            .catch((error) => {
                console.error("Error:", error.response.data.error);
                // alert(error.response.data.error);
                setOpenSnackbar({
                    open: true,
                    message: error.response.data.error,
                    severity: "error",
                });

                console.log(openSnackbar);
            });
    };

    const handleBayarClick = () => {
        getSnapToken();
    };

    const getPendingTransaction = async () => {
        axios.get("/api/transaksi/pending/penyewa/"+auth.user.id)
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

    
    return (
        <div className="overflow-y-auto h-full">
            <PenyewaHeader auth={auth} />
            <PenyewaFooter auth={auth} />
            <Snackbar open={openSnackbar.open} onClose={() => setOpenSnackbar({open: false})} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                <SnackbarContent style={{backgroundColor: openSnackbar.severity === 'success' ? 'green' : 'red'}} message={openSnackbar.message} />
            </Snackbar>

            {/* Modal Delete */}
            <Modal show={cancelModal} onClose={() => setCancelModal(false)}>
                <div className="p-4 w-full">
                    <div className="relative mb-4">
                        <h3 className="text-xl font-bold">Batalkan transaksi</h3>
                        {/* <button onClick={() => setCancelModal(false)} className="absolute top-0 right-0  px-4 py-2 rounded-md text-red-500 hover:text-red-700">
                            X
                        </button> */}
                    </div>
                    <div className="mb-4">
                        <p className="">Apakah anda yakin ingin membatalkan transaksi ini?</p>
                    </div>
                    <div className="flex mt-4 gap-5">
                        <button onClick={() => cancelPendingTransaction(pendingTransaction.Transaksi.id)} className="text-red rounded-lg hover:before:bg-redborder-red-500 relative h-[50px] w-full overflow-hidden border border-red-500 bg-white px-3 text-red-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-red-500 before:transition-all before:duration-500 hover:text-white hover:shadow-red-500 hover:before:left-0 hover:before:w-full"><span className="relative z-10">Ya</span></button>
                        <button onClick={() => setCancelModal(false)} className="w-full border border-blue-500 text-blue-500 px-5 py-2 rounded-md mr-2 transition-all duration-300 hover:bg-blue-500 hover:text-white">Tidak</button>
                    </div>
                </div>
            </Modal>
            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    
                    <div className="bg-white rounded border border-gray-200 p-4 min-h-[150px]">
                        <div className="flex flex-col">
                            <p className="text-gray-500 sm:text-sm md:text-base">Total tagihan saat ini</p>
                            <p className=" text-4xl font-bold">Rp{new Intl.NumberFormat('id-ID').format(Tagihan.JumlahTagihan)}</p>
                        </div>
                        <div className="flex flex-col mt-10">
                            <p className="text-gray-500 sm:text-sm md:text-base">Minimal pembayaran Rp{new Intl.NumberFormat('id-ID').format(minimal_pembayaran)}</p>
                            <NumberInput id="InputTotalBayar" className="w-full px-4 py-2 border border-gray-300 rounded-md" onChange={(e)=>{
                                const num = getNumber(e.target.value);
                                if (num === 0) {
                                    setPaymentData({
                                        ...paymentData,
                                        TotalBayar: '',
                                    })
                                } else {
                                    setPaymentData({
                                        ...paymentData,
                                        TotalBayar: num,
                                    })
                                }
                            }}/>
                            <button disabled={pendingTransaction !== null} onClick={handleBayarClick} className="mt-2 h-fit px-5 py-2 bg-green-500 disabled:bg-gray-500 rounded-lg">
                                <p className="text-lg font-bold text-white">Bayar</p>
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded border border-gray-200 p-4 mt-4">
                        {pendingTransaction !== null ? (
                            <div className="relative">
                                <button onClick={() => setCancelModal(true)} className="absolute right-0 top-0 h-fit px-5 py-2 border border-red-500 rounded-lg">
                                    <p className="text-lg font-bold text-red-500">Batalkan</p>
                                </button>

                                <div className="flex flex-col">
                                    <p className="text-sm text-gray-600">Menunggu pembayaran</p>
                                    <p className="text-4xl font-bold">Rp{new Intl.NumberFormat('id-ID').format(pendingTransaction.Transaksi.TotalBayar)}</p>
                                    <button onClick={() => {openSnapWindow(pendingTransaction.Transaksi.snapToken)}} className="mt-5 h-fit px-5 py-2 bg-green-500 disabled:bg-gray-500 rounded-lg">
                                        <p className="text-lg font-bold text-white">Bayar</p>
                                    </button>
                                </div>
                            </div>
                            
                        ) : (
                            <p className="text-sm text-gray-600">Tidak ada transaksi berlangsung</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );}