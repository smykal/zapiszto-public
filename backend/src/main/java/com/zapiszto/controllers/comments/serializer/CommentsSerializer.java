package com.zapiszto.controllers.comments.serializer;

import com.zapiszto.controllers.account.entity.User;
import com.zapiszto.controllers.comments.dto.CommentDto;
import com.zapiszto.controllers.comments.dto.NewCommentDto;
import com.zapiszto.controllers.comments.entity.CommentEntity;
import com.zapiszto.controllers.comments.entity.Origin;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class CommentsSerializer {

  @PersistenceContext
  EntityManager entityManager;

  public CommentEntity convert(NewCommentDto newCommentDto, Long userId) {

    return CommentEntity.builder()
        .entityId(newCommentDto.originId())
        .entityOrigin(Origin.valueOf(newCommentDto.origin()))
        .author(entityManager.getReference(User.class, userId))
        .content(newCommentDto.content())
        .build();
  }

  public List<CommentDto> convert(List<CommentEntity> commentEntityList) {
    return commentEntityList.stream().map(this::convert).toList();
  }

  public CommentDto convert(CommentEntity commentEntity) {
    return new CommentDto(commentEntity.getId(),
        commentEntity.getAuthor().getUsername(),
        commentEntity.getContent(),
        commentEntity.getCreatedAt());
  }
}
