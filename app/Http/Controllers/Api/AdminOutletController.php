<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Outlet;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminOutletController extends Controller
{
    private function extractCoordinatesFromUrl($url)
    {
        if (empty($url)) return ['latitude' => null, 'longitude' => null];

        // cURL to resolve redirects if short URL
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HEADER, true);
        curl_setopt($ch, CURLOPT_NOBODY, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        $response = curl_exec($ch);
        $effectiveUrl = curl_getinfo($ch, CURLINFO_EFFECTIVE_URL);
        curl_close($ch);

        $latitude = null;
        $longitude = null;

        if (preg_match('/@(-?\d+\.\d+),(-?\d+\.\d+)/', $effectiveUrl, $matches)) {
            $latitude = $matches[1];
            $longitude = $matches[2];
        } elseif (preg_match('/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/', $effectiveUrl, $matches)) {
            $latitude = $matches[1];
            $longitude = $matches[2];
        } elseif (preg_match('/[?&]ll=(-?\d+\.\d+),(-?\d+\.\d+)/', $effectiveUrl, $matches)) {
            $latitude = $matches[1];
            $longitude = $matches[2];
        }

        return ['latitude' => $latitude, 'longitude' => $longitude];
    }

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
                'address' => $outlet->address,
                'maps_url' => $outlet->maps_url,
                'status' => $outlet->status,
                'account' => $mitra ? $mitra->email : '-',
                'mitra_name' => $mitra ? $mitra->name : '',
                'mitra_email' => $mitra ? $mitra->email : '',
                'mitra_id' => $mitra ? $mitra->id : null,
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

        $coords = $this->extractCoordinatesFromUrl($validated['maps_url'] ?? null);

        $outlet = Outlet::create([
            'name' => $validated['name'],
            'location' => $validated['location'],
            'address' => $validated['address'],
            'maps_url' => $validated['maps_url'] ?? null,
            'latitude' => $coords['latitude'],
            'longitude' => $coords['longitude'],
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
            'mitra_name' => 'nullable|string|max:255',
            'mitra_email' => 'nullable|email|max:255',
            'mitra_password' => 'nullable|string|min:6',
        ]);

        $coords = $this->extractCoordinatesFromUrl($validated['maps_url'] ?? null);

        $outlet->update([
            'name' => $validated['name'],
            'location' => $validated['location'],
            'address' => $validated['address'],
            'maps_url' => $validated['maps_url'] ?? null,
            'latitude' => $coords['latitude'],
            'longitude' => $coords['longitude'],
            'status' => $validated['status'],
        ]);

        $mitra = User::where('outlet_id', $outlet->id)->whereHas('roles', function($q) {
            $q->where('name', 'Mitra');
        })->first();

        if ($mitra && !empty($validated['mitra_name']) && !empty($validated['mitra_email'])) {
            $mitra->name = $validated['mitra_name'];
            $mitra->email = $validated['mitra_email'];
            if (!empty($validated['mitra_password'])) {
                $mitra->password = Hash::make($validated['mitra_password']);
            }
            $mitra->save();
        }

        return response()->json(['message' => 'Outlet updated successfully', 'outlet' => $outlet]);
    }

    public function destroy(Outlet $outlet)
    {
        $outlet->delete();
        return response()->json(['message' => 'Outlet deleted successfully']);
    }
}
