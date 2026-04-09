<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ContractorController;
use App\Http\Controllers\Manager\ManagerDashboardController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', AdminDashboardController::class)->name('dashboard');
    Route::get('contractors', [ContractorController::class, 'index'])->name('contractors.index');
    Route::post('contractors', [ContractorController::class, 'store'])->name('contractors.store');
    Route::patch('contractors/{id}', [ContractorController::class, 'update'])->name('contractors.update');
    Route::delete('contractors/{id}', [ContractorController::class, 'destroy'])->name('contractors.destroy');
});

Route::middleware(['auth', 'role:gestor'])->prefix('manager')->name('manager.')->group(function () {
    Route::get('dashboard', ManagerDashboardController::class)->name('dashboard');
});

require __DIR__.'/settings.php';
