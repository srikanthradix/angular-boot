package com.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import com.domain.Department;
import com.domain.Employee;

@Transactional
public interface EmployeeRepository extends CrudRepository<Employee, String>{
	
	public List<Employee> findByDepartment(Department dept);
	
}
