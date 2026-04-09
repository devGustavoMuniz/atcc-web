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
        Schema::table('manager_profiles', function (Blueprint $table) {
            $table->foreign('contractor_id')
                ->references('id')
                ->on('contractors')
                ->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('manager_profiles', function (Blueprint $table) {
            $table->dropForeign(['contractor_id']);
        });
    }
};
