package com.domain;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Company implements Serializable  {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 3479684927519182556L;

	@Id
	@Column(name="COMPANY_NAME")
	private String name;
	
	@Column(nullable=false, unique=true)
	private String chairman;
	
	@Column(nullable=false, unique=true)
	private String vicePresident;
	
	@Column(nullable=false, unique=true)
	private String chiefExecutiveOfficer;
	
	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getChairman() {
		return chairman;
	}

	public void setChairman(String chairman) {
		this.chairman = chairman;
	}

	public String getVicePresident() {
		return vicePresident;
	}

	public void setVicePresident(String vicePresident) {
		this.vicePresident = vicePresident;
	}

	public String getChiefExecutiveOfficer() {
		return chiefExecutiveOfficer;
	}

	public void setChiefExecutiveOfficer(String chiefExecutiveOfficer) {
		this.chiefExecutiveOfficer = chiefExecutiveOfficer;
	}

}
