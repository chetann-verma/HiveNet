package com.hivenet.configuration;


import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.hivenet.features.authentication.model.AuthenticationUser;
import com.hivenet.features.authentication.repository.AuthenticationUserRepository;
import com.hivenet.features.authentication.utils.Encoder;

@Configuration
public class LoadDatabaseConfiguration {
	
	private final Encoder encoder;
	
	
	public LoadDatabaseConfiguration(Encoder encoder) {
		super();
		this.encoder = encoder;
	}


	@Bean
	public CommandLineRunner initDatabase(AuthenticationUserRepository authenticationUserRepo)
	{
		return args ->{
		AuthenticationUser authenticationUser = new AuthenticationUser("chetan@example.com",encoder.encode("21000"));
		authenticationUserRepo.save(authenticationUser);
	
		};
		
	}
		

}
