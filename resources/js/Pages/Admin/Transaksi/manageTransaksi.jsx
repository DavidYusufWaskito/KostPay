import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import AdminHeader from "@/Layouts/Admin/AdminHeader";
import CustomLoading from "@/Components/DatatableComponent/CustomLoading";
import CustomPaginationComponent from "@/Components/DatatableComponent/CustomPagination";
import StatusPembayaran from "@/Components/DatatableComponent/StatusPembayaran";
export default function manageTransaksi({ auth }) {
    const [TransactionData, setTransactionData] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [TablePending, setTablePending] = useState(true);

    const [LoadingText, setLoadingText] = useState("Memuat data...");

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
            item.id.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.TotalBayar.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Mengambil data yang diperlukan berdasarkan jumlah baris per halaman dan halaman saat ini
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);


    const fetchTransactionDeprecated = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            }
        }
        setLoadingText("Memuat data...");
        const response = await fetch('/admin/get/all/transaksi', requestConfig);
        const responseJSON = await response.json();
        console.log(responseJSON);
        setTransactionData((e) => { return responseJSON });
        setTablePending(false);
        console.log(TransactionData)
    }

    const fetchTransaction = async () => {
        setLoadingText("Memuat data...");
        setTablePending(true);
        axios.post('/admin/get/all/transaksi')
            .then(response => {
                const responseJSON = response.data;
                console.log(responseJSON);
                setTransactionData((e) => { return responseJSON });
                setTablePending(false);
                console.log(TransactionData)
            })
            .catch(error => {
                console.log(error);
                alert(error.response.data.error);
            })
    }

    const syncTransactionDeprecated = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            }
        }
        setLoadingText("Mensinkronkan data ke midtrans...");
        setTablePending(true);
        const response = await fetch('/admin/sync/all/transaksi', requestConfig);
        const responseJSON = await response.json();
        console.log(responseJSON);
        setTransactionData((e) => { return responseJSON });
        setTablePending(false);
        console.log(TransactionData)
    }

    const syncTransaction = async () => {
        setLoadingText("Mensinkronkan data ke midtrans...");
        setTablePending(true);
        axios.post('/admin/sync/all/transaksi')
            .then(response => {
                const responseJSON = response.data;
                console.log(responseJSON);
                setTransactionData((e) => { return responseJSON });
                setTablePending(false);
                console.log(TransactionData)
            })
            .catch(error => {
                console.log(error);
                alert(error.response.data.error);
            })
    }

    useEffect(() => {
        fetchTransaction();
    }, [])

    return (
        <>
            <div className="overflow-y-auto h-full">
                <AdminHeader auth={auth} />
                <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">

                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">


                        <div className="bg-white rounded border border-gray-200 p-4">
                            <div className="flex items-center justify-between mb-4">
                                <h1 className="text-2xl font-semibold text-gray-900">Manage Transaksi</h1>
                                <p className="text-sm text-gray-600">Selamat datang {' ' + auth.user.nama}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded border border-gray-200 p-4 mt-4">
                            <div className="flex items-center justify-between">
                                <input
                                    type="text"
                                    placeholder="Cari..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    className="mb-4 p-2 border border-gray-300 rounded"
                                />

                                <div className="text-center text-gray-600">
                                    <p>Sync midtrans</p>
                                    <button onClick={() => syncTransaction()} className="bg-blue-500 text-white w-12 h-12 rounded-full">
                                        <FontAwesomeIcon icon={faSync} />
                                    </button>
                                </div>
                            </div>
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
                                        sortable: true,
                                    },
                                ]}
                                data={paginatedData}
                                pagination
                                highlightOnHover
                                striped
                                progressPending={TablePending}
                                progressComponent={
                                    <CustomLoading loadingText={LoadingText} />
                                }
                                pointerOnHover
                                paginationServer
                                paginationComponent={() => (
                                    <CustomPaginationComponent
                                        rowsPerPageText="Baris per halaman:"
                                        rangeSeparatorText="Dari"
                                        selectAllRowsItem={true}
                                        selectAllRowsItemText="Semua"
                                        rowsPerPageOptions={[5, 10, 20, 30, 40]}
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
        </>
    );
}