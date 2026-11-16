package com.zapiszto.controllers.comments.repository;

import com.zapiszto.controllers.comments.entity.CommentEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentsRepository extends JpaRepository<CommentEntity, UUID> {
  @Query(nativeQuery = true, value = """
      delete from comments where
        id = :commentId
        and
        author_id = :userId
      """)
  void deleteComment(@Param("commentId") UUID commentId,
                     @Param("userId")Long userId);


  @Query(nativeQuery = true, value = """
      select * from comments
      where entity_origin = :entityOrigin
      and   entity_id = :entityId
      order by created_at desc
      """)
  List<CommentEntity> getComments(@Param("entityOrigin") String entityOrigin,
                                  @Param("entityId") UUID entityId);
}
