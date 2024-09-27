<?php

namespace App\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Providers\RouteServiceProvider;
class LoginRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            
        ];
    }

        /**
     * Get the validation messages that apply to the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email.required' => 'Email harus diisi.',
            'email.string' => 'Email harus berupa string.',
            'email.email' => 'Email harus merupakan alamat email yang valid.',
            'email.invalid' => 'Kredensial tidak cocok.',
            'password.required' => 'Password harus diisi.',
            'password.string' => 'Password harus berupa string.',
            'password.invalid' => 'Kredensial tidak cocok.',
            
        ];
    }

    /**
     * Attempt to authenticate the request's credentials.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function authenticate(): string
    {
        $this->ensureIsNotRateLimited();

        // if (! Auth::guard('web')->attempt($this->only('email', 'password'), $this->boolean('remember'))) {
        //     RateLimiter::hit($this->throttleKey());

        //     throw ValidationException::withMessages([
        //         'email' => trans('auth.failed'),
        //     ]);
        // }

        
        // if (! Auth::guard('admin')->attempt($this->only('email', 'password'), $this->boolean('remember'))) {
        //     RateLimiter::hit($this->throttleKey());

        //     throw ValidationException::withMessages([
        //         'email' => trans('auth.failed'),
        //     ]);
        // }

        // RateLimiter::clear($this->throttleKey());

        if ($this->form === 'admin') {
            if (Auth::guard('admin')->attempt($this->only('email', 'password'), $this->boolean('remember'))) {
                // $this->session()->regenerate();
                RateLimiter::clear($this->throttleKey());
                return 'admin';
            }

        }
        else{
            if (Auth::guard('web')->attempt($this->only('email', 'password'), $this->boolean('remember'))) {
                // $this->session()->regenerate();
                RateLimiter::clear($this->throttleKey());
                return 'web';
            }
        }

        
        RateLimiter::hit($this->throttleKey());
    
        throw ValidationException::withMessages([
            'email' => trans('auth.failed'),
        ]);
    }

    /**
     * Ensure the login request is not rate limited.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    /**
     * Get the rate limiting throttle key for the request.
     */
    public function throttleKey(): string
    {
        return Str::transliterate(Str::lower($this->string('email')).'|'.$this->ip());
    }
}
