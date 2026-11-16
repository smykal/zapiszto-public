package com.zapiszto.configurations;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
@Configuration
@Getter
@Setter
public class CloudFrontProperties {

  @Value("${cloudfront.domain}")
  private String domain;

  @Value("${cloudfront.key-pair-id}")
  private String keyPairId;

  @Value("${cloudfront.private-key.path}")
  private String privateKeyPath;

  @Value("${cloudfront.url-validity-minutes}")
  private int urlValidityMinutes;
}
