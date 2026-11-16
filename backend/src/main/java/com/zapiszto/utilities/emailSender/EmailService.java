package com.zapiszto.utilities.emailSender;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class EmailService {

  @Autowired
  private JavaMailSender mailSender;

  public void sendEmail(MailDto mailDto, String replyTo, String source) {
    try {
      switch (source) {
        case "RECOVERY_PASSWORD":
          recoverPassword(mailDto, replyTo);
          break;
        case "CONTACT":
          contact(mailDto, replyTo);
      }
    } catch (MessagingException e ) {

    }

  }

  public void recoverPassword(MailDto mailDto, String replyTo) {
    SimpleMailMessage message = new SimpleMailMessage();
    message.setTo(mailDto.to());
    message.setSubject("RECOVERY_PASSWORD");
    message.setReplyTo(replyTo);
    message.setSubject(mailDto.subject());
    message.setText(mailDto.body());

    mailSender.send(message);
  }

  public void contact(MailDto mailDto, String replyTo) throws MessagingException {
    MimeMessage message = mailSender.createMimeMessage();
    MimeMessageHelper helper = new MimeMessageHelper(message, true);

    helper.setTo(mailDto.to());
    helper.setSubject("CONTACT");
    helper.setReplyTo(replyTo);
    helper.setText(mailDto.body(), true); // Może obsługiwać HTML

    // Obsługa załączników
    if (mailDto.attachment() != null && !mailDto.attachment().isEmpty()) {
      helper.addAttachment(mailDto.attachment().getOriginalFilename(), mailDto.attachment());
    }

    mailSender.send(message);
  }
}
