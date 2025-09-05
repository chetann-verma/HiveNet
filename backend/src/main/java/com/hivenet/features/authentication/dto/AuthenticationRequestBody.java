package com.hivenet.features.authentication.dto;

import jakarta.validation.constraints.NotBlank;

public class AuthenticationRequestBody {

	@NotBlank(message = "Enter Valid Email Address")
	private final String email;
	@NotBlank(message = "Password can not be empty")
	private final String password;
	public AuthenticationRequestBody(String email, String password) {
		this.email = email;
		this.password = password;
	}
	public String getEmail() {
		return email;
	}
	public String getPassword() {
		return password;
	}
	
	
}
