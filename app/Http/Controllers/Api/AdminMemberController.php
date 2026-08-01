<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;

class AdminMemberController extends Controller
{
    public function index()
    {
        return response()->json(Member::latest()->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:members,phone',
            'points' => 'required|integer|min:0',
            'status' => 'required|string|in:Aktif,Tidak Aktif',
        ]);

        $member = Member::create($validated);

        return response()->json(['message' => 'Member created successfully', 'member' => $member]);
    }

    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string|max:20|unique:members,phone,' . $member->id,
            'points' => 'required|integer|min:0',
            'status' => 'required|string|in:Aktif,Tidak Aktif',
        ]);

        $member->update($validated);

        return response()->json(['message' => 'Member updated successfully', 'member' => $member]);
    }

    public function destroy(Member $member)
    {
        $member->delete();
        return response()->json(['message' => 'Member deleted successfully']);
    }
}
