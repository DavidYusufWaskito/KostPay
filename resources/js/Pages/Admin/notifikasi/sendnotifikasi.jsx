import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Alert , Snackbar} from "@mui/material";
import AdminHeader from "@/Layouts/Admin/AdminHeader";

export default function sendNotifikasi({ auth }) {
    const [penyewaData,setPenyewaData] = useState();
    const [alertOpen, setAlertOpen] = useState({
        open: false,
        message: "",
        severity:"",
    });
    const [formData, setFormData] = useState({
        idPenyewa:null,
        idAdmin: auth.user.id,
        Pesan:"",

    })

    useEffect(() => {
        fetchPenyewa();
    }, []);

    const fetchPenyewa = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            }
        }
        console.log("requesting Penyewa...");

        const response = await fetch('/admin/get/penyewa', requestConfig);
        const responseJSON = await response.json();
        if (response.ok)
        {
            setPenyewaData(responseJSON);
            setAlertOpen({open: false, message: responseJSON.message, severity: "success"});
        }

    }

    const sendNotifikasi = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({
                idPenyewa: formData.idPenyewa,
                idAdmin: auth.user.id,
                Pesan: formData.Pesan
            })
        }

        const response = await fetch('/admin/send/notif', requestConfig);
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (response.ok)
        {
            // alert("Notifikasi Terkirim");
            setAlertOpen({open: true, message: responseJSON.message, severity: "success"});

            setFormData({
                idAdmin: auth.user.id,
                Pesan:"",
            });
        }
        else
        {
            setAlertOpen({open: true, message: responseJSON.error, severity: "error"});
        }
    }

    return (
        <>
            <div className="overflow-y-auto h-full">
                <AdminHeader auth={auth} />

                <Snackbar open={alertOpen.open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={5000} onClose={() => setAlertOpen({open: false, message: "", severity: ""})}>
                    <Alert severity={alertOpen.severity}>{alertOpen.message}</Alert>
                </Snackbar>
                <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
            
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="rounded shadow p-4">
                            <div>
                                <h1 className="text-2xl text-center font-semibold text-gray-800">Kirim Notifikasi</h1>
                            </div>
                            <div>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    sendNotifikasi();
                                
                                }}>
                                    <div className="flex flex-col">
                                        <label className="text-xl">
                                            <span>Pilih Penyewa</span>
                                        </label>
                                        <select onChange={(e) => setFormData({ ...formData, idPenyewa: e.target.value })} required className=" rounded-lg w-[20%]">
                                            <option key={0}>Pilih Penyewa</option>
                                            {
                                                penyewaData && (
                                                    penyewaData.map((penyewa) => (
                                                        <option key={penyewa.id} value={penyewa.id}>{penyewa.nama}</option>
                                                    ))
                                                )
                                            }
                                        </select>
                                    </div>
                                    <div className="form-control mt-4">
                                        <label className="text-xl">
                                            <span>Isi Pesan</span>
                                        </label>
                                        <textarea name="message" id="message" className="rounded h-24 w-full" required value={formData.Pesan} onChange={(e) => setFormData({ ...formData, Pesan: e.target.value })} placeholder="Masukkan pesan notifikasi"></textarea>
                                    </div>
                                    <button className="bg-blue-500 px-5 py-2 rounded-lg text-white font-semibold mt-4">Kirim</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}