<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use Illuminate\Http\Request;

class AdminComplaintController extends Controller
{
    public function index()
    {
        // Typically complaints are linked to outlets, so we could join them
        return response()->json(Complaint::latest()->get());
    }

    public function update(Request $request, Complaint $complaint)
    {
        $validated = $request->validate([
            'status' => 'required|string|in:Baru,Diproses,Selesai,Ditolak',
        ]);

        $complaint->update(['status' => $validated['status']]);

        return response()->json(['message' => 'Status komplain berhasil diperbarui', 'complaint' => $complaint]);
    }

    public function destroy(Complaint $complaint)
    {
        $complaint->delete();
        return response()->json(['message' => 'Komplain dihapus']);
    }
}
