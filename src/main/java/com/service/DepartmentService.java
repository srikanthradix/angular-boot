package com.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.Department;
import com.domain.Employee;
import com.local.DeptSaveRequest;
import com.repository.DepartmentRepository;

import ma.glasnost.orika.MapperFacade;

@Service
public class DepartmentService {
	
	@Autowired
	private DepartmentRepository deptRepository;
	
	@Autowired
	private MapperFacade mapper;

	public Department findDepartment(Employee empl) {
		if(empl == null || empl.getDepartment() == null) {
			throw new RuntimeException("Employee or department cannot be null");
		}
		return deptRepository.findOne(empl.getDepartment().getName());
	}

	public Department saveDepartment(DeptSaveRequest request) {
		Department dept = mapper.map(request, Department.class);
		return deptRepository.save(dept);
	}

	public List<Department> findAll() {
		return (List<Department>) deptRepository.findAll();
	}

	public Department findDepartmentByName(String deptName) {
		return deptRepository.findOne(deptName);
	}

}
