package com.example.druguseprevention.service;

import com.example.druguseprevention.entity.Course;
import com.example.druguseprevention.repository.CourseRepository;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseServiceImpl implements CourseService {
    @Override
    public List<Course> searchCourses(Optional<String> keyword, Optional<String> category, Optional<Boolean> published) {
        return List.of();
    }

    private final CourseRepository courseRepository;

    public CourseServiceImpl(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    @Override
    public Course create(Course course) {
        return courseRepository.save(course);
    }

    @Override
    public Course update(Long id, Course course) {
        return courseRepository.findById(id).map(existing -> {
            existing.setTitle(course.getTitle());
            existing.setDescription(course.getDescription());
            existing.setImageUrl(course.getImageUrl());
            existing.setCategory(course.getCategory());
            existing.setDurationInMinutes(course.getDurationInMinutes());
            existing.setPublished(course.isPublished());
            existing.setStartDate(course.getStartDate());
            existing.setEndDate(course.getEndDate());
            existing.setTargetAgeGroup(course.getTargetAgeGroup());
            existing.setType(course.getType());
            existing.setVideoLink(course.getVideoLink());
            return courseRepository.save(existing);
        }).orElse(null);
    }

    @Override
    public void delete(Long id) {
        courseRepository.deleteById(id);
    }

    @Override
    public Course getById(Long id) {
        return courseRepository.findById(id).orElse(null);
    }

    @Override
    public List<Course> getAll() {
        return courseRepository.findAll();
    }

    @Override
    public List<Course> searchCourses(String keyword, String category, Boolean published) {
        return courseRepository.findAll((Specification<Course>) (root, query, cb) -> {
            var predicates = cb.conjunction();

            if (keyword != null && !keyword.isEmpty()) {
                predicates = cb.and(predicates, cb.or(
                        cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                        cb.like(cb.lower(root.get("description")), "%" + keyword.toLowerCase() + "%")
                ));
            }

            if (category != null && !category.isEmpty()) {
                predicates = cb.and(predicates, cb.equal(root.get("category"), category));
            }

            if (published != null) {
                predicates = cb.and(predicates, cb.equal(root.get("published"), published));
            }

            return predicates;
        });
    }
}