<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post("/feedback", function (Request $request) {
    // Log the feedback
    \Log::info("Feedback received from " . $request->input("name") . ": " . $request->input("message"));
    return response()->json(["message" => "Pesan, saran, atau komplain Anda telah berhasil dikirim ke Sagara Lattea."]);
});
