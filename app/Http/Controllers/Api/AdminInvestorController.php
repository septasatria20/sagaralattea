<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminInvestorController extends Controller
{
    public function index()
    {
        $investors = User::role('Investor')->latest()->get();
        return response()->json($investors);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $user->assignRole('Investor');

        return response()->json(['message' => 'Akun investor berhasil ditambahkan', 'investor' => $user]);
    }

    public function update(Request $request, User $investor)
    {
        // Ensure user is investor
        if (!$investor->hasRole('Investor')) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($investor->id)],
            'password' => 'nullable|string|min:8',
        ]);

        $investor->name = $validated['name'];
        $investor->email = $validated['email'];

        if (!empty($validated['password'])) {
            $investor->password = Hash::make($validated['password']);
        }

        $investor->save();

        return response()->json(['message' => 'Akun investor berhasil diperbarui', 'investor' => $investor]);
    }

    public function destroy(User $investor)
    {
        if (!$investor->hasRole('Investor')) {
            return response()->json(['message' => 'Akses ditolak'], 403);
        }
        
        $investor->delete();
        return response()->json(['message' => 'Akun investor berhasil dihapus']);
    }
}
