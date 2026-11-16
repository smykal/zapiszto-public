package com.zapiszto.utilities.aws;

import com.amazonaws.services.cloudfront.CloudFrontUrlSigner;
import com.amazonaws.services.cloudfront.util.SignerUtils;
import com.zapiszto.configurations.CloudFrontProperties;
import java.io.File;
import java.io.IOException;
import java.security.spec.InvalidKeySpecException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class CloudFrontSignerService {

  private final CloudFrontProperties props;
  private final File privateKeyFile;

  public CloudFrontSignerService(CloudFrontProperties props) {
    this.props = props;

    if (new File(props.getPrivateKeyPath()).isFile()) {
      this.privateKeyFile = new File(props.getPrivateKeyPath());
    } else {
      this.privateKeyFile = new File(props.getPrivateKeyPath());
    }

    //log.info("CloudFront private key path: {}", privateKeyFile.getAbsolutePath());
    //log.info("Private key exists: {}", privateKeyFile.exists());
  }

  public String sign(String objectPath) {
    //log.info(props.getPrivateKeyPath());
    try {
      Date expires = Date.from(
          Instant.now()
              .plus(
                  props.getUrlValidityMinutes(),
                  ChronoUnit.MINUTES
              )
      );

      return CloudFrontUrlSigner.getSignedURLWithCannedPolicy(
          SignerUtils.Protocol.https,
          props.getDomain(),
          privateKeyFile,
          objectPath,
          props.getKeyPairId(),
          expires
      );

    } catch (IOException | InvalidKeySpecException e) {
      return null;
    }
  }
}

