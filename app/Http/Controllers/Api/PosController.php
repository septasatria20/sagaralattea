<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MenuItem;
use App\Models\Table;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PosController extends Controller
{
    public function menus()
    {
        return response()->json(MenuItem::where('status', 'Aktif')->get());
    }

    public function tables()
    {
        $user = Auth::user();
        $outletId = $user->outlet_id;

        if (!$outletId) {
            return response()->json(['error' => 'Karyawan tidak terikat pada outlet manapun.'], 403);
        }

        $tables = Table::where('outlet_id', $outletId)->with(['activeOrder.items.menu'])->get();

        return response()->json($tables);
    }

    public function checkout(Request $request)
    {
        $request->validate([
            'table_id' => 'required|exists:tables,id',
            'customer_name' => 'nullable|string',
            'payment_method' => 'required|string',
            'type' => 'required|string',
            'items' => 'required|array',
            'items.*.menu_item_id' => 'required|exists:menu_items,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric'
        ]);

        $user = Auth::user();
        
        DB::beginTransaction();
        try {
            // Cek apakah meja sudah memiliki order aktif yang belum lunas
            $order = Order::where('table_id', $request->table_id)
                ->where('payment_status', 'Belum Lunas')
                ->first();

            $totalAmount = 0;
            foreach ($request->items as $item) {
                $totalAmount += $item['qty'] * $item['price'];
            }
            
            // Tax 11%
            $tax = $totalAmount * 0.11;
            $grandTotal = $totalAmount + $tax;

            if ($order) {
                // Update order jika sudah ada (misal pelanggan tambah pesanan)
                $order->update([
                    'total_amount' => $grandTotal,
                    'payment_method' => $request->payment_method,
                    'payment_status' => 'Lunas',
                    'order_status' => 'Preparing',
                    'customer_name' => $request->customer_name ?? $order->customer_name,
                    'cashier_id' => $user->id,
                ]);

                // Hapus item lama dan ganti dengan yang baru
                $order->items()->delete();
            } else {
                // Buat order baru
                $order = Order::create([
                    'outlet_id' => $user->outlet_id,
                    'table_id' => $request->table_id,
                    'cashier_id' => $user->id,
                    'customer_name' => $request->customer_name,
                    'total_amount' => $grandTotal,
                    'payment_method' => $request->payment_method,
                    'payment_status' => 'Lunas',
                    'order_status' => 'Preparing',
                    'type' => $request->type,
                ]);
            }

            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'menu_item_id' => $item['menu_item_id'],
                    'quantity' => $item['qty'],
                    'price' => $item['price'],
                    'subtotal' => $item['qty'] * $item['price'],
                ]);
            }

            $table = Table::find($request->table_id);
            $table->update(['status' => 'Sedang Pesan']); // Karena masih diproses

            DB::commit();

            return response()->json(['message' => 'Pembayaran berhasil.', 'order' => $order]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Gagal memproses pembayaran.', 'details' => $e->getMessage()], 500);
        }
    }
    
    public function updateTableStatus(Request $request, $table_id)
    {
        $request->validate(['status' => 'required|string']);
        $table = Table::findOrFail($table_id);
        $table->update(['status' => $request->status]);
        
        if ($request->status === 'Kosong') {
            // Selesaikan semua order di meja tersebut
            Order::where('table_id', $table_id)
                ->whereIn('order_status', ['Pending', 'Preparing', 'Served'])
                ->update(['order_status' => 'Completed']);
        }
        
        return response()->json(['message' => 'Status meja diperbarui.']);
    }
}
