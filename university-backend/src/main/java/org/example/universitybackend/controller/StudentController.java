package org.example.universitybackend.controller;

import org.example.universitybackend.entity.Student;
import org.example.universitybackend.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    // GET all students
    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    // GET student by ID
    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudentById(
            @PathVariable Integer id) {

        return studentService.getStudentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET student by email
    @GetMapping("/email/{email}")
    public ResponseEntity<Student> getStudentByEmail(
            @PathVariable String email) {

        return studentService.getStudentByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CREATE student
    @PostMapping
    public ResponseEntity<Student> createStudent(
            @RequestBody Student student) {

        try {

            Student savedStudent =
                    studentService.createStudent(student);

            return ResponseEntity.ok(savedStudent);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }
    }

    // UPDATE student
    @PutMapping("/{id}")
    public ResponseEntity<Student> updateStudent(
            @PathVariable Integer id,
            @RequestBody Student student) {

        try {

            Student updatedStudent =
                    studentService.updateStudent(id, student);

            return ResponseEntity.ok(updatedStudent);

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }

    // DELETE student
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteStudent(
            @PathVariable Integer id) {

        try {

            studentService.deleteStudent(id);

            return ResponseEntity.ok(
                    "Student deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .notFound()
                    .build();
        }
    }
}