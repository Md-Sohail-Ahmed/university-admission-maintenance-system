package org.example.universitybackend.controller;

import org.example.universitybackend.entity.Admission;
import org.example.universitybackend.service.AdmissionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admissions")
public class AdmissionController {

    private final AdmissionService admissionService;

    public AdmissionController(AdmissionService admissionService) {
        this.admissionService = admissionService;
    }

    // GET all admissions
    @GetMapping
    public List<Admission> getAllAdmissions() {
        return admissionService.getAllAdmissions();
    }

    // GET admission by ID
    @GetMapping("/{id}")
    public ResponseEntity<Admission> getAdmissionById(
            @PathVariable Integer id) {

        return admissionService.getAdmissionById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createAdmission(
            @RequestBody Admission admission) {

        try {
            Admission savedAdmission =
                    admissionService.createAdmission(admission);

            return ResponseEntity.ok(savedAdmission);

        } catch (RuntimeException e) {

            e.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(e.getMessage());
        }
    }

    // GET admission by student ID
//    @GetMapping("/student/{studentId}")
//    public ResponseEntity<Admission> getAdmissionByStudentId(
//            @PathVariable Integer studentId) {
//
//        return admissionService.getAdmissionByStudentId(studentId)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//
//    // CREATE admission
//    @PostMapping
//    public ResponseEntity<Admission> createAdmission(
//            @RequestBody Admission admission) {
//
//        try {
//
//            Admission savedAdmission =
//                    admissionService.createAdmission(admission);
//
//            return ResponseEntity.ok(savedAdmission);
//
//        } catch (RuntimeException e) {
//
//            return ResponseEntity.badRequest().build();
//        }
//    }

    // UPDATE admission
    @PutMapping("/{id}")
    public ResponseEntity<Admission> updateAdmission(
            @PathVariable Integer id,
            @RequestBody Admission admission) {

        try {

            Admission updatedAdmission =
                    admissionService.updateAdmission(
                            id,
                            admission
                    );

            return ResponseEntity.ok(updatedAdmission);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // DELETE admission
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAdmission(
            @PathVariable Integer id) {

        try {

            admissionService.deleteAdmission(id);

            return ResponseEntity.ok(
                    "Admission deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }
}