package com.zapiszto.controllers.invitations.invitationsStatus.repository;

import com.zapiszto.controllers.invitations.invitationsStatus.entity.InvitationsStatusEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface InvitationsStatusRepository extends JpaRepository<InvitationsStatusEntity, Integer> {

  @Query(nativeQuery = true, value = """
          SELECT EXISTS (
                        SELECT 1
                        FROM users u
                        LEFT JOIN user_roles ur ON ur.user_id = u.id
                        LEFT JOIN roles r ON r.id = ur.role_id
                        WHERE r.name != :userRole
                          AND u.id != :userId
                          AND u.email = :invitationEmail
          )
  """)
  Boolean checkInvitationExists(@Param("userId") Long userId,
                                @Param("userRole") String userRole,
                                @Param("invitationEmail") String invitationEmail);

  @Query(nativeQuery = true, value = """
      select * from (
                      select 	status.*
                            , row_number() over (partition by status.invitations_id order by status.insert_date desc) as r
            	                from invitations_status status
            	                left join invitations i on i.id = status.invitations_id
                              where (i.inviter = :userId or i.invitee = :userId)
            		    ) as foo
            		      where foo.r = 1
      """)
  List<InvitationsStatusEntity> getInvitations(@Param("userId") Long userId);

  @Query(nativeQuery = true, value = """
      select * from (
                            select 	status.*
                                  , row_number() over (partition by status.invitations_id order by status.insert_date desc) as r
                  	                from invitations_status status
                  	                left join invitations i on i.id = status.invitations_id
                  	                left join dict_invitations_status dis on dis.id = status.dict_invitations_status_id
                                    where (i.inviter = :userId or i.invitee = :userId)
                                    and dis.name = 'APPROVED'
                  		    ) as foo
                  		      where foo.r = 1
      """)
  List<InvitationsStatusEntity> getAcceptedInvitations(@Param("userId") Long userId);

  @Query(nativeQuery = true, value = """
      select dis."name"  from invitations_status is2
      		left join dict_invitations_status dis on dis.id = is2.dict_invitations_status_id
      where invitations_id = :invitationId
      order by is2.insert_date desc
      limit 1
      """)
  String getLastStatus(@Param("invitationId") UUID invitationId);
}
