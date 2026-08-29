package org.example.universitybackend.service;

import org.example.universitybackend.entity.Admission;
import org.example.universitybackend.repository.AdmissionRepository;
import org.example.universitybackend.repository.StudentRepository;
import org.example.universitybackend.repository.CourseRepository;
import org.example.universitybackend.repository.AdminRepository;
import org.example.universitybackend.entity.Student;
import org.example.universitybackend.entity.Course;
import org.example.universitybackend.entity.Admin;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdmissionService {

    private final AdmissionRepository admissionRepository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final AdminRepository adminRepository;

    public AdmissionService(
            AdmissionRepository admissionRepository,
            StudentRepository studentRepository,
            CourseRepository courseRepository,
            AdminRepository adminRepository) {

        this.admissionRepository = admissionRepository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.adminRepository = adminRepository;
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

    //Create
    public Admission createAdmission(Admission admission) {

        Integer studentId = admission.getStudent().getStudentId();
        Integer courseId = admission.getCourse().getCourseId();

        Integer adminId = null;

        if (admission.getAdmin() != null) {
            adminId = admission.getAdmin().getAdminId();
        }

        // Check if student already has admission
        if (admissionRepository.existsByStudentStudentId(studentId)) {
            throw new RuntimeException(
                    "Student already has an admission"
            );
        }

        // Get actual Student from database
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        // Get actual Course from database
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException("Course not found"));

        // Get actual Admin from database
        Admin admin = null;

        if (adminId != null) {
            admin = adminRepository.findById(adminId)
                    .orElseThrow(() ->
                            new RuntimeException("Admin not found"));
        }

        // Attach managed entities
        admission.setStudent(student);
        admission.setCourse(course);
        admission.setAdmin(admin);

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