package com.controller.web;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.domain.Department;
import com.domain.Employee;
import com.local.DeptSaveRequest;
import com.service.DepartmentService;

@Controller
public class DepartmentController {
	
	@Autowired
	private DepartmentService deptService;
	
	@RequestMapping(value="/dept", method=POST, consumes = "application/json")
	@ResponseBody
	public Department saveDepartment(@Valid @RequestBody DeptSaveRequest request) {
		return deptService.saveDepartment(request);
	}
	
	@RequestMapping(value="/dept/all", method=POST, produces = "application/json")
	@ResponseBody
	public List<Department> findAll() {
		return deptService.findAll();
	}
	
}
