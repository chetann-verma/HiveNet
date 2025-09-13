package com.hivenet.features.feed.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hivenet.features.feed.model.Post;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

	List<Post> findByAuthorIdNotOrderByCreationDateDesc(Long authenticatedUserid);

	List<Post> findAllByOrderByCreationDateDesc();

	List<Post> findByAuthorId(Long authorId ); 

}
