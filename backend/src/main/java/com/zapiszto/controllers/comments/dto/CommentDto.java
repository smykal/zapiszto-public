package com.zapiszto.controllers.comments.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record CommentDto(
    UUID id,
    String author,
    String content,
    LocalDateTime createdAt
) {
}
