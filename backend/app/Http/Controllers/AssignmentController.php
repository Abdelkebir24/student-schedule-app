<?php

namespace App\Http\Controllers;

use App\Models\Assignment;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AssignmentController extends Controller
{
    // ------------ index
    public function index(Request $request)
    {
        $userId = $request->user()->id;
        $assignments = Assignment::with('course')
                            ->where('user_id', $userId)
                            ->get();
        
        return response()->json($assignments, 200);
    }

    
    // ------------ store
    public function store(Request $request)
    {
        $request->validate(([
            'course_id' => 'required|exists:courses,id',
            'title' => 'required|string|min:3',
            'description' => 'nullable|string',
            'due_date' => [
                'required',
                'date',
                Rule::date()->afterOrEqual(today())
            ]
        ]));

        $newAssignment = Assignment::create([
            'user_id' => $request->user()->id,
            'course_id' => $request->course_id,
            'title' => $request->title,
            'description' => $request->description,
            'due_date' => $request->due_date,
            'status' => 'pending'
        ]);

        return response()->json($newAssignment->load('course'), 201);
    }

    // ------------ show
    public function show(Request $request, $id)
    {
        $assignment = Assignment::where('id', $id)
                        ->where('user_id', $request->user()->id)
                        ->firstOrFail();

        return response()->json($assignment, 200);
    }

    // ------------ update
    public function update(Request $request, $id)
        {
        $assignment = Assignment::where('id', $id)
                        ->where('user_id', $request->user()->id)
                        ->firstOrFail();
        
        $validated = $request->validate(([
            'course_id' => 'sometimes|required|exists:courses,id',
            'title' => 'sometimes|required|string|min:3',
            'description' => 'sometimes|nullable|string',
            'due_date' => [
                'sometimes',
                'required',
                'date',
                Rule::date()->afterOrEqual(today())
            ],
            'status' => 'sometimes|required|in:pending,done'
        ]));

        $assignment->update($validated);

        return response()->json($assignment, 200);
    }

    // ------------ destroy
    public function destroy(Request $request, $id)
    {
        $assignment = Assignment::where('id', $id)
                        ->where('user_id', $request->user()->id)
                        ->firstOrFail();
        $assignment->delete();
        return response()->json([
            'message' => 'Assignment deleted successfully'
        ], 200);
    }

    //------------- upcoming 
    public function upcoming(Request $request)
    {
        $userId = $request->user()->id;
        $upcomingAssignments = Assignment::with('course')
                        ->where('user_id', $userId)
                        ->where('status', 'pending')
                        ->where('due_date', '>=', today())
                        ->where('due_date', '<=', today()->addDays(7))
                        ->orderBy('due_date')
                        ->limit(5)
                        ->get();

        return response()->json($upcomingAssignments, 200);
    }
}







// public function update(Request $request, $id)
//     {
//     $assignment = Assignment::where('id', $id)
//                     ->where('user_id', $request->user()->id)
//                     ->firstOrFail();
    
//     $validated = $request->validate(([
//         'course_id' => 'sometimes|required|exists:courses,id',
//         'title' => 'sometimes|required|string|min:3',
//         'description' => 'sometimes|nullable|string',
//         'due_date' => [
//             'sometimes',
//             'required',
//             'date',
//             Rule::date()->afterOrEqual(today())
//         ],
//         'status' => 'sometimes|required|in:pending,done'
//     ]));

//     $assignment->update($validated);

//     return response()->json($assignment, 200);
// }



// public function update(Request $request, $id)
//     {
//         $assignment = Assignment::where('id', $id)
//                         ->where('user_id', $request->user()->id)
//                         ->firstOrFail();
        
//         $request->validate(([
//             'course_id' => 'required|exists:courses,id',
//             'title' => 'required|string|min:3',
//             'description' => 'nullable|string',
//             'due_date' => [
//                 'required',
//                 'date',
//                 Rule::date()->afterOrEqual(today())
//             ]
//         ]));

//         $assignment->update([
//             'course_id' => $request->course_id,
//             'title' => $request->title,
//             'description' => $request->description,
//             'due_date' => $request->due_date,
//         ]);

//         return response()->json($assignment, 200);
//     }
