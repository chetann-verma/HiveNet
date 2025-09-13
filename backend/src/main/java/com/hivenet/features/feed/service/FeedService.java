package com.hivenet.features.feed.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hivenet.features.authentication.model.AuthenticationUser;
import com.hivenet.features.authentication.repository.AuthenticationUserRepository;
import com.hivenet.features.feed.dto.PostDto;
import com.hivenet.features.feed.model.Post;
import com.hivenet.features.feed.repository.PostRepository;

@Service
public class FeedService {

	@Autowired
	private final PostRepository postRepository;
	private final AuthenticationUserRepository userRepository;
	
	public FeedService(PostRepository postRepository, AuthenticationUserRepository userRepository) {
		super();
		this.postRepository = postRepository;
		this.userRepository = userRepository;
	}


	public Post createPost(PostDto postDto, Long authorId) {
		
		AuthenticationUser author = userRepository.findById(authorId).orElseThrow(()-> new IllegalArgumentException("User not found"));
	    Post post = new Post(postDto.getContent(), author);
	   post.setPicture(postDto.getPicture());
	    return postRepository.save(post);
	    		
	    		
	    		
	}


	public Post editPost(Long postId, Long userId, PostDto postDto) {
		
		Post post = postRepository.findById(postId).orElseThrow(()->new IllegalArgumentException("Post not found"));
		AuthenticationUser author = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));
		
		if(!post.getAuthor().equals(author))
		{
			throw new IllegalArgumentException("User is not the author of this post");
		}
		
		post.setContent(postDto.getContent());
		post.setPicture(postDto.getPicture());
		return postRepository.save(post);
	}


	public List<Post> getFeedPosts(Long authenticatedUserid) {
		return postRepository.findByAuthorIdNotOrderByCreationDateDesc(authenticatedUserid);
		// Our ORM run corresponding query by name of method 
		// in name means not find by author id but by creation date in descending order
	}


	public List<Post> getAllPosts() {
		
		return postRepository.findAllByOrderByCreationDateDesc();
	}


	public Post getPost(Long postId) {
		return postRepository.findById(postId).orElseThrow(()-> new IllegalArgumentException("Post not found"));
		
	}


	public void deletePost(Long postId, Long userId) {
		
		Post post = postRepository.findById(postId).orElseThrow(()->new IllegalArgumentException("Post not found"));
		AuthenticationUser author = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));
		
		if(!post.getAuthor().equals(author))
		{
			throw new IllegalArgumentException("Post belongs to someone else !!");
		}
		postRepository.delete(post);
	}


	public List<Post> getPostsByUserId(Long userId) {
		// TODO Auto-generated method stub
		return postRepository.findByAuthorId(userId);
	} 

}
