package org.example.universitybackend.controller;

import org.example.universitybackend.entity.Student;
import org.example.universitybackend.repository.StudentRepository;
import org.example.universitybackend.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class LoginController {

    private final StudentRepository studentRepository;
    private final StudentService studentService;

    public LoginController(
            StudentRepository studentRepository,
            StudentService studentService) {

        this.studentRepository = studentRepository;
        this.studentService = studentService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (request.password() == null || request.password().length() < 6) {
            return ResponseEntity.badRequest().body("Password must be at least 6 characters");
        }
        if (request.email() == null || !request.email().contains("@")) {
            return ResponseEntity.badRequest().body("Enter a valid email address");
        }
        try {
            Student student = new Student();
            student.setName(request.name());
            student.setEmail(request.email());
            student.setPassword(request.password());
            student.setPhone(request.phone());
            student.setDateOfBirth(request.dateOfBirth());
            student.setGender(request.gender());
            student.setAddress(request.address());
            return ResponseEntity.status(201).body(
                    studentService.registerStudent(student));
        } catch (RuntimeException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        Optional<Student> student =
                studentRepository.findByEmailAndPassword(
                        request.email(),
                        request.password()
                );


        if (student.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }


        return ResponseEntity.ok(
                student.get()
        );
    }


    public record LoginRequest(
            String email,
            String password
    ) {
    }

    public record RegisterRequest(String name, String email, String password,
                                  String phone, java.time.LocalDate dateOfBirth,
                                  String gender, String address, Integer departmentId) { }
}
