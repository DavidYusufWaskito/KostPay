import { Snackbar,SnackbarContent } from "@mui/material";
import PenyewaHeader from "@/Layouts/Penyewa/PenyewaHeader";
import { useState,useEffect } from "react";
import { Link } from "@inertiajs/react";
import PenyewaFooter from "@/Layouts/Penyewa/PenyewaFooter";
export default function DaftarTagihan({ auth,DetailSewa,Tagihan}) {
    const [openSnackbar, setOpenSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });
    const [PageIndex, setPageIndex] = useState(0);
    const HandleChangeIndex = (index) => {
        setPageIndex(index);
    }
    return (
        <div className="overflow-y-auto h-full">
            <PenyewaHeader auth={auth} />
            <PenyewaFooter auth={auth} prevRoute={route('penyewa.dashboard')} />
            <Snackbar open={openSnackbar.open} onClose={() => setOpenSnackbar({open: false})} autoHideDuration={6000} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                <SnackbarContent style={{backgroundColor: openSnackbar.severity === 'success' ? 'green' : 'red'}} message={openSnackbar.message} />
            </Snackbar>

            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded border border-gray-200 flex flex-col justify-between">
                        <div className="relative flex h-fit select-none pt-5">
                            <button onClick={() => HandleChangeIndex(0)} className="w-1/2">
                                <p className="text-lg md:text-xl text-center text-gray-500 font-bold">Tagihan Yang Perlu Dibayar</p>
                            </button>
                            <button onClick={() => HandleChangeIndex(1)} className="w-1/2">
                                <p className="text-lg md:text-xl text-center text-gray-500 font-bold">Tagihan Yang belum lunas</p>
                            </button>
                            <div className={`absolute w-1/2 -bottom-5 border-b-2 border-b-green-500 transition-all duration-300 ` + (PageIndex === 0 ? "left-0" : "left-1/2")}></div>
                        </div>
                        <div className="mt-10">
                        {
                            PageIndex === 0 ? (
                                <div className="p-5">
                                    {Tagihan.length > 0 ? (
                                        <div className="flex justify-between items-center border border-gray-200 rounded p-5">
                                            <div>
                                                <p className="text-sm text-gray-500">Tagihan jatuh tempo pada {new Date(Tagihan[Tagihan.length - 1].TanggalJatuhTempo).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</p>
                                                <p className="text-3xl font-bold mt-2">Rp{new Intl.NumberFormat('id-ID').format(Tagihan[Tagihan.length - 1].JumlahTagihan)}</p>
                                            </div>
                                            <Link href={route('penyewa.detailbayar', {idTagihan: Tagihan[Tagihan.length - 1].id})} className="h-fit px-5 py-2 border border-green-500 rounded-full">
                                                <p className="text-lg font-bold text-green-500">Bayar</p>
                                            </Link>
                                        </div>
                                    ) : (
                                        <p className="text-lg font-bold text-gray-500 text-center">Tidak ada tagihan yang harus dibayar bulan ini.</p>
                                    )}
                                </div>
                            ) : (
                                <div className="p-5">
                                    {Tagihan.length > 0 ? (
                                        Tagihan.map((tagihan, index) => (
                                            <div key={index} className="mb-5">
                                                <div className="flex justify-between items-center border border-gray-200 rounded p-5">
                                                    <div>
                                                        <p className="text-sm text-gray-500">Tagihan jatuh tempo pada {new Date(tagihan.TanggalJatuhTempo).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }).replace(/ /g, ' ')}</p>
                                                        <p className="text-3xl font-bold mt-2">Rp{new Intl.NumberFormat('id-ID').format(tagihan.JumlahTagihan)}</p>
                                                    </div>
                                                    <Link href={route('penyewa.detailbayar', {idTagihan: tagihan.id})} className="h-fit px-5 py-2 border border-green-500 rounded-full">
                                                        <p className="text-lg font-bold text-green-500">Bayar</p>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-lg font-bold text-gray-500 text-center">Tidak ada tagihan</p>
                                    )}
                                </div>
                            )
                        }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}