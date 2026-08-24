package org.example.universitybackend.service;

import org.example.universitybackend.entity.Course;
import org.example.universitybackend.repository.CourseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    // Get all courses
    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    // Get course by ID
    public Optional<Course> getCourseById(Integer id) {
        return courseRepository.findById(id);
    }

    // Create course
    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    // Update course
    public Course updateCourse(Integer id, Course courseDetails) {

        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        course.setCourseName(courseDetails.getCourseName());
        course.setDuration(courseDetails.getDuration());
        course.setFees(courseDetails.getFees());
        course.setDepartment(courseDetails.getDepartment());

        return courseRepository.save(course);
    }

    // Delete course
    public void deleteCourse(Integer id) {

        if (!courseRepository.existsById(id)) {
            throw new RuntimeException("Course not found");
        }

        courseRepository.deleteById(id);
    }
}