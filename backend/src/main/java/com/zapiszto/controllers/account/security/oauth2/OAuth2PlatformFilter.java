package com.zapiszto.controllers.account.security.oauth2;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class OAuth2PlatformFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {

    String platform = request.getParameter("platform");

    System.out.println("========== OAuth2PlatformFilter ==========");
    System.out.println("URI: " + request.getRequestURI());

    if ("android".equals(platform)) {
      HttpSession session = request.getSession(true);
      session.setAttribute("oauth2_android", true);

      System.out.println("ANDROID OAuth2 -> session flag SET");
      System.out.println("Session ID: " + session.getId());
    }

    filterChain.doFilter(request, response);
  }
}