package com.zapiszto.controllers.invitations.service;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.account.repository.RoleRepository;
import com.zapiszto.controllers.clients.entity.ClientEntity;
import com.zapiszto.controllers.clients.repository.ClientsRepository;
import com.zapiszto.controllers.invitations.dictInvitationsStatus.entity.DictInvitationsStatusEntity;
import com.zapiszto.controllers.invitations.dictInvitationsStatus.repository.DictInvitationsStatusRepository;
import com.zapiszto.controllers.invitations.dto.AcceptedInvitationsDto;
import com.zapiszto.controllers.invitations.dto.InvitationDto;
import com.zapiszto.controllers.invitations.dto.MatchedInvitationsDto;
import com.zapiszto.controllers.invitations.entity.InvitationsEntity;
import com.zapiszto.controllers.invitations.invitationsStatus.entity.InvitationsStatusEntity;
import com.zapiszto.controllers.invitations.invitationsStatus.repository.InvitationsStatusRepository;
import com.zapiszto.controllers.invitations.repository.InvitationsRepository;
import com.zapiszto.controllers.invitations.serializer.InvitationsSerializer;
import com.zapiszto.controllers.account.repository.UserRepository;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class InvitationsService {
  @Autowired
  private ClientsRepository clientsRepository;

  @Autowired
  private DictInvitationsStatusRepository dictInvitationsStatusRepository;

  @Autowired
  InvitationsRepository invitationsRepository;

  @Autowired
  InvitationsStatusRepository invitationsStatusRepository;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  private final String SENT = "SENT";
  private final String APPROVED = "APPROVED";
  private final String REJECTED = "REJECTED";

  @Transactional
  public String addInvitation(Long inviterId, ERole inviterRole, String inviteeEmail) {
    var checkIfEmailExists = checkIfEmailExists(inviteeEmail);
    var checkIfEmailNotBelongsToInviteer = checkIfEmailNotBelongsToInviter(inviteeEmail, inviterId);
    var checkIfRolesAreDifferent = checkIfRolesAreDifferent(inviterRole.toString(), inviteeEmail);

    if (checkIfEmailExists &&
        checkIfEmailNotBelongsToInviteer &&
        checkIfRolesAreDifferent) {
      InvitationsEntity invitationsEntity = InvitationsEntity.builder()
          .id(UUID.randomUUID())
          .inviter(inviterId)
          .invitee(userRepository.idByEmail(inviteeEmail))
          .build();
      invitationsRepository.save(invitationsEntity);
      log.info(
          "add invitation with id {} sent by user {}, to {}",
          invitationsEntity.getId(),
          invitationsEntity.getInviter(),
          invitationsEntity.getInvitee()
      );

      DictInvitationsStatusEntity status = dictInvitationsStatusRepository.getByName(SENT);

      InvitationsStatusEntity invitationsStatusEntity = InvitationsStatusEntity.builder()
          .id(UUID.randomUUID())
          .invitationsEntity(invitationsEntity)
          .insert_date(ZonedDateTime.now())
          .dictInvitationsStatusEntity(status)
          .build();
      invitationsStatusRepository.save(invitationsStatusEntity);
      log.info(
          "add invitation Status with id: {}, invitation_id: {}, status: {}",
          invitationsStatusEntity.getId(),
          invitationsStatusEntity.getInvitationsEntity(),
          invitationsStatusEntity.getDictInvitationsStatusEntity()
              .getName()
      );

      return invitationsEntity.getId()
          .toString();
    }

    return null;
  }

  private boolean checkIfRolesAreDifferent(String inviterRole, String inviteeEmail) {
    Long userIdByEmail = userRepository.idByEmail(inviteeEmail);
    String inviteeRole = userRepository.roleById(userIdByEmail);
    return !Objects.equals(inviterRole, inviteeRole);
  }

  private boolean checkIfEmailNotBelongsToInviter(String inviteeEmail, Long inviterId) {
    Long userIdByEmail = userRepository.idByEmail(inviteeEmail);
    return userIdByEmail == null || !userIdByEmail.equals(inviterId);
  }

  private boolean checkIfEmailExists(String inviteeEmail) {
    return userRepository.existsByEmail(inviteeEmail);
  }

  public List<InvitationDto> getInvitations(Long userId) {
    List<InvitationsStatusEntity> invitationsEntity = invitationsStatusRepository.getInvitations(userId);

    return invitationsEntity.stream()
        .map(InvitationsSerializer::convert)
        .map(invitationDto -> InvitationsSerializer.setReceivedAndSent(invitationDto, userId))
        .collect(Collectors.toList());
  }

  public List<AcceptedInvitationsDto> getAcceptedInvitations(Long userId) {
    List<InvitationsStatusEntity> invitationsEntity = invitationsStatusRepository.getAcceptedInvitations(userId);
    List<InvitationDto> invitationDtoList = invitationsEntity.stream()
        .map(InvitationsSerializer::convert)
        .toList();

    List<AcceptedInvitationsDto> acceptedInvitationsDtos = new ArrayList<>();
    for (InvitationDto invitationDto : invitationDtoList) {
      var inviterId = invitationsRepository.getById(invitationDto.getId())
          .getInviter();
      var userRole = roleRepository.findRoleByUserId(inviterId);
      var isTrainer = userRole.equals(ERole.ROLE_TRAINER);

      acceptedInvitationsDtos.add(InvitationsSerializer.prepareAcceptedInvitationsDto(invitationDto, userId, isTrainer));
    }
    return acceptedInvitationsDtos;
  }

  public List<MatchedInvitationsDto> getMatchedInvitations(Long userId) {
    var acceptedInvitationsDto = getAcceptedInvitations(userId);

    List<Long> userIds = acceptedInvitationsDto.stream()
        .map(AcceptedInvitationsDto::acceptedUserId)
        .toList();

    List<ClientEntity> clientEntities = clientsRepository.getClientsByUserId(userIds);

    Map<Long, ClientEntity> clientMap = clientEntities.stream()
        .filter(c -> c.getUserId() != null)
        .collect(Collectors.toMap(ClientEntity::getUserId, c -> c));

    return acceptedInvitationsDto.stream()
        .map(dto -> {
          ClientEntity client = clientMap.get(dto.acceptedUserId());
          boolean matched = client != null;
          UUID clientId = matched ? client.getId() : null;

          return new MatchedInvitationsDto(
              dto.acceptedUserId(),
              dto.acceptedUserEmail(),
              dto.acceptedUserName(),
              matched,
              clientId
          );
        })
        .toList();
  }



  @Transactional
  public String approveInvitation(InvitationDto invitationDto, Long userId) {
    var checkIfInvitationIsAddressToUser = checkIfInvitationIsAddressToUser(invitationDto, userId);
    var checkIfLastStatusIsSent = checkIfLastStatusIsSent(invitationDto);
    if (checkIfInvitationIsAddressToUser &&
        checkIfLastStatusIsSent) {
      DictInvitationsStatusEntity status = dictInvitationsStatusRepository.getByName(APPROVED);
      InvitationsEntity invitation = invitationsRepository.getById(invitationDto.getId());
      InvitationsStatusEntity invitationsStatusEntity = InvitationsStatusEntity.builder()
          .id(UUID.randomUUID())
          .invitationsEntity(invitation)
          .insert_date(ZonedDateTime.now())
          .dictInvitationsStatusEntity(status)
          .build();

      invitationsStatusRepository.save(invitationsStatusEntity);
      log.info(
          "add invitation Status with id: {}, invitation_id: {}, status: APPROVED",
          invitationsStatusEntity.getId(),
          invitation.getId()
      );
    }
    return null;
  }

  @Transactional
  public String rejectInvitation(InvitationDto invitationDto, Long userId) {
    var checkIfInvitationIsAddressToUser = checkIfInvitationIsAddressToUser(invitationDto, userId);
    var checkIfLastStatusIsSent = checkIfLastStatusIsSent(invitationDto);
    if (checkIfInvitationIsAddressToUser &&
        checkIfLastStatusIsSent) {
      DictInvitationsStatusEntity status = dictInvitationsStatusRepository.getByName(REJECTED);
      InvitationsEntity invitation = invitationsRepository.getById(invitationDto.getId());
      InvitationsStatusEntity invitationsStatusEntity = InvitationsStatusEntity.builder()
          .id(UUID.randomUUID())
          .invitationsEntity(invitation)
          .insert_date(ZonedDateTime.now())
          .dictInvitationsStatusEntity(status)
          .build();

      invitationsStatusRepository.save(invitationsStatusEntity);
      log.info(
          "add invitation Status with id: {}, invitation_id: {}, status: REJECTED",
          invitationsStatusEntity.getId(),
          invitation.getId()
      );
    }
    return null;
  }

  private boolean checkIfLastStatusIsSent(InvitationDto invitationDto) {
    UUID invitationId = invitationDto.getId();
    return SENT.equals(invitationsStatusRepository.getLastStatus(invitationId));
  }

  private boolean checkIfInvitationIsAddressToUser(InvitationDto invitationDto, Long userId) {
    return invitationDto.getInviterId() == userId || invitationDto.getInviteeId() == userId;
  }

  public Boolean checkInvitation(Long userId, ERole userRole, String email) {
    String role = userRole.name();
    return invitationsStatusRepository.checkInvitationExists(userId, role, email);
  }

}
