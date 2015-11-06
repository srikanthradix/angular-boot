package com.local;

import java.math.BigDecimal;

import javax.validation.constraints.NotNull;

public class DeptSaveRequest {
	
	@NotNull
	private String name;
	
	@NotNull
	private BigDecimal budget;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public BigDecimal getBudget() {
		return budget;
	}

	public void setBudget(BigDecimal budget) {
		this.budget = budget;
	}
	
}
