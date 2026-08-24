package org.example.universitybackend.service;

import org.example.universitybackend.entity.Department;
import org.example.universitybackend.repository.DepartmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public DepartmentService(DepartmentRepository departmentRepository) {
        this.departmentRepository = departmentRepository;
    }

    // Get all departments
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    // Get department by ID
    public Optional<Department> getDepartmentById(Integer id) {
        return departmentRepository.findById(id);
    }

    // Create department
    public Department createDepartment(Department department) {
        return departmentRepository.save(department);
    }

    // Update department
    public Department updateDepartment(Integer id, Department departmentDetails) {

        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));

        department.setDepartmentName(departmentDetails.getDepartmentName());
        department.setDescription(departmentDetails.getDescription());

        return departmentRepository.save(department);
    }

    // Delete department
    public void deleteDepartment(Integer id) {
        departmentRepository.deleteById(id);
    }
}