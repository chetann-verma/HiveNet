package com.hivenet.features.feed.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hivenet.features.feed.model.Comment;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

}
