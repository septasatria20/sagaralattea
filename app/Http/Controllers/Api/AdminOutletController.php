<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Outlet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminOutletController extends Controller
{
    public function index()
    {
        $outlets = Outlet::with(['employees' => function($q) {
            $q->whereHas('roles', function($r) {
                $r->where('name', 'Mitra');
            });
        }])->latest()->get();

        $formatted = $outlets->map(function($outlet) {
            $mitra = $outlet->employees->first();
            return [
                'id' => $outlet->id,
                'name' => $outlet->name,
                'location' => $outlet->location,
                'status' => $outlet->status,
                'account' => $mitra ? $mitra->email : '-',
                'omzet' => 'Rp 0', // Placeholder
            ];
        });

        return response()->json($formatted);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'maps_url' => 'nullable|url',
            'status' => 'required|string|in:Aktif,Tidak Aktif',
            // Mitra account details
            'mitra_name' => 'required|string|max:255',
            'mitra_email' => 'required|email|unique:users,email',
            'mitra_password' => 'required|string|min:6',
        ]);

        $outlet = Outlet::create([
            'name' => $validated['name'],
            'location' => $validated['location'],
            'address' => $validated['address'],
            'maps_url' => $validated['maps_url'] ?? null,
            'status' => $validated['status'],
        ]);

        // Create Mitra account
        $user = User::create([
            'name' => $validated['mitra_name'],
            'email' => $validated['mitra_email'],
            'password' => Hash::make($validated['mitra_password']),
            'outlet_id' => $outlet->id,
            'employee_status' => 'Aktif',
            'job_title' => 'Mitra',
        ]);
        $user->assignRole('Mitra');

        return response()->json(['message' => 'Outlet and Mitra account created successfully', 'outlet' => $outlet]);
    }

    public function update(Request $request, Outlet $outlet)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'address' => 'nullable|string',
            'maps_url' => 'nullable|url',
            'status' => 'required|string|in:Aktif,Tidak Aktif',
        ]);

        $outlet->update($validated);

        return response()->json(['message' => 'Outlet updated successfully', 'outlet' => $outlet]);
    }

    public function destroy(Outlet $outlet)
    {
        $outlet->delete();
        return response()->json(['message' => 'Outlet deleted successfully']);
    }
}
