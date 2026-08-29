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

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        String originalFileName = file.getOriginalFilename();

        if (originalFileName == null) {
            throw new RuntimeException("Invalid file name");
        }

        String extension = "";

        int dotIndex = originalFileName.lastIndexOf(".");

        if (dotIndex >= 0) {
            extension = originalFileName.substring(dotIndex)
                    .toLowerCase();
        }

        if (!extension.equals(".pdf")
                && !extension.equals(".jpg")
                && !extension.equals(".jpeg")
                && !extension.equals(".png")) {

            throw new RuntimeException(
                    "Only PDF, JPG, JPEG and PNG files are allowed"
            );
        }

        String uniqueFileName =
                java.util.UUID.randomUUID()
                        + extension;

        Path studentDirectory =
                uploadDirectory.resolve(
                        "students/" + studentId
                );

        Files.createDirectories(studentDirectory);

        Path filePath =
                studentDirectory.resolve(uniqueFileName);

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