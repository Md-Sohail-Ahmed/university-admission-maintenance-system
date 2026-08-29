package org.example.universitybackend.service;

import org.example.universitybackend.entity.Student;
import org.example.universitybackend.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    // Get all students
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    // Get student by ID
    public Optional<Student> getStudentById(Integer id) {
        return studentRepository.findById(id);
    }

    // Get student by email
    public Optional<Student> getStudentByEmail(String email) {
        return studentRepository.findByEmail(email);
    }

    // Create student
    public Student createStudent(Student student) {

        if (studentRepository.existsByEmail(student.getEmail())) {
            throw new RuntimeException("Email already registered");
        }

        return studentRepository.save(student);
    }

    public Student registerStudent(Student student) {
        if (student.getName() == null || student.getName().isBlank()
                || student.getEmail() == null || student.getEmail().isBlank()
                || student.getPassword() == null || student.getPassword().isBlank()) {
            throw new RuntimeException("Name, email, and password are required");
        }
        if (studentRepository.existsByEmail(student.getEmail().trim())) {
            throw new RuntimeException("Email already registered");
        }
        student.setEmail(student.getEmail().trim().toLowerCase());
        return studentRepository.save(student);
    }

    // Update student
    public Student updateStudent(
            Integer id,
            Student studentDetails) {

        Student student = studentRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Student not found")
                );

        student.setName(studentDetails.getName());
        student.setPhone(studentDetails.getPhone());
        student.setDateOfBirth(studentDetails.getDateOfBirth());
        student.setGender(studentDetails.getGender());
        student.setAddress(studentDetails.getAddress());
        student.setDepartment(studentDetails.getDepartment());

        return studentRepository.save(student);
    }

    // Delete student
    public void deleteStudent(Integer id) {

        if (!studentRepository.existsById(id)) {
            throw new RuntimeException("Student not found");
        }

        studentRepository.deleteById(id);
    }
}
