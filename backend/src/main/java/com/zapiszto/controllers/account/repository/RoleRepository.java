package com.zapiszto.controllers.account.repository;


import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.zapiszto.controllers.account.entity.ERole;
import com.zapiszto.controllers.account.entity.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
  Optional<Role> findByName(ERole name);


  @Query(nativeQuery = true, value = """
      select r.name
        from user_roles ur
        left join roles r on ur.role_id = r.id
      where ur.user_id = :userId
      """)
  String findRoleByUserId(
      @Param("userId") Long userId);
}
