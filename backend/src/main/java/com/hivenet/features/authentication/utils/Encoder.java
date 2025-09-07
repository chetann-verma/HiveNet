package com.hivenet.features.authentication.utils;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;

import javax.management.RuntimeErrorException;

import org.aspectj.bridge.Message;
import org.springframework.stereotype.Component;

@Component
public class Encoder {

	public String encode(String rawString)
	{
		try {
			MessageDigest digest =  MessageDigest.getInstance("SHA-256"); // SHA-25 is Algorithm 
			byte[] hash = digest.digest(rawString.getBytes()); // Storing Raw pw in byte hash 
			return Base64.getEncoder().encodeToString(hash); // Converting password in Base64.. if we pass rawString.getBytes() directly it can decoded by decoders
		} catch (NoSuchAlgorithmException e) {
			// TODO: handle exception
			throw new RuntimeException("Error encoding string");
		}
	}
	
	public boolean matches(String rawString , String encodedString)
	{
		return encode(rawString).equals(encodedString);
	}
}
