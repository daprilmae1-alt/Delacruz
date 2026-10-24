<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentModel extends Model
{
    protected $table = 'student';

    protected $fillable = [
        'firstname',
        'email',
        'course',
        'Year_level',
    ];
}