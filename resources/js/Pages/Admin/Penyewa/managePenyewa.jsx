import { Head, Link,useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import Navbar from '@/Layouts/Navbar';
import Modal from "@/Components/Modal";
import {faEdit,faTrash,faTimes} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "react-data-table-component";
import CustomPaginationComponent from "@/Components/DatatableComponent/CustomPagination";
import TextInput from "@/Components/TextInput";

export default function ManagePenyewa({ auth, DetailKamar}) {
    const [penyewaData, setPenyewaData] = useState([]);

    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [EditModal, setEditModal] = useState({show:false,rowData:null});
    const [DeleteModal, setDeleteModal] = useState({show:false,rowID:1});
    


    const [searchQuery, setSearchQuery] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);


    const {data,setData,post,processing,errors,reset} = useForm({
        nama:'',
        email:'',
        password:'',
        password_confirmation:'',
        tunggakan:0
    });


    // Initial Fetch Penyewa and reset form
    useEffect(() => {
        reset();
        fetchPenyewa();
    }, [])
    

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

    // Update rowData when EditModal is Open
    useEffect(() => {
        if(EditModal.show){
            setData((prevData) => ({
                ...prevData,
                nama:EditModal.rowData?.nama,
                email:EditModal.rowData?.email,
                password:EditModal.rowData?.password,
                password_confirmation:EditModal.rowData?.password_confirmation,
                tunggakan:EditModal.rowData?.tunggakan
            }));
        }
    },[EditModal.show,EditModal.rowData]);

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
        console.log(data);

        if (response.status !== 200) {
            alert('Terjadi kesalahan: ' + response.statusText);
        }else{
            setPenyewaData(responseJSON);
        }
    }

    
    // Mengambil data Penyewa yang sesuai dengan pencarian
    // Menggunakan filter() untuk mencari data yang sesuai dengan searchQuery
    // Jika searchQuery tidak diisi, maka akan mengembalikan semua data
    // Dalam filter, kita menggunakan metode toLowerCase() untuk mengubah semua karakter di searchQuery menjadi kecil,
    // kemudian kita mencocokkan semua kata dalam objek item dengan searchQuery
    // Jika ada kata yang cocok, maka item akan masuk ke dalam array hasil filter
    const filteredData = penyewaData.filter((item) => {
        return (
            item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tunggakan.toString().includes(searchQuery.toLowerCase())
        );
    });

    // Mengambil data yang diperlukan berdasarkan jumlah baris per halaman dan halaman saat ini
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    // Event handler CRUD

    const onStore = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({
                nama: data.nama,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation
            })
        }
        console.log("requesting store");
        const response = await fetch('/admin/manage/penyewa/store', requestConfig);
        const responseJSON = await response.json();
        if (response.status !== 200) {
            alert('Terjadi kesalahan: ' + responseJSON.message);
        }else{
            setShowAddModal(false);
            fetchPenyewa();
        }
    }

    const onEdit = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({
                id: EditModal.rowData?.id,
                nama: data.nama,
                email: data.email,
                password: data.password,
                password_confirmation: data.password_confirmation,
                tunggakan: data.tunggakan
            })
        }
        console.log("requesting edit");

        const response = await fetch('/admin/manage/penyewa/update', requestConfig);
        const responseJSON = await response.json();
        if (response.status !== 200) {
            alert('Terjadi kesalahan: ' + response.statusText);
        }else{
            setEditModal({ show: false, rowData: null });
            fetchPenyewa();
        }
    }

    const onDelete = async () => {
        const token = document.head.querySelector('meta[name="csrf-token"]').content;
        const requestConfig = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token
            },
            body: JSON.stringify({
                id: DeleteModal.rowID
            })
        }
        console.log("requesting delete");

        const response = await fetch('/admin/manage/penyewa/delete', requestConfig);
        const responseJSON = await response.json();
        console.log(data);
        if (responseJSON.success) {
            setDeleteModal({ show: false, rowID: 1 });
            fetchPenyewa();
        } else {
            alert('Tidak terhapus');
        }
        if (response.status !== 200) {
            alert('Terjadi kesalahan: ' + response.statusText);
        }
    }

    return (
        <div className="overflow-y-auto h-full">
            <Head title="Home" />
            <Navbar className={"bg-[#69a8ff] z-10"}>
                <Link href={route('admin.dashboard')} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Dashboard
                </Link>
                <Link href={route('daftar')} className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Manage kamar
                </Link>
                <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2">
                    Manage penyewa
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
                    <Link className="text-[#FFFF] hover:text-[#EB5160] font-sans font-extrabold max-md:text-slate-500 max-md:p-2 hidden max-md:block " method="post" href={route('admin.logout')}>
                        Sign out
                    </Link>
                </div>
            </Navbar>

            {/* Dropdown profil */}
            {profileDropdownOpen && (
                <div className="absolute right-0 z-10 mt-20 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                    <div className="py-1" role="none">
                        <Link href="#" className="text-gray-700 block px-4 py-2 text-sm hover:text-[#EB5160]" role="menuitem" tabIndex="-1" id="menu-item-0">Account settings</Link>
                        <Link className="text-gray-700 block w-full px-4 py-2 text-left text-sm hover:text-[#EB5160]" method="post" href={route('admin.logout')} as="button">
                            Sign out
                        </Link>
                    </div>
                </div>
            )}

            <div className="pt-[6rem] pb-[2rem] bg-white overflow-y-auto">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded shadow p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h1 className="text-2xl font-semibold text-gray-900">Manage Penyewa</h1>
                            <p className="text-sm text-gray-600">Selamat datang {' ' + auth.user.nama}</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded shadow p-4 mt-4">
                        <input
                            type="text"
                            placeholder="Cari penyewa..."
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
                                    name: 'Id Penyewa',
                                    selector: (row) => row.id,
                                    sortable: true,
                                },
                                {
                                    name: 'Nama',
                                    selector: (row) => row.nama,
                                    sortable: true,
                                },
                                {
                                    name: 'Email',
                                    selector: (row) => row.email,
                                    sortable: true,
                                },
                                {
                                    name: 'Tunggakan',
                                    selector: (row) => row.tunggakan,
                                    sortable:true,
                                },
                                {
                                    name: 'Id kamar',
                                    selector: (row) => {
                                        const detailKamar = DetailKamar.find(detail => detail.idPenyewa === row.id);
                                        return detailKamar ? detailKamar.idKamar : "Belum menyewa kamar";
                                    },
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
                    <Modal show={showAddModal} onClose={() => setShowAddModal(false)} title="Tambah Data Penyewa">
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <div className="space-y-4">
                                {/* Nama */}
                                <label className="block text-gray-700 font-bold mb-2">Nama Penyewa</label>
                                <TextInput placeholder="Nama Penyewa" onChange={(e) => setData('nama',e.target.value)} className="w-full" />
                                {/* Email */}
                                <label className="block text-gray-700 font-bold mb-2">Email</label>
                                <TextInput type="email" placeholder="Email" onChange={(e) => setData('email',e.target.value)} className="w-full" />
                                {/* Password */}
                                <label className="block text-gray-700 font-bold mb-2">Password</label>
                                <TextInput type="password" placeholder="Password" onChange={(e) => setData('password',e.target.value)} className="w-full" />
                                {/* Konfirmasi Password */}
                                <label className="block text-gray-700 font-bold mb-2">Konfirmasi Password</label>
                                <TextInput type="password" placeholder="Konfirmasi Password" onChange={(e) => setData('password_confirmation',e.target.value)} className="w-full" />
                                
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
                    <button onClick={() => setShowAddModal(true)} className="bg-blue-500 text-white mt-4 px-4 py-2 rounded-md">Tambah Data Penyewa</button>


                    {/* Modal Edit */}
                    <Modal show={EditModal.show} onClose={() => setEditModal({show:false,rowData:null})} title="Edit Data Penyewa">
                        <div className="bg-white rounded-lg shadow-lg p-4">
                            <div className="space-y-4">
                                {/* Nama */}
                                <label className="block text-gray-700 font-bold mb-2">Nama Penyewa</label>
                                <TextInput value={data.nama || ''} onChange={(e) => setData('nama', e.target.value || '')} placeholder="Nama Penyewa" className="w-full" />
                                {/* Email */}
                                <label className="block text-gray-700 font-bold mb-2">Email</label>
                                <TextInput value={data.email || ''} type="email" onChange={(e) => setData('email', e.target.value || '')} placeholder="Email" className="w-full" />
                                {/* Password */}
                                <label className="block text-gray-700 font-bold mb-2">Password</label>
                                <TextInput type="password" placeholder="Password" className="w-full" />
                                {/* Konfirmasi Password */}
                                <label className="block text-gray-700 font-bold mb-2">Konfirmasi Password</label>
                                <TextInput type="password" placeholder="Konfirmasi Password" className="w-full" />
                                <label className="block text-gray-700 font-bold mb-2">Tunggakan</label>
                                <TextInput value={data.tunggakan || ''} onChange={(e) => setData('tunggakan', e.target.value || '')} placeholder="Tunggakan" className="w-full" />
                                {/* Footer */}

                                <div className={"flex gap-5"}>
                                    <button onClick={(e)=>{
                                        e.preventDefault();
                                        onEdit();
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
                                <button onClick={() => onDelete()} className="text-red rounded-lg hover:before:bg-redborder-red-500 relative h-[50px] w-40 overflow-hidden border border-red-500 bg-white px-3 text-red-500 shadow-2xl transition-all before:absolute before:bottom-0 before:left-0 before:top-0 before:z-0 before:h-full before:w-0 before:bg-red-500 before:transition-all before:duration-500 hover:text-white hover:shadow-red-500 hover:before:left-0 hover:before:w-full"><span className="relative z-10">Ya</span></button>
                                <button onClick={() => setDeleteModal({show:false,rowID:1})} className="border border-blue-500 text-blue-500 px-5 py-2 rounded-md mr-2 transition-all duration-300 hover:bg-blue-500 hover:text-white">Tidak</button>
                            </div>
                        </div>
                    </Modal>
                </div>
            </div>
        </div>
    )

}