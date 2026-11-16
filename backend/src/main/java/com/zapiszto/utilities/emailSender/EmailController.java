package com.zapiszto.utilities.emailSender;

import com.zapiszto.controllers.common.ControllerCommon;
import jakarta.annotation.security.PermitAll;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import java.io.IOException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
public class EmailController implements ControllerCommon {

  @Autowired
  EmailService emailService;

  @PostMapping("/send")
  @PreAuthorize("hasRole('USER') or hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER')")
  public ResponseEntity<String> sendEmail(@Valid @RequestBody MailDto mailDto, @RequestParam String source) {
    try {
      String replyTo = extractUserMail();
      emailService.sendEmail(mailDto, replyTo, source);
      return new ResponseEntity<>("Email sent successfully", HttpStatus.OK);
    } catch (Exception e) {
      return new ResponseEntity<>("Failed to send email", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @PreAuthorize("permitAll()")
  @PostMapping("/contact")
  public ResponseEntity<String> sendEmail(
      @RequestPart("to") String to,
      @RequestPart("subject") String subject,
      @RequestPart("body") String body,
      @RequestPart(value = "attachment", required = false) MultipartFile attachment) {
    MailDto mailDto = new MailDto(to, subject, body, attachment);
    String replyTo = extractUserMail();
    emailService.sendEmail(mailDto, replyTo, "CONTACT");
    return new ResponseEntity<>("Email sent successfully", HttpStatus.OK);
  }
}
