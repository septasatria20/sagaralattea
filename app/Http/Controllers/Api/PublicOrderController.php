<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class PublicOrderController extends Controller
{
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'outlet_id' => 'required|exists:outlets,id',
            'customer_name' => 'required|string|max:255',
            'phone_number' => 'required|string|max:20',
            'type' => 'required|string|in:Dine In,Take Away',
            'pickup_time' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.notes' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $totalAmount += $item['price'] * $item['quantity'];
            }

            // Create Order
            $order = Order::create([
                'outlet_id' => $validated['outlet_id'],
                'customer_name' => $validated['customer_name'] . ' (' . $validated['phone_number'] . ')' . ($validated['pickup_time'] ? ' - Ambil: ' . $validated['pickup_time'] : ''),
                'total_amount' => $totalAmount,
                'payment_method' => 'Di Outlet',
                'payment_status' => 'Belum Lunas',
                'order_status' => 'Pending',
                'type' => $validated['type'],
            ]);

            // Create Order Items
            foreach ($validated['items'] as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                    'notes' => $item['notes'] ?? null,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Pesanan berhasil dibuat',
                'order_id' => $order->id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Gagal membuat pesanan: ' . $e->getMessage()
            ], 500);
        }
    }
}
