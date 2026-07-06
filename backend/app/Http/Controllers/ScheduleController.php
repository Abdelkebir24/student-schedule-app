<?php

namespace App\Http\Controllers;

use App\Models\Schedule;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{
    public function index(Request $request) 
    {
        $userId = $request->user()->id;

        $schedules = Schedule::with('course')
                        ->where('user_id', $userId)
                        ->get();

        return response()->json($schedules, 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'required|string'
        ]);

        $newSchedule = Schedule::create([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'day' => $request->day,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'room' => $request->room,
        ]);

        return response()->json([
            'message' => 'Schedule created successfully ✔✔',
            'schedule' => $newSchedule->load('course')
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $schedule = Schedule::where('id', $id)
                        ->where('user_id', $request->user()->id)
                        ->firstOrFail();

        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'day' => 'required|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'room' => 'required|string'
        ]);

        $schedule->update([
            'course_id' => $request->course_id,
            'day' => $request->day,
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
            'room' => $request->room,
        ]);

        return response()->json([
            'message' => 'Schedule updated successfully ✔✔',
            'schedule updated' => $schedule,
        ], 200);
    }

    public function show(Request $request, $id) 
    {
        $schedule = Schedule::where('id', $id)
                        ->where('user_id', $request->user()->id)
                        ->firstOrFail();
        
        return response()->json($schedule, 200);
    }

    public function destroy(Request $request, $id)
    {
        $schedule = Schedule::where('id', $id)
                        ->where('user_id', $request->user()->id)
                        ->firstOrFail();
        
        $schedule->delete();

        return response()->json(['message' => 'Schedule deleted successfully ✔✔'], 200);
    }
}
