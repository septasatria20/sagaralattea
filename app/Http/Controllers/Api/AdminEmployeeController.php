<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminEmployeeController extends Controller
{
    public function index()
    {
        return response()->json(User::with('outlet')->whereHas('roles', function($q) {
            $q->whereIn('name', ['Karyawan', 'Mitra', 'Manager']);
        })->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'phone' => 'nullable|string',
            'nik' => 'nullable|string|unique:users,nik',
            'password' => 'required|string|min:6',
            'outlet_id' => 'nullable|exists:outlets,id',
            'job_title' => 'nullable|string|max:100',
            'employee_status' => 'required|string|in:Aktif,Tidak Aktif,Blacklist',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'nik' => $validated['nik'],
            'password' => Hash::make($validated['password']),
            'outlet_id' => $validated['outlet_id'],
            'job_title' => $validated['job_title'],
            'employee_status' => $validated['employee_status'],
        ]);

        $user->assignRole('Karyawan');

        return response()->json(['message' => 'Employee created successfully', 'employee' => $user->load('outlet')]);
    }

    public function update(Request $request, User $employee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,'.$employee->id,
            'phone' => 'nullable|string',
            'nik' => 'nullable|string|unique:users,nik,'.$employee->id,
            'password' => 'nullable|string|min:6',
            'outlet_id' => 'nullable|exists:outlets,id',
            'job_title' => 'nullable|string|max:100',
            'employee_status' => 'required|string|in:Aktif,Tidak Aktif,Blacklist',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'nik' => $validated['nik'],
            'outlet_id' => $validated['outlet_id'],
            'job_title' => $validated['job_title'],
            'employee_status' => $validated['employee_status'],
        ];

        if (!empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $employee->update($updateData);

        return response()->json(['message' => 'Employee updated successfully', 'employee' => $employee->load('outlet')]);
    }

    public function destroy(User $employee)
    {
        $employee->delete();
        return response()->json(['message' => 'Employee deleted successfully']);
    }
}
