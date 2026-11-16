package com.zapiszto.controllers.clients.dto;

import java.util.UUID;


public record ClientDto(
    UUID id,
    String clientName,
    long userId,
    String userName
) {}
