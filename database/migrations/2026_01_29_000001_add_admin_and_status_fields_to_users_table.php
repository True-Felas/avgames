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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_admin')->default(false)->after('email');
            $table->integer('level')->default(1)->after('is_admin');
            $table->integer('experience')->default(0)->after('level');
            $table->enum('status', ['active', 'suspended', 'banned'])->default('active')->after('experience');
            $table->timestamp('suspended_until')->nullable()->after('status');
            $table->string('ban_reason')->nullable()->after('suspended_until');
            $table->string('avatar')->nullable()->after('ban_reason');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'is_admin',
                'level',
                'experience',
                'status',
                'suspended_until',
                'ban_reason',
                'avatar',
            ]);
        });
    }
};
