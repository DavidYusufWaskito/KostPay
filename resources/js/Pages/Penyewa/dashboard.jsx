import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useEffect, useState } from "react";
import Navbar from '@/Layouts/Navbar';
import { faWifi ,faShower, faBed} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import CustomPaginationComponent from "@/Components/DatatableComponent/CustomPagination";
import Modal from "@/Components/Modal";
import TextInput from "@/Components/TextInput";
import NumberInput from "@/Components/NumberInput";
import StatusPembayaran from "@/Components/DatatableComponent/StatusPembayaran";
export default function PenyewaDashboard({ auth,DetailKamar, Kamar,MIDTRANS_CLIENT_KEY}) {
    const [TransactionData, setTransactionData] = useState([]);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [showBayarModal, setShowBayarModal] = useState(false);

    const [searchQuery, setSearchQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);


    const [paymentData,setPaymentData] = useState({
        TotalBayar: 0,
        idDetailKamar:DetailKamar.id
    })


    const toggleProfileDropdown = () => {
        setProfileDropdownOpen(!profileDropdownOpen);
    };

    const handleSearch = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleChangeRowsPerPage = (newRowsPerPage) => {
        setRowsPerPage(newRowsPerPage);
        setCurrentPage(1);
    };

    const handleChangePage = (newPage) => {
        console.log(currentPage);
        setCurrentPage(newPage);
    };

    const filteredData = TransactionData.filter((item) => {
        return (
            item.TotalBayar.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Mengambil data yang diperlukan berdasarkan jumlah baris per halaman dan halaman saat ini
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Check window width and set profile dropdown to false
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setProfileDropdownOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    // Fetching transaction data
    useEffect(() => {
        getTransactions();
    },[])
    useEffect(() => {
        // You can also change below url value to any script url you wish to load, 
        // for example this is snap.js for Sandbox Env (Note: remove `.sandbox` from url if you want to use production version)
        const midtransScriptUrl = 'https://app.sandbox.midtrans.com/snap/snap.js';  
      
        let scriptTag = document.createElement('script');
        scriptTag.src = midtransScriptUrl;
      
        // Optional: set script attribute, for example snap.js have data-client-key attribute 
        // (change the value according to your client-key)
        const myMidtransClientKey = MIDTRANS_CLIENT_KEY;
        scriptTag.setAttribute('data-client-key', myMidtransClientKey);
      
        document.body.appendChild(scriptTag);
        
        return () => {
          document.body.removeChild(scriptTag);
        }
      }, []);

      
    const getSnapToken = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({
                TotalBayar: paymentData.TotalBayar,
                idDetailKamar: paymentData.idDetailKamar
            })
        }

        console.log('Requesting snap token');
        console.log(paymentData);
        const response = await fetch('/penyewa/bayar', requestConfig);
        console.log(response);
        const responseJSON = await response.json();
        console.log(responseJSON);
        if (response.ok) {
            window.snap.pay(responseJSON.snapToken);
        }
        else{
            alert(responseJSON.error);
        }
    }

    const getTransactions = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': token
          },
          body: JSON.stringify({
            id: auth.user.id
          })
        }
        const response = await fetch('/penyewa/transactions', requestConfig);
        const responseJSON = await response.json();
        console.log(responseJSON);
        setTransactionData((e) => {return responseJSON});
        console.log(TransactionData)
      }

    
      const handleBayarClick = () => {
        getSnapToken();
      }
      
      // Panggil fungsi handleBayarClick saat tombol bayar diklik
      
      // Then somewhere else on your React component, `window.snap` global object will be available to use
      // e.g. you can then call `window.snap.pay( ... )` function.

    const getNumber = (_str) => {
        const arr = _str.split('');
        const out = arr.filter(c => !isNaN(c)).join('');
        return Number(out);
    };


    return (
        <div className="overflow-y-auto h-full">
            <Head title="Home" />
            <Navbar className={"bg-[#FFBF69] z-10"}>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Dashboard
                </Link>
                <Link href={route('daftar')} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Riwayat transaksi
                </Link>
                <button onClick={toggleProfileDropdown} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 max-md:hidden" id="menu-button" aria-expanded={profileDropdownOpen} aria-haspopup="true">
                    Profil
                </button>
                <div className="max-md:border-t-[1px]">
                    <div className="max-md:text-slate-500/50 max-md:pt-1 max-md:ps-2 text-sm hidden max-md:block">
                        Profile
                    </div>
                    <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 hidden max-md:block ">
                        Account settings
                    </Link>
                    <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 hidden max-md:block " method="post" href={route('logout')}>
                        Sign out
                    </Link>
                </div>
            </Navbar>

            {/* Dropdown profil */}
            {profileDropdownOpen && (
                <div className="absolute right-0 z-10 mt-20 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                    <div className="py-1" role="none">
                        <Link href="#" className="text-gray-700 block px-4 py-2 text-sm hover:text-[#EB5160]" role="menuitem" tabIndex="-1" id="menu-item-0">Account settings</Link>
                        <Link className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:text-[#EB5160]" method="post" href={route('logout')} as="button">
                            Sign out
                        </Link>
                    </div>
                </div>
            )}

            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded shadow p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                            <p className="text-sm text-gray-600">Selamat datang {' ' + auth.user.nama}</p>
                        </div>
                    </div>
                    
                    {/* Jumlah tagihan */}
                    <div className="bg-white rounded shadow p-4 mt-4 mb-4">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Detail Tagihan</h2>
                        {DetailKamar && (
                            <div>
                                <div key={DetailKamar.id} className="flex items-center justify-between mb-4">
                                    <div className="border-s-2 ps-4 border-gray-200">
                                        <div className="text-lg font-medium text-gray-600">
                                            Nomor kamar
                                        </div>
                                        <div className="text-center text-gray-600 mt-4">
                                            {DetailKamar.idKamar}
                                        </div>
                                    </div>
                                    <div className=" border-gray-200">
                                        <div className="text-lg font-medium text-gray-600">
                                            Tanggal sewa
                                        </div>
                                        <div className="text-center text-gray-600 mt-4">
                                            {DetailKamar.TanggalSewa}
                                        </div>
                                    </div>
                                    <div className=" border-gray-200">
                                        <div className="text-lg font-medium text-gray-600">
                                            Total
                                        </div>
                                        <div className="text-center text-gray-600 mt-4">
                                            Rp. {new Intl.NumberFormat('id-ID').format(auth.user.tunggakan)}
                                        </div>
                                    </div>
                                    <div className="border-r-2 pr-4 border-gray-200">
                                        <div className="text-lg font-medium text-gray-600">
                                            Tanggal jatuh tempo
                                        </div>
                                        <div className="text-center text-gray-600 mt-4">
                                            {DetailKamar.TanggalJatuhTempo}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <button onClick={() => setShowBayarModal(true)} className="rounded before:ease relative h-12 w-40 overflow-hidden border border-green-500 bg-green-500 text-white transition-all before:absolute before:right-0 before:top-0 before:h-12 before:w-6 before:translate-x-12 before:rotate-6 before:bg-white before:opacity-10 before:duration-700 hover:before:-translate-x-40">Bayar</button>
                    </div>
                    
                    <Modal show={showBayarModal} onClose={() => setShowBayarModal(false)} title="Bayar Tagihan">
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <div className="space-y-4">
                                {/* Jumlah tagihan */}
                                <div className=" text-center">
                                    <label className="block text-gray-700 font-bold mb-2">Jumlah Tagihan</label>
                                    <div className="mt-[20%] mb-[20%] text-4xl">
                                        Rp. {new Intl.NumberFormat('id-ID').format(auth.user.tunggakan)}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-700 font-bold mb-2">Jumlah yang ingin dibayar</label>
                                    <div className="flex items-center gap-5">
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
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded" onClick={
                                            () => {
                                                var num = auth.user.tunggakan;
                                                document.getElementById("InputTotalBayar").value = num.toLocaleString();
                                                setPaymentData({
                                                    ...paymentData,
                                                    TotalBayar: num,
                                                });
                                            }
                                        }>Bayar full</button>

                                    </div>
                                </div>
                                {DetailKamar && (
                                    <div>
                                        <div key={DetailKamar.id} className="flex items-center justify-between mb-4">
                                            <div>
                                                <div className="text-lg font-medium text-gray-600">
                                                    Harga sewa
                                                </div>
                                                <div className="text-center text-gray-600 mt-4">
                                                    Rp. {new Intl.NumberFormat('id-ID').format(Kamar.HargaSewa)}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-medium text-gray-600">
                                                    Tanggal sewa
                                                </div>
                                                <div className="text-center text-gray-600 mt-4">
                                                    {new Date(DetailKamar.TanggalSewa).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-medium text-gray-600">
                                                    Tanggal Jatuh Tempo
                                                </div>
                                                <div className="text-center text-gray-600 mt-4">
                                                    {new Date(DetailKamar.TanggalJatuhTempo).toLocaleDateString()}
                                                </div>
                                            </div>
                                            {/* <p>{`Nomor Kamar: ${DetailKamar.idKamar}`}</p>
                                            <p>{`Harga Sewa: Rp. ${new Intl.NumberFormat('id-ID').format(Kamar.HargaSewa)}`}</p>
                                            <p>{`Tanggal Sewa: ${new Date(DetailKamar.TanggalSewa).toLocaleDateString()}`}</p>
                                            <p>{`Tanggal Jatuh Tempo: ${new Date(DetailKamar.TanggalJatuhTempo).toLocaleDateString()}`}</p> */}
                                        </div>
                                    </div>
                                )}

                                {/* Footer */}

                                <div className={"flex gap-5"}>
                                    <button onClick={(e)=>{
                                        e.preventDefault();

                                        handleBayarClick();
                                    }} type="submit" className="bg-blue-500 text-white px-4 py-2 w-full rounded-md">Bayar</button>
                                    <button onClick={() => {
                                        setShowBayarModal(false);
                                        setPaymentData({
                                            ...paymentData,
                                            TotalBayar: '',
                                        });
                                        }} className="bg-red-500 text-white px-4 py-2 w-[30%] rounded-md">Batal</button>
                                </div>

                            </div>
                        </div>
                    </Modal>
                    

                    <div className="bg-white rounded shadow p-4 mt-4">
                        <input
                            type="text"
                            placeholder="Cari..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="mb-4 p-2 border border-gray-300 rounded"
                        />
                        <DataTable
                            columns={[
                                {
                                    name: 'Id Transaksi',
                                    selector: (row) => row.id,
                                    sortable: true,
                                },
                                {
                                    name: 'Tanggal Bayar',
                                    selector: (row) => new Date(row.TanggalBayar).toLocaleDateString(),
                                    sortable: true,
                                },
                                {
                                    name: 'Total Bayar',
                                    selector: (row) => new Intl.NumberFormat('id-ID').format(row.TotalBayar),
                                    sortable: true,
                                },
                                {
                                    name: 'Status Pembayaran',
                                    cell: (row) => (
                                        <StatusPembayaran status={row.StatusPembayaran} />
                                        
                                    ),
                                    sortable:true,
                                },
                            ]}
                            data={paginatedData}
                            pagination
                            highlightOnHover
                            striped
                            pointerOnHover
                            onRowClicked={(row) => window.snap.pay(row.snapToken)}
                            paginationServer
                            paginationComponent={() => (
                                <CustomPaginationComponent
                                    rowsPerPageText="Baris per halaman:"
                                    rangeSeparatorText="Dari"
                                    selectAllRowsItem={true}
                                    selectAllRowsItemText="Semua"
                                    rowsPerPageOptions={[5,10, 20, 30, 40]}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    currentRowsPerPage={rowsPerPage}
                                    rowCount={TransactionData.length}
                                    currentPage={currentPage}
                                    onChangePage={handleChangePage}
                                />
                            )}
                            noDataComponent="Tidak ada transaksi!"
                        />
                    </div>

                </div>
            </div>
        </div>
    )

}