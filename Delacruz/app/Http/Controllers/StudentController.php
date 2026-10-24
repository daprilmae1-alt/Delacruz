<?php

namespace App\Http\Controllers;

use App\Models\StudentModel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    // GET /api/students
    public function index()
    {
        return response()->json([
            'success' => true,
            'data'    => StudentModel::all(),
        ]);
    }

    // POST /api/students
    public function store(Request $request)
    {
        $validated = $request->validate([
            'firstname'  => 'required|string|max:255',
            'email'      => 'required|email|unique:student,email',
            'course'     => 'required|string|max:255',
            'Year_level' => 'required|integer|min:1',
        ]);

        $student = StudentModel::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data'    => $student,
        ], 201);
    }

    // GET /api/students/{student}
    public function show(StudentModel $student)
    {
        return response()->json([
            'success' => true,
            'data'    => $student,
        ]);
    }

    // PUT/PATCH /api/students/{student}
    public function update(Request $request, StudentModel $student)
    {
        $validated = $request->validate([
            'firstname'  => 'sometimes|required|string|max:255',
            'email'      => ['sometimes', 'required', 'email',
                             Rule::unique('student', 'email')->ignore($student->id)],
            'course'     => 'sometimes|required|string|max:255',
            'Year_level' => 'sometimes|required|integer|min:1',
        ]);

        $student->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data'    => $student,
        ]);
    }

    // DELETE /api/students/{student}
    public function destroy(StudentModel $student)
    {
        $student->delete();

        return response()->json([
            'success' => true,
            'message' => 'Student deleted successfully',
        ]);
    }
}