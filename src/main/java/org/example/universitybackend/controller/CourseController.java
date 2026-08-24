package org.example.universitybackend.controller;

import org.example.universitybackend.entity.Course;
import org.example.universitybackend.service.CourseService;
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

    // GET all courses
    @GetMapping
    public List<Course> getAllCourses() {
        return courseService.getAllCourses();
    }

    // GET course by ID
    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(
            @PathVariable Integer id) {

        return courseService.getCourseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE course
    @PostMapping
    public ResponseEntity<Course> createCourse(
            @RequestBody Course course) {

        Course savedCourse = courseService.createCourse(course);

        return ResponseEntity.ok(savedCourse);
    }

    // UPDATE course
    @PutMapping("/{id}")
    public ResponseEntity<Course> updateCourse(
            @PathVariable Integer id,
            @RequestBody Course course) {

        try {
            Course updatedCourse =
                    courseService.updateCourse(id, course);

            return ResponseEntity.ok(updatedCourse);

        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE course
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteCourse(
            @PathVariable Integer id) {

        try {
            courseService.deleteCourse(id);

            return ResponseEntity.ok(
                    "Course deleted successfully"
            );

        } catch (RuntimeException e) {
            return ResponseEntity
                    .notFound()
                    .build();
        }
    }
}