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

    // GET the single admission owned by a student
    @GetMapping("/student/{studentId}")
    public ResponseEntity<Admission> getAdmissionByStudentId(
            @PathVariable Integer studentId) {

        return admissionService.getAdmissionByStudentId(studentId)
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

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateAdmissionStatus(@PathVariable Integer id,
                                                    @RequestBody AdmissionStatusRequest request) {
        try {
            return ResponseEntity.ok(admissionService.updateAdmissionStatus(id, request.status(), request.remarks()));
        } catch (RuntimeException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }

    public record AdmissionStatusRequest(String status, String remarks) { }

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
