package com.example.bookreview;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.List;
import lombok.Builder;

@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public record BookResponse(
    int id,
    String author,
    String title,
    Integer publicationYear,
    String isbn,
    List<ReviewResponse> reviews,
    Double averageRating) {}
