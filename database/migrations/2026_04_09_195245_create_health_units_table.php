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
        Schema::create('health_units', function (Blueprint $table) {
            $table->id();
            $table->foreignId('contractor_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('type');
            $table->string('cnpj')->nullable();
            $table->string('zip_code');
            $table->string('street');
            $table->string('number');
            $table->string('complement')->nullable();
            $table->string('neighborhood');
            $table->string('city');
            $table->string('state', 2);
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->boolean('serves_adult')->default(true);
            $table->boolean('serves_pediatric')->default(false);
            $table->boolean('serves_gyneco')->default(false);
            $table->boolean('serves_neurology')->default(false);
            $table->boolean('serves_cardiology')->default(false);
            $table->boolean('serves_orthopedics')->default(false);
            $table->string('complexity');
            $table->time('opening_time')->nullable();
            $table->time('closing_time')->nullable();
            $table->json('operating_days');
            $table->integer('daily_capacity')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('health_units');
    }
};
