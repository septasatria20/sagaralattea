<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('outlet_id')->nullable()->constrained('outlets')->onDelete('set null');
            $table->string('employee_status')->default('Aktif'); // Aktif, Tidak Aktif, Blacklist
            $table->string('job_title')->nullable(); // Manager, Barista, Kasir
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['outlet_id']);
            $table->dropColumn(['outlet_id', 'employee_status', 'job_title']);
        });
    }
};
