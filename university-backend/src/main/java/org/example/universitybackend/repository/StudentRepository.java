package org.example.universitybackend.repository;

import org.example.universitybackend.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Integer> {
    Optional<Student> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<Student> findByEmailAndPassword(
            String email,
            String password
    );
}