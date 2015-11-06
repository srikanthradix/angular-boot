package com.local;

import java.math.BigDecimal;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

public class EmplSaveRequest {
	
	private static final String VALID_CHARS_REGEX = "([a-zA-Z.'-_]+)";

	@NotNull
	@Pattern(regexp=VALID_CHARS_REGEX)
	private String id;
	
	@NotNull
	@Pattern(regexp=VALID_CHARS_REGEX)
	private String name;
	
	@NotNull
	@Min(value=25000)
	@Max(value=100000)
	private BigDecimal salary;
	
	@NotNull
	@Pattern(regexp=VALID_CHARS_REGEX)
	private String mgr_id;
	
	@NotNull
	@Pattern(regexp=VALID_CHARS_REGEX)
	private String dept;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public BigDecimal getSalary() {
		return salary;
	}
	public void setSalary(BigDecimal salary) {
		this.salary = salary;
	}
	public String getDept() {
		return dept;
	}
	public void setDept(String dept) {
		this.dept = dept;
	}
	public String getMgr_id() {
		return mgr_id;
	}
	public void setMgr_id(String mgr_id) {
		this.mgr_id = mgr_id;
	}
	
}
