package com.example.bookreview;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(BookController.class)
public class BookControllerTest {

  @Autowired private MockMvc mockMvc;

  @MockitoBean private BookRepository bookRepository;

  @MockitoBean private ReviewRepository reviewRepository;

  @Test
  void createBook_returnsCreated() throws Exception {
    var savedBook = Book.builder().id(1).title("Test Book").author("Author").isbn("123").build();
    when(bookRepository.save(ArgumentMatchers.any(Book.class))).thenReturn(savedBook);

    mockMvc
        .perform(
            post("/books")
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
				{
				    "title": "Test Book",
				    "author": "Author",
				    "isbn": "123",
				    "publicationYear": 2020
				}
				"""))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.id").value(1));
  }

  @Test
  void getBook_whenNotFound_returns404() throws Exception {
    when(bookRepository.findById(99)).thenReturn(Optional.empty());

    mockMvc.perform(get("/books/99")).andExpect(status().isNotFound());
  }
}
