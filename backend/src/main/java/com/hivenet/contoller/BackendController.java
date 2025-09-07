package com.hivenet.contoller;

import java.nio.file.NoSuchFileException;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;

@ControllerAdvice // catch the all errors happens in all the controllers
public class BackendController {
	
	@ExceptionHandler(HttpMessageNotReadableException.class) // handles the empty input 
	public ResponseEntity<Map<String, String>> httpMessageNotReadableException(HttpMessageNotReadableException e)
	{
		return  ResponseEntity.badRequest().body(Map.of("message","Required request body is missing "));
	}
	
	  @ExceptionHandler(MethodArgumentNotValidException.class)
	    public ResponseEntity<Map<String, String>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
	        StringBuilder errorMessage = new StringBuilder();
	        e.getBindingResult().getFieldErrors().forEach(error ->
	                errorMessage.append(error.getField()).append(": ").append(error.getDefaultMessage()).append("; ")
	        );
	        return ResponseEntity.badRequest().body(Map.of("message", errorMessage.toString()));
	    }

	
	@ExceptionHandler(NoResourceFoundException.class)
	public ResponseEntity<Map<String, String>> noResourceFoundException(NoResourceFoundException e)
	{
		return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message",e.getMessage()));
	}
	
	
	
    @ExceptionHandler(DataIntegrityViolationException.class) // check email is already registered or not
    public ResponseEntity<Map<String, String>> handleDataIntegrityViolationException(DataIntegrityViolationException e) {
        if (e.getMessage().contains("Duplicate entry")) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists, please use another email or login."));
        }
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }

    
    
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Map<String, String>> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
        return ResponseEntity.badRequest().body(Map.of("message", "Required request parameter is missing."));
    }
    
    

    @ExceptionHandler({IllegalArgumentException.class, IllegalStateException.class})
    public ResponseEntity<Map<String, String>> handleIllegalArgumentException(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
    }
    
    

    @ExceptionHandler(NoSuchFileException.class)
    public ResponseEntity<Map<String, String>> handleNoSuchFileException(NoSuchFileException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "File not found"));
    }

    
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleException(Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("message", e.getMessage()));
    }

}
