package org.example.universitybackend.controller;

import org.example.universitybackend.entity.Student;
import org.example.universitybackend.repository.StudentRepository;
import org.example.universitybackend.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class LoginController {

    private final StudentRepository studentRepository;
    private final StudentService studentService;
    private final PasswordEncoder passwordEncoder;

    public LoginController(
            StudentRepository studentRepository,
            StudentService studentService,
            PasswordEncoder passwordEncoder) {

        this.studentRepository = studentRepository;
        this.studentService = studentService;
        this.passwordEncoder = passwordEncoder;
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody RegisterRequest request) {

        if (request.password() == null ||
                !request.password().matches(
                        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$")) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Password must have at least 8 characters, " +
                                    "including uppercase, lowercase, number, and symbol"
                    );
        }


        if (request.email() == null ||
                !request.email().contains("@")) {

            return ResponseEntity
                    .badRequest()
                    .body("Enter a valid email address");
        }


        if (request.phone() == null ||
                !request.phone().matches(
                        "^\\+[1-9]\\d{6,14}$")) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Enter a valid international phone number, " +
                                    "for example +919876543210"
                    );
        }


        try {

            Student student = new Student();

            student.setName(request.name());
            student.setEmail(request.email());

            // Password will be encoded inside StudentService
            student.setPassword(request.password());

            student.setPhone(request.phone());
            student.setDateOfBirth(request.dateOfBirth());
            student.setGender(request.gender());
            student.setAddress(request.address());

            return ResponseEntity
                    .status(201)
                    .body(
                            studentService.registerStudent(student)
                    );

        } catch (RuntimeException exception) {

            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        Optional<Student> student =
                studentRepository.findByEmail(
                        request.email()
                                .trim()
                                .toLowerCase()
                );


        if (student.isEmpty()) {

            return ResponseEntity
                    .status(401)
                    .body("Invalid email or password");
        }


        boolean passwordMatches =
                passwordEncoder.matches(
                        request.password(),
                        student.get().getPassword()
                );


        if (!passwordMatches) {

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


    public record RegisterRequest(
            String name,
            String email,
            String password,
            String phone,
            java.time.LocalDate dateOfBirth,
            String gender,
            String address,
            Integer departmentId
    ) {
    }
}