package com.hivenet.features.feed.model;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.hivenet.features.authentication.model.AuthenticationUser;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PreUpdate;

@Entity(name = "posts")
public class Post {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String content;
	private String picture;

	@OnDelete(action = OnDeleteAction.CASCADE) // has to delete added by chatgpt
	@ManyToOne // An user can have multiple posts but a post only have one author
	@JoinColumn(name = "author_id" ,nullable = false) // use to change the foreign key name..
	private AuthenticationUser author;
	
	@CreationTimestamp
	private LocalDateTime creationDate;
	
	private LocalDateTime updatedDate;
	
	@OneToMany(
			mappedBy = "post",
			cascade = CascadeType.ALL , orphanRemoval = true
			)
	private List<Comment> comments;
	
	
	@ManyToMany
	@JoinTable(
			name = "posts_likes",
			joinColumns = @JoinColumn(name="post_id"),
			inverseJoinColumns = @JoinColumn(name= "user_id")
			)
	private Set<AuthenticationUser> likes;
	
	@PreUpdate
	public void preUpdate()
	{
		this.updatedDate = LocalDateTime.now();
	}
	

	public Post(String content, AuthenticationUser author) // Note: Constructors order can also change order of appearance of json in postman
	{
		this.content = content;
		this.author = author;
	}
	
	public Post()
	{
		
	}
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getPicture() {
		return picture;
	}

	public void setPicture(String picture) {
		this.picture = picture;
	}

	
	
	public AuthenticationUser getAuthor() {
		return author;
	}

	public void setAuthor(AuthenticationUser author) {
		this.author = author;
	}

	public LocalDateTime getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(LocalDateTime creationDate) {
		this.creationDate = creationDate;
	}

	public LocalDateTime getUpdatedDate() {
		return updatedDate;
	}

	public void setUpdatedDate(LocalDateTime updatedDate) {
		this.updatedDate = updatedDate;
	}


	public Set<AuthenticationUser> getLikes() {
		return likes;
	}


	public void setLikes(Set<AuthenticationUser> likes) {
		this.likes = likes;
	}

	
	
	
}
