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
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description');
            $table->text('short_description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('sale_price', 10, 2)->nullable();
            $table->text('image')->nullable(); // Main product image - URL can be long
            $table->json('gallery')->nullable(); // Additional images
            $table->integer('stock')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new_release')->default(false);
            $table->boolean('is_active')->default(true);
            $table->string('platform')->nullable(); // e.g., NES, SNES, Genesis
            $table->string('developer')->nullable();
            $table->string('publisher')->nullable();
            $table->year('release_year')->nullable();
            $table->decimal('rating', 2, 1)->default(0); // 0.0 to 5.0
            $table->integer('downloads')->default(0);
            $table->timestamps();

            $table->index(['category_id', 'is_active']);
            $table->index('is_featured');
            $table->index('is_new_release');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
