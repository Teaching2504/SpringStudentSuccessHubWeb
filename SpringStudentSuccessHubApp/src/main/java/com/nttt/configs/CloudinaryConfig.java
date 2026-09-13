package com.nttt.configs;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name:dczz59gpu}")
    private String cloudName;

    @Value("${cloudinary.api-key:869438865392334}")
    private String apiKey;

    @Value("${cloudinary.api-secret:fMGWJrAEn9SB4r-5xzKi9bLiTME}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, String> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        config.put("secure", "true");
        return new Cloudinary(config);
    }
}
