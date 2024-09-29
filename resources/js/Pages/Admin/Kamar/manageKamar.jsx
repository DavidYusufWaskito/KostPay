import { Head, Link,useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Modal from "@/Components/Modal";
import {faEdit,faTrash,faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import CustomPaginationComponent from "@/Components/DatatableComponent/CustomPagination";
import TextInput from "@/Components/TextInput";
import AdminHeader from "@/Layouts/Admin/AdminHeader";
import InputError from "@/Components/InputError";

export default function ManageKamar({ auth, DetailKamar}) {
    const [kamarData, setKamarData] = useState([]);

    // const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [EditModal, setEditModal] = useState({show:false,rowData:null});
    const [DeleteModal, setDeleteModal] = useState({show:false,rowID:1});
    


    const [searchQuery, setSearchQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);


    const {data,setData,post,processing,errors,setError,reset} = useForm({
        HargaSewa:'',
        StatusKamar:0
    });


    // Initial Fetch Penyewa and reset form
    useEffect(() => {
        reset();
        fetchKamar();
    }, [])

    // Update rowData when EditModal is Open
    useEffect(() => {
        if(EditModal.show){
            setData((prevData) => ({
                ...prevData,
                HargaSewa:EditModal.rowData?.HargaSewa,
                StatusKamar:EditModal.rowData?.StatusKamar
            }));
        }
    },[EditModal.show,EditModal.rowData]);


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

    const fetchKamar = async () => {
        try {
            const response = await axios.get('/api/admin/kamar', {
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
                }
            });
            setKamarData(response.data);
        } catch (error) {
            alert('Terjadi kesalahan: ' + error);
        }
    }

    const filteredData = kamarData.filter((item) => {
        return (
            item.HargaSewa.toString().includes(searchQuery.toLowerCase())
        );
    });

    // Mengambil data yang diperlukan berdasarkan jumlah baris per halaman dan halaman saat ini
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Event handler CRUD

    const onStore = async () => {

        const response = await axios.post('/api/admin/kamar', {
            HargaSewa: data.HargaSewa,
            StatusKamar: data.StatusKamar
        }, {
            headers: {
                'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
            }
        }).then(() => {
            setShowAddModal(false);
            fetchKamar();
        }).catch((error) => {
            console.log(error.response?.data || error.message);
            setError("HargaSewa",error.response?.data?.errors.HargaSewa);
        });


    }

    const onEdit = async (idKamar) => {
        try {
            const response = await axios.put('/api/admin/kamar/' + idKamar, {
                // id: EditModal.rowData?.id,
                HargaSewa: data.HargaSewa,
                StatusKamar: data.StatusKamar
            }, {
                headers: {
                    'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
                }
            });
            setEditModal({ show: false, rowData: null });
            fetchKamar();
        } catch (error) {
            alert('Terjadi kesalahan: ' + error.response?.data?.message || error.message);
        }
    }

    const onDelete = async (idKamar) => {
        console.log("requesting delete");

        await axios.delete('/api/admin/kamar/' + idKamar, {
            headers: {
                'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content
            }
        }   )
            .then(() => {
                setDeleteModal({ show: false, rowID: 1 });
                fetchKamar();
            })
            .catch((error) => {
                console.log(error.response?.data || error.message);
                alert('Terjadi kesalahan: ' + error.response?.data?.message || error.message);
            });
    }

    return (
        <div className="overflow-y-auto h-full">
            <AdminHeader auth={auth} />

            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded shadow p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Manage Kamar</h1>
                            <p className="text-sm text-gray-600">Selamat datang {' ' + auth.user.nama}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded shadow p-4 mt-4">
                        <input
                            type="text"
                            placeholder="Cari kamar..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="mb-4 p-2 border border-gray-300 rounded"
                        />
                        <DataTable
                            columns={[
                                {
                                    name: 'No.',
                                    selector: (row, index) => index + 1 + (currentPage - 1) * rowsPerPage,
                                },
                                {
                                    name: 'Id Kamar',
                                    selector: (row) => row.id,
                                    sortable: true,
                                },
                                {
                                    name: 'Harga Sewa',
                                    selector: (row) => row.HargaSewa,
                                    sortable: true,
                                },
                                {
                                    name: 'Status',
                                    selector: (row) => row.StatusKamar,
                                    sortable:true,
                                },
                                {
                                    name: 'Aksi',
                                    cell: (row) => (
                                        <div className="flex justify-center gap-5">
                                            <button onClick={(e)=>{
                                                e.preventDefault();

                                                setEditModal({show:true,rowData:row});
                                            }} className="text-xl text-indigo-600 hover:text-indigo-900">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </button>
                                            <button onClick={(e)=>{
                                                e.preventDefault();
                                                setDeleteModal({show:true,rowID:row.id});
                                            }} className="text-xl text-red-600 hover:text-red-900">
                                                <FontAwesomeIcon icon={faTrash} />
                                            </button>
                                        </div>
                                    ),
                                },
                            ]}
                            data={paginatedData}
                            pagination
                            highlightOnHover
                            striped
                            pointerOnHover
                            paginationServer
                            // paginationRowsPerPageOptions={[10, 20, 30, 40]}
                            paginationComponent={() => (
                                <CustomPaginationComponent
                                    rowsPerPageText="Baris per halaman:"
                                    rangeSeparatorText="Dari"
                                    selectAllRowsItem={true}
                                    selectAllRowsItemText="Semua"
                                    rowsPerPageOptions={[5,10, 20, 30, 40]}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                    currentRowsPerPage={rowsPerPage}
                                    rowCount={filteredData.length}
                                    currentPage={currentPage}
                                    onChangePage={handleChangePage}
                                />
                            )}
                            paginationTotalRows={filteredData?.length}
                            noDataComponent="No data found"
                        />
                    </div>
                   
                    {/* Modal Component */}
                    <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Data Kamar">
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <div className="space-y-4">
                                {/* Harga Sewa */}
                                <label className="block text-gray-700 font-bold mb-2">Harga Sewa</label>
                                <TextInput placeholder="Harga Sewa" onChange={(e) => setData('HargaSewa',e.target.value)} className="w-full" />
                                <InputError message={errors.HargaSewa} className="mt-2" />
                                {/* Status */}
                                <label className="block text-gray-700 font-bold mb-2">Status</label>
                                <select className="w-full border border-gray-300 ring-blue-500 rounded-full" onChange={(e) => setData('StatusKamar',e.target.value)}>
                                    <option value={0}>
                                        Tidak terisi
                                    </option>
                                    <option value={1}>
                                        Terisi
                                    </option>
                                </select>
                                
                                {/* Footer */}

                                <div className={"flex gap-5"}>
                                    <button onClick={(e)=>{
                                        e.preventDefault();
                                        onStore();
                                    }} type="submit" className="bg-blue-500 text-white px-4 py-2 w-full rounded-md">Submit</button>
                                    <button onClick={() => setShowAddModal(false)} className="bg-red-500 text-white px-4 py-2 w-[30%] rounded-md">Batal</button>
                                </div>

                            </div>
                        </div>
                    </Modal>

                    {/* Button to Show Modal */}
                    <button onClick={() => setShowAddModal(true)} className="bg-blue-500 text-white mt-4 px-4 py-2 rounded-md">Tambah Data Kamar</button>


                    {/* Modal Edit */}
                    <Modal show={EditModal.show} onClose={() => setEditModal({show:false,rowData:null})} title="Edit Data Kamar">
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <div className="space-y-4">
                                {/* Harga Sewa */}
                                <label className="block text-gray-700 font-bold mb-2">Harga Sewa</label>
                                <TextInput value={data.HargaSewa || ''} onChange={(e) => setData('HargaSewa', e.target.value || '')} placeholder="Harga Sewa" className="w-full" />
                                {/* Status */}
                                <label className="block text-gray-700 font-bold mb-2">Status</label>
                                <TextInput value={data.StatusKamar || ''} onChange={(e) => setData('StatusKamar', e.target.value || '')} placeholder="Status" className="w-full" />
                                
                                {/* Footer */}

                                <div className={"flex gap-5"}>
                                    <button onClick={(e)=>{
                                        e.preventDefault();
                                        onEdit(EditModal.rowData?.id);
                                    }} type="submit" className="bg-blue-500 text-white px-4 py-2 w-full rounded-md">Submit</button>
                                    <button onClick={() => setEditModal({show:false,rowData:null})} className="bg-red-500 text-white px-4 py-2 w-[30%] rounded-md">Batal</button>
                                </div>

                            </div>
                        </div>
                    </Modal>


                    {/* Modal Delete */}
                    <Modal show={DeleteModal.show} onClose={() => setDeleteModal({show:false,rowID:1})}>
                        <div className="p-4 w-full ">
                            <div className="flex justify-between mb-4">
                                <h3 className="text-xl font-bold">Hapus Data</h3>
                                <button onClick={() => setDeleteModal({show:false,rowID:1})} className="text-red-500 hover:text-red-700">
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                            <div className="flex items-center justify-center gap-10">
                                <FontAwesomeIcon className="text-5xl text-red-500" icon={faTrash} />
                                <p className="text-center">Apakah anda yakin ingin menghapus data ini?</p>
                            </div>
                            <div className="flex justify-end mt-4 gap-5">
                                <button onClick={() => onDelete(DeleteModal.rowID)} className="text-red rounded-lg hover:before:bg-redborder-red-500 relative h-[50px] w-40 overflow-hidden border border-red-500 bg-white px-3 text-red-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-red-500 before:transition-all before:duration-500 hover:text-white hover:shadow-red-500 hover:before:left-0 hover:before:w-full"><span className="relative z-10">Ya</span></button>
                                <button onClick={() => setDeleteModal({show:false,rowID:1})} className="border border-blue-500 text-blue-500 px-5 py-2 rounded-md mr-2 transition-all duration-300 hover:bg-blue-500 hover:text-white">Tidak</button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>



        </div>
    )

}

