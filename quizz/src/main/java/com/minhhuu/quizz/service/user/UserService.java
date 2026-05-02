package com.minhhuu.quizz.service.user;

import com.minhhuu.quizz.dto.UserRequest;
import com.minhhuu.quizz.dto.UserResponse;
import com.minhhuu.quizz.entity.User;
import com.minhhuu.quizz.exception.ResourceNotFoundException;
import com.minhhuu.quizz.exception.UserAlreadyExistsException;
import com.minhhuu.quizz.repository.UserRepository;
import com.minhhuu.quizz.service.user.IUserService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements IUserService {
    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
    public UserResponse mapToUserResponse(User user){
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setAddress(user.getAddress());
        response.setUsername(user.getUserName());
        response.setRole(user.getRole());
        return response;

    }
    public User mapToEntity(UserRequest request){
        User user = new User();
        user.setUserName(request.getUsername());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        return user;
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .toList();
    }

    @Override
    public UserResponse getUserById(Long id) {
        return userRepository.findById(id)
                .map(this::mapToUserResponse)
                .orElseThrow(()->new ResourceNotFoundException("User not found with id: " + id));
    }

    @Override
    public UserResponse createUser(UserRequest request) {
        if(userRepository.existsByUserName(request.getUsername())){
            throw new UserAlreadyExistsException("User already exists with username: " + request.getUsername());
        }
        if(userRepository.existsByEmail(request.getEmail())){
            throw new UserAlreadyExistsException("User already exists with email: " + request.getEmail());
        }
        User user = mapToEntity(request);
        return mapToUserResponse(userRepository.save(user));
    }

    @Override
    public UserResponse updateUser(Long id, UserRequest request) {
        User user= userRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("user not found with id: " + id));
        if(userRepository.existsByUserNameAndIdNot(request.getUsername(),id)){
            throw new UserAlreadyExistsException("User already exists with username: " + request.getUsername());
        }
        if(userRepository.existsByEmailAndIdNot(request.getEmail(),id)){
            throw new UserAlreadyExistsException("User already exists with email: " + request.getEmail());
        }
        user.setUserName(request.getUsername());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setPassword(request.getPassword());
        user.setRole(request.getRole());
        return mapToUserResponse(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.findById(id)
                .orElseThrow(()->new ResourceNotFoundException("User not found with id: " + id));
        userRepository.deleteById(id);
    }
}
