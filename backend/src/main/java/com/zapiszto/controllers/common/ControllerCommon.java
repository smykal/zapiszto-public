package com.zapiszto.controllers.common;

import static com.zapiszto.controllers.account.entity.ERole.*;
import static com.zapiszto.controllers.account.entity.ERole.ROLE_USER;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.account.security.services.UserDetailsImpl;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public interface ControllerCommon {

  default Long extractUserId() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl user) {
      return ((UserDetailsImpl) authentication.getPrincipal()).getId();
      //user.getUsername(); // Assuming username is the user ID
    }
    return null;
  }

  default ERole extractUserRole() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl user) {
      String role = ((UserDetailsImpl) authentication.getPrincipal()).getAuthorities().toString();
      if (role.contains(ROLE_USER.name())) {
        return ROLE_USER;
      } else if (role.contains(ROLE_ADMIN.name())) {
        return ROLE_ADMIN;
      } else {
        return ROLE_TRAINER;
      }
    }
    return null;
  }

  default String extractUserMail() {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof UserDetailsImpl user) {
      return ((UserDetailsImpl) authentication.getPrincipal()).getEmail();
      //user.getUsername(); // Assuming username is the user ID
    }
    return null;
  }


}
