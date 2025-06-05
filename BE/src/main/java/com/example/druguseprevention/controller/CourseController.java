package com.example.druguseprevention.controller;

import com.example.druguseprevention.entity.Course;
import com.example.druguseprevention.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @PostMapping
    public ResponseEntity<Course> create(@RequestBody Course course) {
        return ResponseEntity.ok(courseService.create(course));
    }

    @GetMapping
    public ResponseEntity<List<Course>> getAll() {
        return ResponseEntity.ok(courseService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getById(@PathVariable Long id) {
        Course course = courseService.getById(id);
        return course != null ? ResponseEntity.ok(course) : ResponseEntity.notFound().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Course> update(@PathVariable Long id, @RequestBody Course course) {
        Course updated = courseService.update(id, course);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        courseService.delete(id);
        return ResponseEntity.ok("Đã xóa khóa học");
    }

    // ✅ API tìm kiếm và lọc
    @GetMapping("/search")
    public ResponseEntity<List<Course>> searchCourses(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean published
    ) {
        return ResponseEntity.ok(courseService.searchCourses(keyword, category, published));
    }
}
