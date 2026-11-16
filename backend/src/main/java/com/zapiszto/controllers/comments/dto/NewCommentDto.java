package com.zapiszto.controllers.comments.dto;

import java.util.UUID;

public record NewCommentDto(
    String origin,
    UUID originId,
    String content
) {
}
