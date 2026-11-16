package com.zapiszto.controllers.account.security.oauth2;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.account.entity.Role;
import com.zapiszto.controllers.account.entity.User;
import com.zapiszto.controllers.account.repository.RoleRepository;
import com.zapiszto.controllers.account.repository.UserRepository;
import com.zapiszto.controllers.userDetails.entity.UserDetailsEntity;
import com.zapiszto.controllers.userDetails.repository.UserDetailsRepository;
import com.zapiszto.controllers.dictionaries.dictLanguages.repository.DictLanguagesRepository;
import com.zapiszto.controllers.dictionaries.dictLanguages.entity.DictLanguagesEntity;

import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final UserDetailsRepository userDetailsRepository;
  private final DictLanguagesRepository dictLanguagesRepository;

  @Override
  public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
    OAuth2User oauth2User = super.loadUser(userRequest);

    String registrationId = userRequest.getClientRegistration().getRegistrationId();
    String email = (String) oauth2User.getAttributes().get("email");
    String name = (String) oauth2User.getAttributes().getOrDefault("name", email);

    if (email == null) {
      throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
    }

    Optional<User> optionalUser = userRepository.findByEmail(email);
    if (optionalUser.isEmpty()) {
      User newUser = new User();
      String base = name.replaceAll("\\s+","").toLowerCase();
      if (base.isEmpty()) base = email.split("@")[0];
      String username = base;
      int suffix = 1;
      while (userRepository.existsByUsername(username)) {
        username = base + suffix++;
      }
      newUser.setUsername(username);
      newUser.setEmail(email);
      newUser.setPassword(UUID.randomUUID().toString());
      Role userRole = roleRepository.findByName(ERole.ROLE_USER)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      newUser.setRoles(new HashSet<>(Collections.singletonList(userRole)));
      User saved = userRepository.save(newUser);

      DictLanguagesEntity lang = dictLanguagesRepository.getByCode("en");
      UserDetailsEntity ude = UserDetailsEntity.builder()
          .userId(saved.getId())
          .dictLanguagesEntity(lang)
          .registerDate(ZonedDateTime.now())
          .build();
      userDetailsRepository.save(ude);
    }

    return oauth2User;
  }
}
