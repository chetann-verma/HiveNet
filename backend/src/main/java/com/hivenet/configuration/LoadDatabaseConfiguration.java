package com.hivenet.configuration;

import java.util.HashSet;
import java.util.List;
import java.util.Random;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.hivenet.features.authentication.model.AuthenticationUser;
import com.hivenet.features.authentication.repository.AuthenticationUserRepository;
import com.hivenet.features.authentication.utils.Encoder;
import com.hivenet.features.feed.model.Post;
import com.hivenet.features.feed.repository.PostRepository;

@Configuration
public class LoadDatabaseConfiguration {
    private final Encoder encoder;

    public LoadDatabaseConfiguration(Encoder encoder) {
        this.encoder = encoder;
    }

    @Bean 
    public CommandLineRunner initDatabase(AuthenticationUserRepository authenticationUserRepository, PostRepository postRepository) {
        return args -> {
            List<AuthenticationUser> users = createUsers(authenticationUserRepository);
            createPosts(postRepository, users);
        };
    }

    // creating random users 
    private List<AuthenticationUser> createUsers(AuthenticationUserRepository authenticationUserRepository) {
        List<AuthenticationUser> users = List.of(
        		createUser("aarav.patel1996@example.com", "aarav", "Aarav", "Patel", "Software Engineer", "Infosys", "Bengaluru, IN",
        		        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=3600&auto=format&fit=crop"),
        		createUser("priya.sharma84@example.com", "priya", "Priya", "Sharma", "Data Scientist", "TCS", "Pune, IN",
        		        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=3600&auto=format&fit=crop"),
        		createUser("rohit.iyer01@example.com", "rohit", "Rohit", "Iyer", "Product Manager", "Flipkart", "Chennai, IN",
        		        "https://images.unsplash.com/photo-1544725176-7c40e5a2c9f9?q=80&w=3600&auto=format&fit=crop"),
        		createUser("nisha.gupta.art@example.com", "nisha", "Nisha", "Gupta", "UX Designer", "Zomato", "New Delhi, IN",
        		        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=3600&auto=format&fit=crop"),
        		createUser("amar.singh.del@example.com", "amar", "Amar", "Singh", "Cloud Architect", "HCL", "Gurgaon, IN",
        		        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=3600&auto=format&fit=crop")

        );

        authenticationUserRepository.saveAll(users);
        return users;
    }

    private AuthenticationUser createUser(String email, String password, String firstName, String lastName, String position,
                                          String company, String location, String profilePicture) {
        AuthenticationUser user = new AuthenticationUser(email, encoder.encode(password));
        user.setEmailVerified(true);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setPosition(position);
        user.setCompany(company);
        user.setLocation(location);
        user.setProfilePicture(profilePicture);
        return user;
    }

    private void createPosts(PostRepository postRepository, List<AuthenticationUser> users) {
        Random random = new Random();
        for (int j = 1; j <= 10; j++) {
            Post post = new Post("Making memories and living in the moment.",
                    users.get(random.nextInt(users.size())));
            post.setLikes(generateLikes(users, j, random));
            if (j == 1) {
                post.setPicture("https://images.unsplash.com/photo-1731176497854-f9ea4dd52eb6?q=80&w=3432&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D");
            }
            postRepository.save(post);
        }
    }

    private HashSet<AuthenticationUser> generateLikes(List<AuthenticationUser> users, int postNumber, Random random) {
        HashSet<AuthenticationUser> likes = new HashSet<>();

        if (postNumber == 1) {
            while (likes.size() < 3) {
                likes.add(users.get(random.nextInt(users.size())));
            }
        } else {
            int likesCount = switch (postNumber % 5) {
                case 0 -> 3;
                case 2, 3 -> 2;
                default -> 1;
            };
            for (int i = 0; i < likesCount; i++) {
                likes.add(users.get(random.nextInt(users.size())));
            }
        }
        return likes;
    }
}