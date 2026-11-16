package com.zapiszto.controllers.comments.service;

import com.zapiszto.controllers.comments.dto.CommentDto;
import com.zapiszto.controllers.comments.dto.NewCommentDto;
import com.zapiszto.controllers.comments.repository.CommentsRepository;
import com.zapiszto.controllers.comments.serializer.CommentsSerializer;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CommentsService {
  @Autowired
  CommentsRepository commentsRepository;

  @Autowired
  CommentsSerializer commentsSerializer;

  public void createComment(NewCommentDto newCommentDto, Long userId) {
    commentsRepository.save(commentsSerializer.convert(newCommentDto, userId));
  }

  @Modifying
  @Transactional
  public void deleteComment(UUID commentId, Long userId) {
    commentsRepository.deleteComment(commentId, userId);
  }

  public List<CommentDto> getComments(String entityOrigin, UUID entityId) {
    var comments = commentsRepository.getComments(entityOrigin, entityId);
    return commentsSerializer.convert(comments);
  }
}
