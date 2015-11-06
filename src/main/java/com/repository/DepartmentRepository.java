package com.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.transaction.annotation.Transactional;

import com.domain.Department;

@Transactional
public interface DepartmentRepository extends CrudRepository<Department, String>{
	
}
