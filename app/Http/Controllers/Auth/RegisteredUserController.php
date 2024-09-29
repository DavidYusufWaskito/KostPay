<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Penyewa;
use App\Providers\RouteServiceProvider;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
class RegisteredUserController extends Controller
{
    /**
     * Display the registration view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/RegisterPenyewa');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {

        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|lowercase|email|max:255|unique:'.Penyewa::class,
                'password' => ['required', 'confirmed', Rules\Password::defaults()],
            ], [
                'name.required' => 'Nama harus diisi',
                'name.string' => 'Nama harus berupa string',
                'email.required' => 'Email harus diisi',
                'email.string' => 'Email harus berupa string',
                'email.email' => 'Email harus merupakan alamat email yang valid',
                'email.unique' => 'Email ini sudah terdaftar',
                'password.string' => 'Password harus berupa string',
                'password.confirmed' => 'Konfirmasi password tidak cocok',
                'password.required' => 'Password harus diisi',
            ]);
        } catch (ValidationException $e) {
            // Log validation errors for debugging
            Log::error('Validation failed during user registration', [
                'errors' => $e->errors(),
                'input' => $request->all(),
            ]);
    
            // Redirect back with validation errors
            return back()->withErrors($e->errors())->withInput();
        }
        $user = Penyewa::create([
            'nama' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);


        event(new Registered($user));

        Auth::login($user);

        return redirect('/');
    }
}
