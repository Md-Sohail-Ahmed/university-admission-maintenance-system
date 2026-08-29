package org.example.universitybackend.controller;

import org.example.universitybackend.entity.Document;
import org.example.universitybackend.service.DocumentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
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
    @PostMapping("/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam("studentId") Integer studentId,
            @RequestParam("documentType") String documentType,
            @RequestParam("file") MultipartFile file) {

        try {

            Document document =
                    documentService.uploadDocument(
                            studentId,
                            documentType,
                            file
                    );

            return ResponseEntity.ok(document);

        } catch (IOException e) {

            return ResponseEntity
                    .internalServerError()
                    .build();

        } catch (RuntimeException e) {

            return ResponseEntity
                    .badRequest()
                    .build();
        }
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

        } catch (RuntimeException | IOException e) {

            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{id}/download")
    public ResponseEntity<?> downloadDocument(
            @PathVariable Integer id) {

        try {

            Document document =
                    documentService.getDocumentById(id)
                            .orElseThrow(() ->
                                    new RuntimeException(
                                            "Document not found"
                                    )
                            );

            System.out.println(
                    "Document file path: " +
                            document.getFilePath()
            );

            byte[] file =
                    documentService.downloadDocument(id);

            return ResponseEntity.ok()
                    .header(
                            HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" +
                                    document.getFileName() +
                                    "\""
                    )
                    .contentType(
                            MediaType.APPLICATION_OCTET_STREAM
                    )
                    .body(file);

        } catch (IOException e) {

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            "File error: " +
                                    e.getMessage()
                    );

        } catch (RuntimeException e) {

            e.printStackTrace();

            return ResponseEntity
                    .status(404)
                    .body(
                            "Error: " +
                                    e.getMessage()
                    );
        }
    }
}