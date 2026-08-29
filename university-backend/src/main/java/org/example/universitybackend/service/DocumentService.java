package org.example.universitybackend.service;

import org.example.universitybackend.entity.Document;
import org.example.universitybackend.entity.Student;
import org.example.universitybackend.repository.DocumentRepository;
import org.example.universitybackend.repository.StudentRepository;
import org.example.universitybackend.service.storage.FileStorageService;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final StudentRepository studentRepository;
    private final FileStorageService fileStorageService;

    public DocumentService(
            DocumentRepository documentRepository,
            StudentRepository studentRepository,
            FileStorageService fileStorageService) {

        this.documentRepository = documentRepository;
        this.studentRepository = studentRepository;
        this.fileStorageService = fileStorageService;
    }

    // Get all documents
    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    // Get document by ID
    public Optional<Document> getDocumentById(Integer id) {
        return documentRepository.findById(id);
    }

    // Get all documents of a student
    public List<Document> getDocumentsByStudentId(Integer studentId) {
        return documentRepository.findByStudentStudentId(studentId);
    }

    // Upload document
    public Document uploadDocument(
            Integer studentId,
            String documentType,
            MultipartFile file) throws IOException {

        // Check student exists
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        // Store actual file
        String filePath =
                fileStorageService.storeFile(file, studentId);

        // Create document record
        Document document = new Document();

        document.setStudent(student);
        document.setDocumentType(documentType);
        document.setFileName(file.getOriginalFilename());
        document.setFilePath(filePath);

        return documentRepository.save(document);
    }

    public Document updateDocument(
            Integer id,
            Document documentDetails) {

        Document document = documentRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Document not found")
                );

        document.setDocumentType(
                documentDetails.getDocumentType()
        );

        return documentRepository.save(document);
    }

    // Delete document
    public void deleteDocument(Integer id) throws IOException {

        Document document = documentRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Document not found"));

        // Delete actual file
        if (document.getFilePath() != null) {
            fileStorageService.deleteFile(
                    document.getFilePath()
            );
        }

        // Delete database record
        documentRepository.delete(document);
    }

}