package com.solekta.solekta.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {
    private String email;        // optional
    private String password;     // optional (new password)
    private String firstName;
    private String lastName;
    private String phoneNumber;
}

