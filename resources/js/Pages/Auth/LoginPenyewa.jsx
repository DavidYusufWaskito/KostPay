import Checkbox from "@/Components/Checkbox";
import { useForm,Head,Link } from "@inertiajs/react";
import { useEffect } from "react";
import InputError from "@/Components/InputError";
export default function LoginPenyewa({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        form:'penyewa'
    });

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('login'));
    };

    return (
        <div className="w-screen h-screen bg-gradient-to-r from-white to-blue-600">
            <Head title="Login Penyewa" />
            {/* Card */}
            <div className="w-[80%] max-w-[960px] h-auto lg:w-1/2 rounded-xl shadow-2xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white flex">
                {/* Left side */}
                <div className="w-full md:w-1/2 p-10">
                    <h1 className="text-3xl text-gray-600 text-center font-bold">Masuk</h1>
                    <form className="mt-10" onSubmit={submit}>
                        <div className="mb-2">
                            <input type="email" name="email" id="email" className="w-full border-2 border-gray-300 focus:ring-0 focus:border-indigo-500 p-3 rounded-lg" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder="Email"/>
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        <div className="mb-2">
                            <input type="password" name="password" id="password" className="w-full border-2 border-gray-300 focus:ring-0 focus:border-indigo-500 p-3 rounded-lg" value={data.password} onChange={(e) => setData('password', e.target.value)} placeholder="Kata Sandi"/>
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        <div className="flex justify-between">
                            <div>
                                <Checkbox id="remember" name="remember" value={data.remember} onChange={(e) => setData('remember', e.target.checked)} />
                                <label className="ml-2 text-sm text-gray-600">Ingat Saya</label>
                            </div>
                            <div>
                                <Link href={route('password.request')} className="text-sm text-gray-600 hover:text-indigo-500 ml-auto">Lupa kata sandi?</Link>
                            </div>
                        </div>
                        <div>
                            <button type="submit" className="w-full p-3 mt-5 bg-indigo-500 rounded-lg text-white font-semibold hover:bg-indigo-600">Masuk</button>
                        </div>
                        <p className="block md:hidden text-center text-sm text-gray-600 mt-5">Belum punya akun? <Link href={route('daftar')} className="text-indigo-500 hover:text-indigo-600">Daftar</Link></p>
                    </form>
                </div>
                {/* Right side */}
                <div
                    className="relative hidden md:block w-1/2 rounded-e-xl 
                    px-10 py-10 bg-slate-600
                    "
                >
                    <h1 className="text-white font-bold text-center text-2xl">
                        Sudah terdaftar?
                    </h1>
                    <p className="pt-10 pb-5 text-white text-center">
                        Daftar sekarang juga!
                    </p>
                    <div className="flex justify-center">

                        <Link
                            className="border-white text-white font-semibold py-2 px-4 border rounded"
                            href={route('daftar')}
                        >
                            Daftar
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}