<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\StudentController;
use Illuminate\Support\Facades\Route;

// Public
Route::post('/login', [AuthController::class, 'login']);

// Protected: any valid token (admin or user)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Read-only: admin AND regular user
    Route::apiResource('students', StudentController::class)->only(['index', 'show']);

    // Write operations: ADMIN ONLY
    Route::middleware('role:admin')->group(function () {
        Route::apiResource('students', StudentController::class)->only(['store', 'update', 'destroy']);
    });
});