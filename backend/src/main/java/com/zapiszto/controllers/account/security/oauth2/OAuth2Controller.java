package com.zapiszto.controllers.account.security.oauth2;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import java.io.IOException;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/api/auth")
public class OAuth2Controller {

  @GetMapping("/facebook-android")
  public void facebookAndroid(
      HttpServletRequest request,
      HttpServletResponse response
  ) throws IOException {

    HttpSession session = request.getSession(true);

    session.setAttribute("oauth2_android", true);

    String redirect =
        "https://zapiszto-service.onrender.com/oauth2/authorization/facebook";

    response.sendRedirect(redirect);
  }
}