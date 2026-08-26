package org.example.universitybackend.service.storage;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
public class LocalFileStorageService implements FileStorageService {

    private final Path uploadDirectory =
            Paths.get("uploads");

    @Override
    public String storeFile(
            MultipartFile file,
            Integer studentId) throws IOException {

        Path studentDirectory =
                uploadDirectory.resolve(
                        "students/" + studentId
                );

        Files.createDirectories(studentDirectory);

        String fileName = file.getOriginalFilename();

        Path filePath =
                studentDirectory.resolve(fileName);

        file.transferTo(filePath);

        return filePath.toString();
    }

    @Override
    public void deleteFile(String filePath)
            throws IOException {

        Files.deleteIfExists(
                Paths.get(filePath)
        );
    }
}