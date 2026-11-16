package com.zapiszto.controllers.invitations.dto;

import java.util.UUID;

public record MatchedInvitationsDto(
    Long userId,
    String userEmail,
    String userName,
    Boolean matched,
    UUID clientId
) {
}
