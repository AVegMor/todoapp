package com.example.todoapp.dto;

import jakarta.validation.constraints.NotNull;

public record UpdateTaskRequest(
        @NotNull(message = "completed is required")
        Boolean completed
) {
}
