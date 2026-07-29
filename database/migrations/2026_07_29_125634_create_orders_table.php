<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('outlet_id')->constrained()->cascadeOnDelete();
            $table->foreignId('table_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('cashier_id')->nullable()->constrained('users')->nullOnDelete();
            $table->string('customer_name')->nullable();
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('payment_method')->nullable();
            $table->string('payment_status')->default('Belum Lunas'); // Belum Lunas, Lunas
            $table->string('order_status')->default('Pending'); // Pending, Preparing, Served, Completed
            $table->string('type')->default('Dine In'); // Dine In, Take Away
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
