package org.example.universitybackend.controller;

import org.example.universitybackend.entity.Student;
import org.example.universitybackend.repository.StudentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class LoginController {

    private final StudentRepository studentRepository;

    public LoginController(
            StudentRepository studentRepository) {

        this.studentRepository = studentRepository;
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
}