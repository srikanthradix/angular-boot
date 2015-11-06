package com.controller.web;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.domain.Department;
import com.domain.Employee;
import com.google.common.collect.ImmutableList;
import com.local.EmplSaveRequest;
import com.service.EmployeeService;


@Controller
public class EmployeeController {
	
	@Autowired
	private EmployeeService emplService;
	
	@RequestMapping(value="/emp/{id}", method=GET, produces = "application/json")
	@ResponseBody
	public Employee getUserById(@PathVariable String id) {
		return emplService.findEmployee(id);
	}
	
	@RequestMapping(value="/dept/{dept}", method=GET, produces = "application/json")
	@ResponseBody
	public List<Employee> getEmployeesByDepartment(@PathVariable String dept) {
//		return emplService.findEmployeesByDepartment(dept);
		return EMPLOYEES.stream()
				.filter(e -> e.getDepartment().getName().contains(dept))
				.collect(Collectors.toList());
	}
	
	private static ImmutableList<Employee> EMPLOYEES;
	
	static {
		List<Employee> emps = new ArrayList<>();
		IntStream.range(0, 300)
			.forEach( i -> {
				Employee emp = new Employee();
				Department dept = new Department();
				dept.setName("PTT" + i);
				dept.setBudget(new BigDecimal("300000"));
				emp.setDepartment(dept);
				emp.setId(i+"");
				emp.setName("name "+ i);
				emp.setSalary(new BigDecimal(new Random().nextInt(30000) + 10000));
				emp.setMgrId("0");
				emps.add(emp);
			});
		EMPLOYEES = ImmutableList.copyOf(emps);
	}
	
	@RequestMapping(value="/emp", method=POST, consumes = "application/json")
	@ResponseBody
	public Employee saveEmployee(@Valid @RequestBody EmplSaveRequest request) {
		return emplService.saveEmployee(request);
	}
	
//	@RequestMapping(value="/emps", method=GET, consumes = "application/json")
//	@ResponseBody
//	public Employee getEmployees() {
//		JSONObject output = new JSONObject(jsonOut);
//	    JSONArray docs = response.getJSONArray("infile");
//
//	     String csv = CDL.toString(docs);
//	}
	
//	@RequestMapping(value="/user", method={PUT,POST} , consumes = "application/json")
//	@ResponseBody
//	public void updateUser(@RequestBody User user) {
//		final User repoUser = userRepository.findOne(user.getId());
//		repoUser.setActive(user.getActive());
//		userRepository.save(repoUser);
//	}
}
