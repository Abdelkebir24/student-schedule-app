<?php

namespace App\Http\Controllers;

use App\Models\Course;
use Illuminate\Http\Request;

class CourseController extends Controller
{   
    public function index(Request $request) 
    {
        $user_id = $request->user()->id;
        $courses = Course::where('user_id', $user_id)->get();

        return response()->json($courses, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|min:3',
            'code' => 'required|string|min:3',
            'professor' => 'required|string|min:3',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $newCourse = Course::create([
            'user_id' => $request->user()->id,
            'name' => $request->name,
            'code' => $request->code,
            'professor' => $request->professor,
            'color' => $request->color,
        ]);

        return response()->json([
            'message' => 'Course created successfully ✔',
            'course' => $newCourse
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $course = Course::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        
        return response()->json($course, 200);
    }

    public function update(Request $request, $id) 
    {
        $course = Course::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        $request->validate([
            'name' => 'required|string|min:3',
            'code' => 'required|string|min:3',
            'professor' => 'required|string|min:3',
            'color' => 'required|string|regex:/^#[0-9A-Fa-f]{6}$/',
        ]);

        $course->update([
            'name' => $request->name,
            'code' => $request->code,
            'professor' => $request->professor,
            'color' => $request->color,
        ]);

        return response()->json([
            'message' => 'Course updated successfully ✔',
            'course updated' => $course
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $course = Course::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        $course->delete();

        return response()->json(['message' => 'Course deleted successfully ✔'], 200);
    }
}
