package com.hivenet.features.authentication.controller;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.service.annotation.DeleteExchange;
import com.hivenet.dto.Response;
import com.hivenet.features.authentication.dto.AuthenticationRequestBody;
import com.hivenet.features.authentication.dto.AuthenticationResponseBody;
import com.hivenet.features.authentication.model.AuthenticationUser;
import com.hivenet.features.authentication.services.AuthenticationService;


import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/authentication")
public class AuthenticationController {
    private final AuthenticationService authenticationUserService;

    public AuthenticationController(AuthenticationService authenticationUserService) {
        this.authenticationUserService = authenticationUserService;
    }

    @PostMapping("/login")
    public AuthenticationResponseBody loginPage(@Valid @RequestBody AuthenticationRequestBody loginRequestBody) {
        return authenticationUserService.login(loginRequestBody);
    }
    
    @DeleteMapping("/delete")
    public Response deleteUser(@RequestAttribute("authenticatedUser") AuthenticationUser user)
    {
    	authenticationUserService.deleteUser(user.getId());
    	return new Response("User deleted successfully.");
    }

    @PostMapping("/register")
    public AuthenticationResponseBody registerPage(@Valid @RequestBody AuthenticationRequestBody registerRequestBody) {
        return authenticationUserService.register(registerRequestBody);
    }

    @GetMapping("/user")
    public AuthenticationUser getUser(@RequestAttribute("authenticatedUser") AuthenticationUser user) {
        return user;
    }

    @PutMapping("/validate-email-verification-token")
    public Response verifyEmail(@RequestParam String token, @RequestAttribute("authenticatedUser") AuthenticationUser user) {
        authenticationUserService.validateEmailVerificationToken(token, user.getEmail());
        return new Response("Email verified successfully.");
    }

    @GetMapping("/send-email-verification-token")
    public Response sendEmailVerificationToken(@RequestAttribute("authenticatedUser") AuthenticationUser user) {
        authenticationUserService.sendEmailVerificationToken(user.getEmail());
        return new Response("Email verification token sent successfully.");
    }

    @PutMapping("/send-password-reset-token")
    public Response sendPasswordResetToken(@RequestParam String email) {
        authenticationUserService.sendPasswordResetToken(email);
        return new Response("Password reset token sent successfully.");
    }

    @PutMapping("/reset-password")
    public Response resetPassword(@RequestParam String newPassword, @RequestParam String token, @RequestParam String email) {
        authenticationUserService.resetPassword(email, newPassword, token);
        return new Response("Password reset successfully.");
    }
    
    @PutMapping("/profile/{id}")
    public AuthenticationUser updateUserProfile(
    		@RequestAttribute("authenticatedUser") AuthenticationUser user,
    		@PathVariable Long id,
    		@RequestParam(required = false) String firstName,
    		@RequestParam(required = false) String lastName,
    		@RequestParam(required = false) String company,
    		@RequestParam(required = false) String position,
    		@RequestParam(required = false) String location
    		)
    {
    	if(!user.getId().equals(id))
    	{
    		throw new ResponseStatusException(HttpStatus.FORBIDDEN,"User does not have permission to update profile");
    	}
    	
    	return authenticationUserService.updateUserProfile(id, firstName, lastName, company, position, location);
    }
    
}