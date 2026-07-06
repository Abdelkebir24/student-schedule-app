<?php

use App\Http\Controllers\AssignmentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\ScheduleController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// protected routes 
Route::middleware('auth:sanctum')->group(function () {
    // logout 
    Route::post('/logout', [AuthController::class, 'logout']);
    // courses routes 
    Route::apiResource('/courses', CourseController::class);
    // schedules routes 
    Route::apiResource('/schedules', ScheduleController::class);
    // assignments routes 
    Route::apiResource('/assignments', AssignmentController::class);
});


// register and login routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);



