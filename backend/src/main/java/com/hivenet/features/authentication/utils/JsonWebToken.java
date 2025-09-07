package com.hivenet.features.authentication.utils;

import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JsonWebToken {

	@Value("${jwt.secret.key}")
	private String secret;

	public SecretKey getKey()
	{
		return Keys.hmacShaKeyFor(secret.getBytes());
	}
	
	
	public String generateToken(String email)
	{
		return Jwts.builder()
				.subject(email)
				.issuedAt(new Date(System.currentTimeMillis()))
				.expiration(new Date(System.currentTimeMillis()+1000*60*60*10))
				.signWith(getKey())
				.compact();
	}
	
	private Claims extractAllClaims(String token)
	{
		return Jwts.parser()
				.verifyWith(getKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
	
	public String getEmailFromToken(String token)
	{
		return extractClaim(token , Claims::getSubject);
	}


	private <T> T extractClaim(String token ,Function<Claims ,T > claimResolver)
	{
		final Claims claims = extractAllClaims(token);
		return claimResolver.apply(claims);
	}
	
	
	
	public boolean isTokenExpired(String token)
	{
		return extractExpiration(token).before(new Date());
	}
	
	private Date extractExpiration(String token)
	{
		return extractClaim(token, Claims::getExpiration);
	}
	
	
	
}
