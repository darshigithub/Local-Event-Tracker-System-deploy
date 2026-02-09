package com.eventify.dto.auth;

import lombok.*;

@Getter
@Setter
public class LoginRequest {
    private String email;
    private String password;
}
