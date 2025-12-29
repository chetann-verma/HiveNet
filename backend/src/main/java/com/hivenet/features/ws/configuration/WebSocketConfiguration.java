package com.hivenet.features.ws.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfiguration implements WebSocketMessageBrokerConfigurer {
	
	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) // STOMP (Streaming text oriented messaging protocol) : is simple text based protocol used to working with MOM(msg oriented middleware) 
	{
		
		registry.addEndpoint("/ws").setAllowedOriginPatterns("*");
	}
	
	@Override
	public void configureMessageBroker(MessageBrokerRegistry registry) {
		registry.enableSimpleBroker("/topic");
		// /topic is prefix which is used in every destination like /topic/posts/id (server data bhejega)
		registry.setApplicationDestinationPrefixes("/app");
		// when client send data to our server it goes to /app prefic like /app/posts'
	}

}
