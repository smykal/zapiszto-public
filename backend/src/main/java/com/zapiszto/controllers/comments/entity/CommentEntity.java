package com.zapiszto.controllers.comments.entity;

import com.zapiszto.controllers.account.entity.User;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.joda.time.DateTime;

@Entity
@Table(name = "comments",
       indexes = {
           @Index(name = "idx_comments_entity", columnList = "entity_origin, entity_id"),
           @Index(name = "idx_comments_created_at", columnList = "created_at")
       })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CommentEntity {
  @Id
  @GeneratedValue
  @Column(name = "id", updatable = false, nullable = false)
  UUID id;

  @Enumerated(EnumType.STRING)
  @Column(name = "entity_origin", nullable = false, length = 50)
  private Origin entityOrigin;

  @Column(name = "entity_id", nullable = false)
  private UUID entityId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "author_id", nullable = false)
  private User author;

  @Column(name = "content", nullable = false, length = 500)
  private String content;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  // ====== Lifecycle ======
  @PrePersist
  public void prePersist() {
    this.createdAt = LocalDateTime.now();
  }
}



