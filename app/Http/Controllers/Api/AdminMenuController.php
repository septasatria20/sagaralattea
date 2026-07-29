<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class AdminMenuController extends Controller
{
    public function index()
    {
        return response()->json(MenuItem::orderBy('sort_order')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'status' => 'required|string|in:Aktif,Tidak Aktif',
        ]);

        $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();

        $menu = MenuItem::create($validated);

        return response()->json(['message' => 'Menu created successfully', 'menu' => $menu]);
    }

    public function update(Request $request, MenuItem $menu)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_featured' => 'boolean',
            'status' => 'required|string|in:Aktif,Tidak Aktif',
        ]);

        if ($request->name !== $menu->name) {
            $validated['slug'] = Str::slug($validated['name']) . '-' . uniqid();
        }

        $menu->update($validated);

        return response()->json(['message' => 'Menu updated successfully', 'menu' => $menu]);
    }

    public function destroy(MenuItem $menu)
    {
        $menu->delete();
        return response()->json(['message' => 'Menu deleted successfully']);
    }
}
