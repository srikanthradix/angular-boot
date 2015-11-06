package com.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.domain.Department;
import com.domain.Employee;
import com.local.EmplSaveRequest;
import com.repository.EmployeeRepository;

import ma.glasnost.orika.MapperFacade;

@Service
public class EmployeeService {
	
	@Autowired
	private EmployeeRepository emplRepository;
	
	@Autowired
	private DepartmentService deptService;
	
	@Autowired
	private MapperFacade mapper;
	
	public Employee findEmployee(String id) {
		return emplRepository.findOne(id);
	}
	
	public List<Employee> findEmployeesByDepartment(String deptName) {
		Department dept = deptService.findDepartmentByName(deptName);
		return emplRepository.findByDepartment(dept);
	}

	public Employee saveEmployee(EmplSaveRequest request) {
		
		Employee empl = mapper.map(request, Employee.class);
		Department dept = deptService.findDepartment(empl);
		empl.setDepartment(dept);
		return emplRepository.save(empl);
	}
}
