package com.solekta.solekta.repository;

import com.solekta.solekta.model.Profile;
import com.solekta.solekta.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUser(User user);
}


