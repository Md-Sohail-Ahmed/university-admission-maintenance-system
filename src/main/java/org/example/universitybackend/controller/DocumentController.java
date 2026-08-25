package org.example.universitybackend.controller;

import org.example.universitybackend.entity.Document;
import org.example.universitybackend.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    // GET all documents
    @GetMapping
    public List<Document> getAllDocuments() {
        return documentService.getAllDocuments();
    }

    // GET document by ID
    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(
            @PathVariable Integer id) {

        return documentService.getDocumentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // GET all documents of a student
    @GetMapping("/student/{studentId}")
    public List<Document> getDocumentsByStudentId(
            @PathVariable Integer studentId) {

        return documentService.getDocumentsByStudentId(studentId);
    }

    // CREATE document
    @PostMapping
    public ResponseEntity<Document> createDocument(
            @RequestBody Document document) {

        return ResponseEntity.ok(
                documentService.createDocument(document)
        );
    }

    // UPDATE document
    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Integer id,
            @RequestBody Document document) {

        try {

            Document updatedDocument =
                    documentService.updateDocument(
                            id,
                            document
                    );

            return ResponseEntity.ok(updatedDocument);

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }

    // DELETE document
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDocument(
            @PathVariable Integer id) {

        try {

            documentService.deleteDocument(id);

            return ResponseEntity.ok(
                    "Document deleted successfully"
            );

        } catch (RuntimeException e) {

            return ResponseEntity.notFound().build();
        }
    }
}