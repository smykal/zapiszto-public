package com.zapiszto.controllers.invitations.dto;

public record AcceptedInvitationsDto(
    Long acceptedUserId,
    String acceptedUserEmail,
    String acceptedUserName
) {}
