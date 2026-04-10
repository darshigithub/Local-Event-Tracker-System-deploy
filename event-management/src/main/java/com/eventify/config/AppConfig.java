package com.eventify.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

// To register a RestTemplate object as a Spring Bean so that Spring can manage it

@Configuration 
public class AppConfig {

    @Bean 
    public RestTemplate restTemplate() {

        return new RestTemplate();

    } 

}