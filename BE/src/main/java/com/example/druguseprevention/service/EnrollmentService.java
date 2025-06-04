package com.example.druguseprevention.service;
import com.example.druguseprevention.entity.Enrollment;
import com.example.druguseprevention.entity.User;
import com.example.druguseprevention.entity.Course;

import java.util.List;

public interface EnrollmentService {
    Enrollment enrollUserInCourse(User user, Course course);
    List<Enrollment> getEnrollmentsByUser(User user);
}