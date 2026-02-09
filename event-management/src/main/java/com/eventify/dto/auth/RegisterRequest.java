package com.eventify.dto.auth;

import lombok.*;

@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
}
