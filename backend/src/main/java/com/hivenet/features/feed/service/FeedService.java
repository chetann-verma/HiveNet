package com.hivenet.features.feed.service;

import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hivenet.features.authentication.model.AuthenticationUser;
import com.hivenet.features.authentication.repository.AuthenticationUserRepository;
import com.hivenet.features.feed.dto.PostDto;
import com.hivenet.features.feed.model.Comment;
import com.hivenet.features.feed.model.Post;
import com.hivenet.features.feed.repository.CommentRepository;
import com.hivenet.features.feed.repository.PostRepository;
import com.hivenet.features.notifications.service.NotificationService;

@Service
public class FeedService {

	@Autowired
	private final PostRepository postRepository;
	private final AuthenticationUserRepository userRepository;
	private final CommentRepository commentRepository;
	private final NotificationService notificationService;
	
	public FeedService(PostRepository postRepository, AuthenticationUserRepository userRepository, CommentRepository commentRepository, NotificationService notificationService ) {
		super();
		this.postRepository = postRepository;
		this.userRepository = userRepository;
		this.commentRepository = commentRepository;
		this.notificationService = notificationService;
	}


	public Post createPost(PostDto postDto, Long authorId) {
		
		AuthenticationUser author = userRepository.findById(authorId).orElseThrow(()-> new IllegalArgumentException("User not found"));
	    Post post = new Post(postDto.getContent(), author);
	   post.setPicture(postDto.getPicture());
	    return postRepository.save(post);
	    		
	    		
	    		
	}


	public Post editPost(Long postId, Long userId, PostDto postDto) {
		
		Post post = postRepository.findById(postId).orElseThrow(()->new IllegalArgumentException("Post not found"));
		AuthenticationUser user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));
		
		if(!post.getAuthor().equals(user))
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
		AuthenticationUser user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));
		
		if(!post.getAuthor().equals(user))
		{
			throw new IllegalArgumentException("Post belongs to someone else !!");
		}
		postRepository.delete(post);
	}


	public List<Post> getPostsByUserId(Long userId) {
		// TODO Auto-generated method stub
		return postRepository.findByAuthorId(userId);
	}


	public Post likePost(Long postId, Long userId) {
		
		Post post = postRepository.findById(postId).orElseThrow(()->new IllegalArgumentException("Post not found"));
		AuthenticationUser user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));
		
		if(post.getLikes().contains(user))
		{
			post.getLikes().remove(user);
		}
		else
		{
			post.getLikes().add(user);
			notificationService.sendLikeNotification(user, post.getAuthor(), post.getId()); // yaha se notification jayega through service (red badge)
		}
		Post savedPost = postRepository.save(post);
		notificationService.sendLikeToPost(postId, savedPost.getLikes()); // post update itself
		return savedPost;

	}


	public Comment addComment(Long postId, Long userId, String content) {
		
		Post post = postRepository.findById(postId).orElseThrow(()-> new IllegalArgumentException("Post not found"));
		AuthenticationUser user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));	
		Comment comment = commentRepository.save(new Comment(post, user, content));
		notificationService.sendCommentNotification(user, comment.getAuthor(), post.getId());// user ko notification jayega red badge 
		notificationService.sendCommentToPost(postId, comment);// and here post update itself 
		return comment;
	}
	
	public Comment editComment(Long commentId, Long userId, String newContent) {
		Comment comment = commentRepository.findById(commentId).orElseThrow(()-> new IllegalArgumentException("Comment not found"));
		AuthenticationUser user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));
		if(!comment.getAuthor().equals(user))
		{
			throw new IllegalArgumentException("User is not author of comment");
		}
		comment.setContent(newContent);
		return commentRepository.save(comment);
	} 
	

	public void deleteComment(Long commentId, Long userId) {
		Comment comment = commentRepository.findById(commentId).orElseThrow(()-> new IllegalArgumentException("Comment not found"));
		AuthenticationUser user = userRepository.findById(userId).orElseThrow(()-> new IllegalArgumentException("User not found"));
		if(!comment.getAuthor().equals(user))
		{
			throw new IllegalArgumentException("User is not author of comment");
		}
		commentRepository.delete(comment);
		
	}


	public List<Comment> getPostComments(Long postId) {
		Post post = postRepository.findById(postId).orElseThrow(()-> new IllegalArgumentException("Post not found"));
		return post.getComments();
	}
	
	public Set<AuthenticationUser> getPostLikes(Long postId) {
		Post post = postRepository.findById(postId).orElseThrow(() -> new IllegalArgumentException("Post not found"));
		return post.getLikes();
	}



}
