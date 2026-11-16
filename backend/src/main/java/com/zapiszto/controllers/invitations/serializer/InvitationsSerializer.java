package com.zapiszto.controllers.invitations.serializer;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.account.repository.RoleRepository;
import com.zapiszto.controllers.common.SerializerCommon;
import com.zapiszto.controllers.invitations.dto.AcceptedInvitationsDto;
import com.zapiszto.controllers.invitations.dto.InvitationDto;
import com.zapiszto.controllers.invitations.entity.InvitationsEntity;
import com.zapiszto.controllers.invitations.invitationsStatus.entity.InvitationsStatusEntity;
import com.zapiszto.controllers.invitations.repository.InvitationsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class InvitationsSerializer implements SerializerCommon {

  public static InvitationDto convert(InvitationsStatusEntity invitationsStatusEntity) {
    InvitationsEntity invitation = invitationsStatusEntity.getInvitationsEntity();

    return InvitationDto.builder()
        .id(invitation.getId())
        .inviterId(invitation.getInviter())
        .inviterName(invitation.getInviterEntity()
            .getUsername())
        .inviterEmail(invitation.getInviterEntity()
            .getEmail())
        .inviteeId(invitation.getInvitee())
        .inviteeName(invitation.getInviteeEntity()
            .getUsername())
        .inviteeEmail(invitation.getInviteeEntity()
            .getEmail())
        .status(invitationsStatusEntity.getDictInvitationsStatusEntity()
            .getName())
        .build();
  }

  public static InvitationDto setReceivedAndSent(InvitationDto invitationDto, long userId) {
    boolean isInviter = (invitationDto.getInviterId() == userId);
    invitationDto.setStatus(
        switch (invitationDto.getStatus()) {
          case APPROVED, REJECTED -> invitationDto.getStatus();
          default -> isInviter ? SENT : RECEIVED;
        }
    );
    return invitationDto;
  }

  public static AcceptedInvitationsDto prepareAcceptedInvitationsDto(InvitationDto invitationDto, long userId, boolean isTrainer) {

    return new AcceptedInvitationsDto(
        prepareAcceptedUserId(invitationDto, isTrainer, userId),
        prepareAcceptedUserEmail(invitationDto, isTrainer, userId),
        prepareAcceptedUserName(invitationDto, isTrainer, userId)
    );
  }

  private static String prepareAcceptedUserName(InvitationDto invitationDto, boolean isTrainer, Long userId) {
    return isTrainer || userId.equals(invitationDto.getInviterId()) ? invitationDto.getInviteeName() : invitationDto.getInviterName();
  }

  private static String prepareAcceptedUserEmail(InvitationDto invitationDto, boolean isTrainer, Long userId) {
    return isTrainer || userId.equals(invitationDto.getInviterId()) ? invitationDto.getInviteeEmail() : invitationDto.getInviterEmail();
  }

  private static Long prepareAcceptedUserId(InvitationDto invitationDto, boolean isTrainer, Long userId) {
    return isTrainer || userId.equals(invitationDto.getInviterId()) ? invitationDto.getInviteeId() : invitationDto.getInviterId();
  }


}
