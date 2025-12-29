package com.hivenet.features.notifications.repository;
import org.springframework.data.jpa.repository.JpaRepository;

import com.hivenet.features.authentication.model.AuthenticationUser;
import com.hivenet.features.notifications.model.Notification;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient(AuthenticationUser recipient);
    List<Notification> findByRecipientOrderByCreationDateDesc(AuthenticationUser user);
}