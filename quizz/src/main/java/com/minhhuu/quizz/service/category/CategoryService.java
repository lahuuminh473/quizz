package com.minhhuu.quizz.service.category;

import com.minhhuu.quizz.dto.CategoryRequest;
import com.minhhuu.quizz.dto.CategoryResponse;
import com.minhhuu.quizz.entity.Category;
import com.minhhuu.quizz.exception.CategoryAlreadyExists;
import com.minhhuu.quizz.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService implements ICategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    private CategoryResponse mapToResponse(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setDescription(category.getDescription());
        return response;
    }
    @Override
    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(()-> new RuntimeException("category not found with id: " + id));
    }

    @Override
    public CategoryResponse createCategory(CategoryRequest categoryRequest) {
        if(categoryRepository.existsByName(categoryRequest.getName())){
            throw new CategoryAlreadyExists("category already exists with name: "+ categoryRequest.getName());
        }
        Category category = new Category();
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    public CategoryResponse updateCategory(Long id, CategoryRequest categoryRequest) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("category not found with id: " + id));
        if(categoryRepository.existsByNameAndIdNot(categoryRequest.getName(), id)){
            throw new CategoryAlreadyExists("category already exists with name: "+ categoryRequest.getName());
        }
        category.setName(categoryRequest.getName());
        category.setDescription(categoryRequest.getDescription());
        return mapToResponse(categoryRepository.save(category));
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("category not found with id: " + id));
        categoryRepository.deleteById(id);
    }
}
