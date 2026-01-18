package com.example.bookreview;

import jakarta.validation.constraints.NotBlank;

public record BookRequest(
    @NotBlank String author, @NotBlank String title, int publicationYear, @NotBlank String isbn) {}
