package com.zapiszto.controllers.account.security.jwt;

import com.zapiszto.controllers.account.security.services.UserDetailsImpl;
import java.security.Key;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtils {
  private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

  @Value("${zapiszTo.app.jwtSecret}")
  private String jwtSecret;

  @Value("${zapiszTo.app.jwtExpirationMs}")
  private int jwtExpirationMs;

  public String generateJwtToken(Authentication authentication) {

    Object principal = authentication.getPrincipal();
    String username;

    if (principal instanceof UserDetailsImpl) {
      username = ((UserDetailsImpl) principal).getUsername();
    } else if (principal instanceof org.springframework.security.core.userdetails.User) {
      username = ((org.springframework.security.core.userdetails.User) principal).getUsername();
    } else if (principal instanceof org.springframework.security.oauth2.core.user.DefaultOAuth2User) {
      username = ((org.springframework.security.oauth2.core.user.DefaultOAuth2User) principal)
          .getAttribute("email");
    } else {
      throw new IllegalArgumentException("Nieobsługiwany typ principal: " + principal.getClass());
    }
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date())
        .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
        .signWith(key(), SignatureAlgorithm.HS256)
        .compact();
  }
  
  private Key key() {
    return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
  }

  public String getUserNameFromJwtToken(String token) {
    return Jwts.parserBuilder().setSigningKey(key()).build()
               .parseClaimsJws(token).getBody().getSubject();
  }

  public boolean validateJwtToken(String authToken) {
    try {
      Jwts.parserBuilder().setSigningKey(key()).build().parse(authToken);
      return true;
    } catch (MalformedJwtException e) {
      logger.error("Invalid JWT token: {}", e.getMessage());
    } catch (ExpiredJwtException e) {
      logger.error("JWT token is expired: {}", e.getMessage());
    } catch (UnsupportedJwtException e) {
      logger.error("JWT token is unsupported: {}", e.getMessage());
    } catch (IllegalArgumentException e) {
      logger.error("JWT claims string is empty: {}", e.getMessage());
    }

    return false;
  }
}
