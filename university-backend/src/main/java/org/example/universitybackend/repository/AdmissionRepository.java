package org.example.universitybackend.repository;

import org.example.universitybackend.entity.Admission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdmissionRepository extends JpaRepository<Admission, Integer> {

    Optional<Admission> findByStudentStudentId(Integer studentId);

    boolean existsByStudentStudentId(Integer studentId);
}