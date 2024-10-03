import { Head, Link } from "@inertiajs/react";
import { useEffect, useState} from "react";
import PenyewaHeader from "@/Layouts/Penyewa/PenyewaHeader";
import DataTable from "react-data-table-component";
import CustomPaginationComponent from "@/Components/DatatableComponent/CustomPagination";
import Modal from "@/Components/Modal";
import NumberInput from "@/Components/NumberInput";
import StatusPembayaran from "@/Components/DatatableComponent/StatusPembayaran";
import CustomLoading from "@/Components/DatatableComponent/CustomLoading";
import { useMidtrans } from "@/Components/useMidtrans";
import { Snackbar,SnackbarContent } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBill,faClipboard } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
export default function PenyewaDashboard({
    auth,
    DetailSewa,
    Kamar,
    MIDTRANS_CLIENT_KEY,
    minimal_pembayaran,
}) {
    const [TransactionData, setTransactionData] = useState([]);
    const [TagihanData, setTagihanData] = useState([]);
    const [showBayarModal, setShowBayarModal] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const [paymentData, setPaymentData] = useState({
        TotalBayar: 0,
        idDetailSewa: DetailSewa.id,
    });

    // Fetching transaction data
    useEffect(() => {
        // getTransactions();
        getTagihan();
    }, []);

    // Pakai midtrans
    useMidtrans(MIDTRANS_CLIENT_KEY);

    // open snap
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
                        "Kamu belum bayar loh!, silahkan klik kolom riwayat transaksi yang berstatus belum bayar untuk membayar tagihanmu!",
                    severity: "warning",
                });
            },
        });
    };

    const getSnapToken = async () => {
        console.log("Requesting snap token");
        console.log(paymentData);

        axios
            .post(
                "/penyewa/bayar",
                {
                    TotalBayar: paymentData.TotalBayar,
                    idDetailSewa: paymentData.idDetailSewa,
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

    const getTransactions = () => {
        axios
            .post(
                "/penyewa/transactions",
                {
                    id: auth.user.id,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        //   'X-CSRF-TOKEN': readCookie('XSRF-TOKEN')
                    },
                }
            )
            .then((response) => {
                const responseJSON = response.data;
                console.log(responseJSON);
                setTransactionData((e) => {
                    return responseJSON;
                });
                setTablePending(false);
                console.log(TransactionData);
            })
            .catch((error) => {
                console.log(error);
                alert(error.response.data.error);
            });
    };

    const getTagihan = () => {
        axios.get("api/tagihan/detail-sewa/" + DetailSewa.id).then((response) => {
            setTagihanData((e) => {
                return response.data;
            });

            console.log(response.data);
        })
    };

    const handleBayarClick = () => {
        getSnapToken();
    };

    return (
        <div className="overflow-y-auto h-full">
            <PenyewaHeader auth={auth}/>

                        {/* Snackbar notifikasi */}
            <Snackbar open={openSnackbar.open} onClose={() => setOpenSnackbar({open: false})} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                <SnackbarContent style={{backgroundColor: openSnackbar.severity === 'success' ? 'green' : 'red'}} message={openSnackbar.message} />
            </Snackbar>

            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded border border-gray-200 p-10">
                    {
                        TagihanData.length > 0 ?
                            TagihanData.map((data, index) => {
                                return (
                                    <div key={index} className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm text-gray-500">Tagihan jatuh tempo pada {new Date(data.TanggalJatuhTempo).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</p>
                                            <p className="text-3xl font-bold mt-2">Rp{new Intl.NumberFormat('id-ID').format(data.JumlahTagihan)}</p>
                                        </div>
                                        {/* <button onClick={handleBayarClick} className="h-fit px-5 py-2 border border-green-500 rounded-full">
                                            <p className="text-lg font-bold text-green-500">Bayar</p>
                                        </button> */}
                                        <Link href={route('penyewa.detailbayar', {idTagihan: data.id})} className="h-fit px-5 py-2 border border-green-500 rounded-full">
                                            <p className="text-lg font-bold text-green-500">Bayar</p>
                                        </Link>
                                    </div>
                                );
                            }):
                            <p className="text-center text-2xl font-bold">Hore tidak ada tagihan</p>
                    }
                        {/* <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-gray-500">Tagihan jatuh tempo pada {new Date(DetailSewa.TanggalJatuhTempo).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</p>
                                <p className="text-3xl font-bold mt-2">Rp{new Intl.NumberFormat('id-ID').format(auth.user.tunggakan)}</p>
                            </div>
                            <button className="h-fit px-5 py-2 border border-green-500 rounded-full">
                                <p className="text-lg font-bold text-green-500">Bayar</p>
                            </button>
                        </div> */}
                    </div>
                    <div className="bg-white mt-5 border border-gray-200 flex flex-col gap-2">
                        <button className="flex items-center p-5 w-full">
                            <FontAwesomeIcon icon={faMoneyBill} className="text-4xl w-20"/>
                            <p className="text-lg font-bold">Daftar tagihan</p>
                        </button>
                        <span className="w-[90%] mx-auto border-b border-gray-200"></span>
                        <Link href={route('penyewa.riwayatTransaksi')} className="flex items-center p-5 w-full">
                            <FontAwesomeIcon icon={faClipboard} className="text-4xl w-20"/>
                            <p className="text-lg font-bold">Riwayat transaksi</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
