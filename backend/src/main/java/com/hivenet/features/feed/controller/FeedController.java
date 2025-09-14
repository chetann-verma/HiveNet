package com.hivenet.features.feed.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import com.hivenet.features.authentication.model.AuthenticationUser;
import com.hivenet.features.feed.dto.CommentDto;
import com.hivenet.features.feed.dto.PostDto;
import com.hivenet.features.feed.model.Comment;
import com.hivenet.features.feed.model.Post;
import com.hivenet.features.feed.service.FeedService;

@RestController
@RequestMapping("/api/v1/feed")
public class FeedController {

	@Autowired
	private final FeedService feedService;

	public FeedController(FeedService feedService) {
		super();
		this.feedService = feedService;
	}
	
	
	@GetMapping
	public ResponseEntity<List<Post>> getFeedPosts(@RequestAttribute("authenticatedUser") AuthenticationUser user )
	{
		List<Post> posts = feedService.getFeedPosts(user.getId());
		return ResponseEntity.ok(posts);
	}
	
	
	@GetMapping("/posts")
	public ResponseEntity<List<Post>> getAllPosts()
	{
		List<Post> posts = feedService.getAllPosts();
		return ResponseEntity.ok(posts);
	}
	
	
	
	@PostMapping("/posts")
	public ResponseEntity<Post> createPost(@RequestBody PostDto postDto , @RequestAttribute("authenticatedUser") AuthenticationUser user )
	{
		Post post = feedService.createPost(postDto, user.getId());
		return ResponseEntity.ok(post);
	}
	
	
	@PutMapping("/posts/{postId}")
	public ResponseEntity<Post> editPost(@PathVariable Long postId, @RequestBody PostDto postDto,@RequestAttribute("authenticatedUser") AuthenticationUser user )
	{
		Post post = feedService.editPost(postId, user.getId(), postDto);
		return ResponseEntity.ok(post);
	}
	
	@GetMapping("/posts/{postId}")
	public ResponseEntity<Post> getPost(@PathVariable Long postId)
	{
		Post post = feedService.getPost(postId);
		return ResponseEntity.ok(post);
	}
	
	@DeleteMapping("/posts/{postId}")
	public ResponseEntity<Void> deletePost(@PathVariable Long postId ,@RequestAttribute("authenticatedUser") AuthenticationUser user )
	{
		feedService.deletePost(postId, user.getId());
		return ResponseEntity.noContent().build();
	}
	
	@GetMapping("/posts/user/{userId}")
	public ResponseEntity<List<Post>> getPostsByUserId(@PathVariable Long userId)
	{
		List<Post> posts = feedService.getPostsByUserId(userId);
		return ResponseEntity.ok(posts);
	}
	
	@PutMapping("/posts/{postId}/like")
	public ResponseEntity<Post> likePost(@PathVariable Long postId, @RequestAttribute("authenticatedUser") AuthenticationUser user  )
	{
		Post post = feedService.likePost(postId , user.getId());
		return ResponseEntity.ok(post);
	}
	
	@PostMapping("/posts/{postId}/comments")
	public ResponseEntity<Comment> addComment(@PathVariable Long postId,@RequestBody CommentDto commentDto, @RequestAttribute("authenticatedUser") AuthenticationUser user)
	{
		Comment comment = feedService.addComment(postId, user.getId(), commentDto.getContent());
		return ResponseEntity.ok(comment);
	}
	
	@PutMapping("/comments/{commentId}")
	public ResponseEntity<Comment> editComment(@PathVariable Long commentId,@RequestBody CommentDto commentDto, @RequestAttribute("authenticatedUser") AuthenticationUser user)
	{
		Comment comment = feedService.editComment(commentId, user.getId(), commentDto.getContent());
		return ResponseEntity.ok(comment);
	}
	
	@DeleteMapping("/comments/{commentId}")
	public ResponseEntity<Comment> deleteComment(@PathVariable Long commentId, @RequestAttribute("authenticatedUser") AuthenticationUser user)
	{
		feedService.deleteComment(commentId, user.getId());
		return ResponseEntity.noContent().build();
	}
	

	
}
