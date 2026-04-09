<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\ContractorController;
use App\Http\Controllers\Admin\HealthUnitController as AdminHealthUnitController;
use App\Http\Controllers\Admin\ManagerController;
use App\Http\Controllers\Manager\HealthUnitController as ManagerHealthUnitController;
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
    Route::get('health-units', [AdminHealthUnitController::class, 'index'])->name('health-units.index');
    Route::post('health-units', [AdminHealthUnitController::class, 'store'])->name('health-units.store');
    Route::patch('health-units/{id}', [AdminHealthUnitController::class, 'update'])->name('health-units.update');
    Route::delete('health-units/{id}', [AdminHealthUnitController::class, 'destroy'])->name('health-units.destroy');
    Route::get('managers', [ManagerController::class, 'index'])->name('managers.index');
    Route::post('managers', [ManagerController::class, 'store'])->name('managers.store');
    Route::patch('managers/{id}', [ManagerController::class, 'update'])->name('managers.update');
    Route::delete('managers/{id}', [ManagerController::class, 'destroy'])->name('managers.destroy');
});

Route::middleware(['auth', 'role:gestor'])->prefix('manager')->name('manager.')->group(function () {
    Route::get('dashboard', ManagerDashboardController::class)->name('dashboard');
    Route::get('health-units', [ManagerHealthUnitController::class, 'index'])->name('health-units.index');
    Route::post('health-units', [ManagerHealthUnitController::class, 'store'])->name('health-units.store');
    Route::patch('health-units/{id}', [ManagerHealthUnitController::class, 'update'])->name('health-units.update');
    Route::delete('health-units/{id}', [ManagerHealthUnitController::class, 'destroy'])->name('health-units.destroy');
});

require __DIR__.'/settings.php';
