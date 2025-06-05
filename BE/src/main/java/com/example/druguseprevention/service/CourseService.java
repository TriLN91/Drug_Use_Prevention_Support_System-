package com.example.druguseprevention.service;
import com.example.druguseprevention.entity.Course;

import java.util.List;
import java.util.Optional;

public interface CourseService {
    Course create(Course course);
    Course update(Long id, Course course);
    void delete(Long id);
    Course getById(Long id);
    List<Course> getAll();

    // ✅ Thêm API tìm kiếm & lọc
    List<Course> searchCourses(Optional<String> keyword, Optional<String> category, Optional<Boolean> published);

    List<Course> searchCourses(String keyword, String category, Boolean published);
}

