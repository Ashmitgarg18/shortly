package com.ash.bitly.service;

import com.ash.bitly.DTOs.UrlRequest;
import com.ash.bitly.model.UrlMapping;
import com.ash.bitly.repo.UrlMappingRepo;
import com.ash.bitly.util.Base62Encoder;
import com.ash.bitly.util.SnowflakeIdGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Service
public class UrlShortenerService {

    @Autowired
    private UrlMappingRepo urlMappingRepo;
    @Autowired
    private SnowflakeIdGenerator snowflake;
    @Autowired
    private StringRedisTemplate redisTemplate;

    @Value("${app.base-domain}")
    private String baseUrl;

    @Value("${app.cache.default-ttl-seconds:604800}")
    private long defaultCacheTtl;

    private static final int MAX_CODE_LENGTH = 10;
    private static final int MAX_CODE_ATTEMPTS = 5;

//    public String shortenUrl(UrlRequest urlRequest){
//        String shortCode;
//
//        if(urlRequest.getAlias() != null && !urlRequest.getAlias().isEmpty()){
//            shortCode = urlRequest.getAlias();
//            if(urlMappingRepo.existsByShortCode(shortCode)){
//                throw new RuntimeException("Alias already exists.");
//            }
//        }
//        else{
//            long id = snowflake.nextId();
//            shortCode = Base62Encoder.encode(id);
//        }
//
//        UrlMapping urlMapping = new UrlMapping();
//        urlMapping.setLongUrl(urlRequest.getLongUrl());
//        urlMapping.setShortCode(shortCode);
//        urlMapping.setCreatedAt(LocalDateTime.now());
//        if(urlRequest.getExpirationDate() != null){
//            urlMapping.setExpirationDate(urlRequest.getExpirationDate());
//        }
//        if(urlRequest.getAlias() != null){
//            urlMapping.setAlias(urlRequest.getAlias());
//        }
//
//        urlMappingRepo.save(urlMapping);
//        return BASE_DOMAIN + shortCode;
//    }

    public String shortenUrl(UrlRequest req) {
        final boolean hasAlias = StringUtils.hasText(req.getAlias());
        String shortCode;

        if (hasAlias) {
            shortCode = req.getAlias();
            if (urlMappingRepo.existsByShortCode(shortCode)) {
                throw new IllegalArgumentException("Alias already exists: " + shortCode);
            }
        } else {
            shortCode = nextUniqueCode();
        }

        UrlMapping m = new UrlMapping();
        m.setLongUrl(req.getLongUrl());
        m.setShortCode(shortCode);
        m.setExpirationDate(req.getExpirationDate());

        try {
            urlMappingRepo.save(m);
        } catch (org.springframework.dao.DataIntegrityViolationException e) {
            if (!hasAlias) {
                m.setShortCode(nextUniqueCode());
                urlMappingRepo.save(m);
            } else {
                throw new IllegalArgumentException("Alias already exists: " + shortCode);
            }
        }

        return baseUrl.endsWith("/") ? baseUrl + shortCode : baseUrl + "/" + shortCode;
    }


    public String getOriginalUrl(String shortCode){

        String cachedUrl = redisTemplate.opsForValue().get(shortCode);
        if(cachedUrl != null){
            System.out.println("redis result");
            return cachedUrl;
        }

        UrlMapping urlMapping = urlMappingRepo.findByShortCode(shortCode).
                orElseThrow(() -> new RuntimeException("Short Url mapping not found"));

        if(urlMapping.getExpirationDate() != null && urlMapping.getExpirationDate().isBefore(LocalDateTime.now())){
            throw new RuntimeException("This link has expired");
        }

        if(urlMapping.getExpirationDate() != null){
            long seconds = Duration.between(LocalDateTime.now(), urlMapping.getExpirationDate()).getSeconds();
            if(seconds > 0){
                redisTemplate.opsForValue().set(shortCode, urlMapping.getLongUrl(), seconds, TimeUnit.SECONDS);
            }
        }
        else {
            redisTemplate.opsForValue().set(shortCode, urlMapping.getLongUrl(), defaultCacheTtl, TimeUnit.SECONDS);
        }

        System.out.println("db result");
        return urlMapping.getLongUrl();



    }

    private String nextUniqueCode() {
        for (int i = 0; i < MAX_CODE_ATTEMPTS; i++) {
            String code = Base62Encoder.encode(snowflake.nextId());

            if (code.length() > MAX_CODE_LENGTH) {
                code = code.substring(code.length() - MAX_CODE_LENGTH);
            }

            if (!urlMappingRepo.existsByShortCode(code)) {
                return code;
            }
        }
        throw new IllegalStateException("Failed to allocate a unique short code after "
                + MAX_CODE_ATTEMPTS + " attempts");
    }


}
