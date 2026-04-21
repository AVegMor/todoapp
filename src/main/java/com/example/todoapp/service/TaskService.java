package com.example.todoapp.service;

import com.example.todoapp.dto.CreateTaskRequest;
import com.example.todoapp.dto.UpdateTaskRequest;
import com.example.todoapp.exception.ResourceNotFoundException;
import com.example.todoapp.model.Task;
import com.example.todoapp.repository.TaskRepository;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class TaskService {
    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public List<Task> findAll() {
        return taskRepository.findAll();
    }

    public Task create(CreateTaskRequest request) {
        Task task = new Task();
        task.setTitle(request.title().trim());
        task.setCompleted(false);
        task.setCreatedAt(OffsetDateTime.now());
        return taskRepository.save(task);
    }

    public Task update(Long id, UpdateTaskRequest request) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("task_not_found"));
        task.setCompleted(request.completed());
        return taskRepository.save(task);
    }

    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new ResourceNotFoundException("task_not_found");
        }
        taskRepository.deleteById(id);
    }
}
