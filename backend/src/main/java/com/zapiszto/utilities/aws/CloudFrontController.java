package com.zapiszto.utilities.aws;

import java.io.IOException;
import java.security.spec.InvalidKeySpecException;
import java.util.Map;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/files")
public class CloudFrontController {

  @Autowired
  CloudFrontSignerService cloudFrontSignerService;

  @GetMapping("/{id}")
  public ResponseEntity<Map<String, String>> getFile(@PathVariable Long id) throws InvalidKeySpecException, IOException {


    //FileEntity file = fileService.findById(id);

    // 🔒 ABSOLUTNIE OBOWIĄZKOWE
    //securityService.checkAccess(file);

    String signedUrl = cloudFrontSignerService.sign("1765823323175_IMG_20230828_172406806.jpg");

    return ResponseEntity.ok(Map.of("url", signedUrl));
  }
}
