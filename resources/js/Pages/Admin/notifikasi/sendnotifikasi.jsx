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

    });

    const [msgLength, setMsgLength] = useState(0);

    useEffect(() => {
        fetchPenyewa();
    }, []);

    const fetchPenyewaDeprecated = async () => {
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

    const fetchPenyewa = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        axios.get('/api/admin/penyewa')
        .then((response) => {
            if (response.status !== 200) {
                alert('Terjadi kesalahan: ' + response.statusText);
            }else{
                setPenyewaData(response.data);
            }
        })
        .catch((error) => {
            console.log(error.response.data);
        });
    }

    const sendNotifikasiDeprecated = async () => {
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

            setFormData({ ...formData ,
                idAdmin: auth.user.id,
                Pesan:"",
            });
        }
        else
        {
            setAlertOpen({open: true, message: responseJSON.error, severity: "error"});
        }
    }

    const sendNotifikasi = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;

        const response = await axios.post('/api/admin/notifikasi', {
            idPenyewa: formData.idPenyewa,
            idAdmin: auth.user.id,
            Pesan: formData.Pesan
        })
        .then((response) => {
            console.log(response.data);
            if (response.status === 200)
            {
                // alert("Notifikasi Terkirim");
                setAlertOpen({open: true, message: response.data.message, severity: "success"});

                setFormData({ ...formData ,
                    idAdmin: auth.user.id,
                    Pesan:"",
                });
            }
            else
            {
                setAlertOpen({open: true, message: response.data.error, severity: "error"});
            }
            return response;
        })
        .catch((error) => {
            console.log(error.response.data);
        });
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
                                    console.log(formData);
                                }}>
                                    <div className="flex flex-col">
                                        <label className="text-xl">
                                            <span>Pilih Penyewa</span>
                                        </label>
                                        <select onChange={(e) => setFormData({ ...formData ,idPenyewa: e.target.value })} required className=" rounded-lg w-[20%]">
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
                                        <textarea name="message" id="message" className="rounded h-24 w-full" required maxLength="255" value={formData.Pesan} onChange={(e) => {
                                            const newText = e.target.value.slice(0, 255);
                                            setFormData({  ...formData ,Pesan: newText });
                                            setMsgLength(newText.length);
                                            
                                            }} placeholder="Masukkan pesan notifikasi"></textarea>
                                        {
                                            msgLength > 0 && (

                                                <span>{msgLength}/255 karakter</span>
                                            )
                                        }
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