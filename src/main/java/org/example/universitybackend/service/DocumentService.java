package org.example.universitybackend.service;

import org.example.universitybackend.entity.Document;
import org.example.universitybackend.repository.DocumentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;

    public DocumentService(DocumentRepository documentRepository) {
        this.documentRepository = documentRepository;
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

    // Create document
    public Document createDocument(Document document) {
        return documentRepository.save(document);
    }

    // Update document
    public Document updateDocument(
            Integer id,
            Document documentDetails) {

        Document document = documentRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Document not found")
                );

        document.setDocumentType(documentDetails.getDocumentType());
        document.setFileName(documentDetails.getFileName());
        document.setFilePath(documentDetails.getFilePath());

        return documentRepository.save(document);
    }

    // Delete document
    public void deleteDocument(Integer id) {

        if (!documentRepository.existsById(id)) {
            throw new RuntimeException("Document not found");
        }

        documentRepository.deleteById(id);
    }
}