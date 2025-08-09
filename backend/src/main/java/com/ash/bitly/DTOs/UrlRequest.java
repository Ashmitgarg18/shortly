package com.ash.bitly.DTOs;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UrlRequest {

    @NotBlank
    @Size(max = 2048)
    @Pattern(regexp = "https?://.+", message = "URL must start with http:// or https://")
    private String longUrl;

    @Size(max = 10)
    @Pattern(regexp = "^[a-zA-Z0-9_-]*$", message = "Alias can contain letters, numbers, _ and -")
    private String alias;

    @FutureOrPresent
    private LocalDateTime expirationDate;

}
