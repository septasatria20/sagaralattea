<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;

class AdminPromoController extends Controller
{
    public function index()
    {
        return response()->json(Promo::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'summary' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'target' => 'nullable|string|max:255',
            'status' => 'required|string|in:Aktif,Jadwal,Selesai',
        ]);

        $promo = Promo::create($validated);

        return response()->json(['message' => 'Promo created successfully', 'promo' => $promo]);
    }

    public function update(Request $request, Promo $promo)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'code' => 'nullable|string|max:50',
            'summary' => 'nullable|string',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'target' => 'nullable|string|max:255',
            'status' => 'required|string|in:Aktif,Jadwal,Selesai',
        ]);

        $promo->update($validated);

        return response()->json(['message' => 'Promo updated successfully', 'promo' => $promo]);
    }

    public function destroy(Promo $promo)
    {
        $promo->delete();
        return response()->json(['message' => 'Promo deleted successfully']);
    }
}
