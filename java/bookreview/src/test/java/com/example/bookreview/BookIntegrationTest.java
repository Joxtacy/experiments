package com.example.bookreview;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.jdbc.test.autoconfigure.AutoConfigureTestDatabase;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@AutoConfigureTestDatabase
class BookIntegrationTest {

  @Autowired private MockMvc mockMvc;

  @Autowired private BookRepository bookRepository;

  @Autowired private ReviewRepository reviewRepository;

  @BeforeEach
  void setUp() {
    reviewRepository.deleteAll();
    bookRepository.deleteAll();
  }

  @Test
  void fullBookLifecycle() throws Exception {
    // Create a book
    var createResult =
        mockMvc
            .perform(
                post("/books")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(
                        """
                        {
                            "title": "Integration Test Book",
                            "author": "Test Author",
                            "isbn": "integration-123",
                            "publicationYear": 2024
                        }
                        """))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.id").exists())
            .andReturn();

    // Verify it's in the database
    var books = bookRepository.findAll();
    assertThat(books).hasSize(1);
    var bookId = books.get(0).getId();

    // Fetch the book
    mockMvc
        .perform(get("/books/" + bookId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.title").value("Integration Test Book"))
        .andExpect(jsonPath("$.reviews").isEmpty());

    // Add a review
    mockMvc
        .perform(
            post("/books/" + bookId + "/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                        {
                            "rating": 5,
                            "content": "Great book!",
                            "reviewAuthor": "Happy Reader"
                        }
                        """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.rating").value(5));

    // Fetch book again - should have the review
    mockMvc
        .perform(get("/books/" + bookId))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.reviews").isNotEmpty())
        .andExpect(jsonPath("$.reviews[0].rating").value(5));

    // List all books - should include average rating
    mockMvc
        .perform(get("/books"))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$[0].averageRating").value(5.0));
  }

  @Test
  void createBook_withDuplicateIsbn_returnsError() throws Exception {
    // Create first book
    mockMvc
        .perform(
            post("/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                    "title": "First Book",
                    "author": "Author",
                    "isbn": "duplicate-isbn",
                    "publicationYear": 2024
                }
                """))
        .andExpect(status().isCreated());

    // Try to create another with same ISBN
    mockMvc
        .perform(
            post("/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                    "title": "Second Book",
                    "author": "Author",
                    "isbn": "duplicate-isbn",
                    "publicationYear": 2024
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(content().string("ISBN already exists"));
  }

  @Test
  void createBook_withInvalidData_returnsValidationErrors() throws Exception {
    mockMvc
        .perform(
            post("/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                    "title": "",
                    "author": "",
                    "isbn": "",
                    "publicationYear": 2024
                }
                """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.title").exists())
        .andExpect(jsonPath("$.author").exists())
        .andExpect(jsonPath("$.isbn").exists());
  }
}
