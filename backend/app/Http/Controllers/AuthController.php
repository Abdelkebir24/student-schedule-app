<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ----------- register
    public function register(Request $request) 
    {
        $request->validate([
            'name' => 'required|string|min:3',
            'email' => 'required|string|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed'
        ]);

        $newUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        $token = $newUser->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'user created successfully ✔',
            'user' => $newUser,
            'token' => $token
        ], 201);
    }

    // ----------- login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:8'
        ]);

        $user = User::where('email', $request->email)->first();
        
        if (is_null($user) || !Hash::check($request->password, $user->password)) return response()->json(['message' => 'Invalid email or password'], 401);
        
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json([
            'message' => 'Login in successfully',
            'user' => $user,
            'token' => $token
        ], 200);

    }

    // ----------- logout
    public function logout(Request $request) 
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'You Logged out Successfully ✔✔'
        ]);
    }
}
