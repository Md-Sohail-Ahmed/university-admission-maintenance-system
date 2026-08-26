package org.example.universitybackend.service.storage;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {

    String storeFile(MultipartFile file, Integer studentId) throws IOException;

    void deleteFile(String filePath) throws IOException;
}