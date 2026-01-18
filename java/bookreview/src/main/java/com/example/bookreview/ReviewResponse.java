package com.example.bookreview;

import lombok.Builder;

@Builder
public record ReviewResponse(int id, int rating, String content, String reviewAuthor) {}
