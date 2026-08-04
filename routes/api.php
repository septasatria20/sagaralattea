<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post("/feedback", function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'message' => 'required|string',
        'outlet_id' => 'nullable|exists:outlets,id',
    ]);

    \App\Models\Complaint::create([
        'ticket_id' => 'TKT-' . strtoupper(\Illuminate\Support\Str::random(6)),
        'outlet_id' => $request->input('outlet_id'),
        'issue' => "Dari: " . $request->input('name') . "\n\n" . $request->input('message'),
        'status' => 'Baru'
    ]);

    return response()->json(["message" => "Pesan, saran, atau komplain Anda telah berhasil dikirim ke Sagara Lattea."]);
});
