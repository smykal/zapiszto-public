package com.zapiszto.controllers.account.security.oauth2;

import com.zapiszto.controllers.account.entity.User;
import com.zapiszto.controllers.account.repository.UserRepository;
import com.zapiszto.controllers.account.security.jwt.JwtUtils;
import com.zapiszto.controllers.account.security.services.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import jakarta.servlet.http.HttpSession;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

  private final JwtUtils jwtUtils;
  private final UserRepository userRepository;

  //String frontendRedirectUri = "https://zapiszto.pl/oauth2/redirect";
  @Value("${app.oauth2.frontend-redirect-uri}")
  private String frontendRedirectUri;

  @Value("${app.oauth2.android-redirect-uri}")
  private String androidRedirectUri;



  @Override
  public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
    String email = null;
    Object principal = authentication.getPrincipal();
    if (principal instanceof org.springframework.security.oauth2.core.user.DefaultOAuth2User) {
      org.springframework.security.oauth2.core.user.DefaultOAuth2User oauth = (org.springframework.security.oauth2.core.user.DefaultOAuth2User) principal;
      Object emailAttr = oauth.getAttribute("email");
      if (emailAttr != null) email = emailAttr.toString();
    }

    if (email == null) {
      response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Email not found from OAuth2 provider");
      return;
    }

    User user = userRepository.findByEmail(email).orElse(null);
    if (user == null) {
      response.sendError(HttpServletResponse.SC_BAD_REQUEST, "User not found");
      return;
    }

    // Try to build UserDetailsImpl if you have a build(...) method
    UserDetails userDetails;
    try {
      userDetails = UserDetailsImpl.build(user);
    } catch (NoSuchMethodError | Exception ex) {
      // fallback: create simple UserDetails
      userDetails = org.springframework.security.core.userdetails.User
          .withUsername(user.getUsername())
          .password(user.getPassword() == null ? "" : user.getPassword())
          .authorities("ROLE_USER").accountExpired(false).accountLocked(false).credentialsExpired(false).disabled(false)
          .build();
    }

    Authentication auth = new UsernamePasswordAuthenticationToken(
        userDetails,
        null,
        userDetails.getAuthorities()
    );

    HttpSession session = request.getSession(false);

    boolean isAndroid = session != null &&
        Boolean.TRUE.equals(session.getAttribute("oauth2_android"));

    String jwt = jwtUtils.generateJwtToken(auth);

    String redirect;

    if (isAndroid) {
      redirect = androidRedirectUri + "?token=" + jwt;
    } else {
      redirect = frontendRedirectUri + "?token=" + jwt;
    }

    clearAuthenticationAttributes(request);
    getRedirectStrategy().sendRedirect(request, response, redirect);
  }
}
