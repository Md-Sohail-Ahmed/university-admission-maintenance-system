package org.example.universitybackend.service;

import org.example.universitybackend.entity.Admission;
import org.example.universitybackend.repository.AdmissionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdmissionService {

    private final AdmissionRepository admissionRepository;

    public AdmissionService(AdmissionRepository admissionRepository) {
        this.admissionRepository = admissionRepository;
    }

    // Get all admissions
    public List<Admission> getAllAdmissions() {
        return admissionRepository.findAll();
    }

    // Get admission by ID
    public Optional<Admission> getAdmissionById(Integer id) {
        return admissionRepository.findById(id);
    }

    // Get admission by student ID
    public Optional<Admission> getAdmissionByStudentId(Integer studentId) {
        return admissionRepository.findByStudentStudentId(studentId);
    }

    // Create admission
    public Admission createAdmission(Admission admission) {

        if (admissionRepository.existsByStudentStudentId(
                admission.getStudent().getStudentId())) {

            throw new RuntimeException(
                    "Student already has an admission"
            );
        }

        return admissionRepository.save(admission);
    }

    // Update admission
    public Admission updateAdmission(
            Integer id,
            Admission admissionDetails) {

        Admission admission = admissionRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Admission not found")
                );

        admission.setCourse(admissionDetails.getCourse());
        admission.setStatus(admissionDetails.getStatus());
        admission.setRemarks(admissionDetails.getRemarks());
        admission.setApprovedDate(admissionDetails.getApprovedDate());
        admission.setAdmin(admissionDetails.getAdmin());

        return admissionRepository.save(admission);
    }

    // Delete admission
    public void deleteAdmission(Integer id) {

        if (!admissionRepository.existsById(id)) {
            throw new RuntimeException("Admission not found");
        }

        admissionRepository.deleteById(id);
    }
}