package com.ash.bitly.controller;

import com.ash.bitly.DTOs.UrlRequest;
import com.ash.bitly.service.UrlShortenerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class UrlController {

    @Autowired
    private UrlShortenerService service;

    @PostMapping("/urls")
    public ResponseEntity<?> createShortUrl(@Valid @RequestBody UrlRequest request) {
        String shortUrl = service.shortenUrl(request);
        return ResponseEntity.created(URI.create(shortUrl))
                .body(Map.of("short_url", shortUrl));
    }

    @GetMapping("/{shortCode}")
    public ResponseEntity<Void> redirectToLongUrl(@PathVariable String shortCode) {
        String longUrl = service.getOriginalUrl(shortCode);
        return ResponseEntity.status(HttpStatus.FOUND)
                .location(URI.create(longUrl))
                .build();
    }
}
