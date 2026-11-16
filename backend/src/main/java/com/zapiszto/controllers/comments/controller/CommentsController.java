package com.zapiszto.controllers.comments.controller;

import com.zapiszto.controllers.comments.dto.CommentDto;
import com.zapiszto.controllers.comments.dto.NewCommentDto;
import com.zapiszto.controllers.comments.service.CommentsService;
import com.zapiszto.controllers.common.ControllerCommon;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "*", maxAge = 3600)
@Slf4j
@RestController
@RequestMapping("/v1")
@PreAuthorize("hasRole('MODERATOR') or hasRole('ADMIN') or hasRole('TRAINER') or hasRole('USER')")
public class CommentsController implements ControllerCommon {
  @Autowired
  CommentsService commentsService;

  @GetMapping("/comments/{entityOrigin}/{entityId}")
  public ResponseEntity<List<CommentDto>> getComments(@PathVariable("entityOrigin") String entityOrigin,
                                                      @PathVariable("entityId") UUID entityId) {
    var userId = extractUserId();
    var result = commentsService.getComments(entityOrigin, entityId);
    return new ResponseEntity<>(result, HttpStatus.OK);
  }

  @PostMapping("/comment")
  public ResponseEntity<String> createComment(
      @RequestBody NewCommentDto newCommentDto) {
    var userId = extractUserId();
    commentsService.createComment(newCommentDto, userId);
    return new ResponseEntity<>(HttpStatus.CREATED);
  }

  @DeleteMapping("/comment/{commentId}")
  public ResponseEntity<String> deleteComment(@PathVariable("commentId") UUID commentId) {
    var userId = extractUserId();
    commentsService.deleteComment(commentId, userId);
    return new ResponseEntity<>(HttpStatus.OK);
  }
}
