package com.example.bookreview;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.boot.jpa.test.autoconfigure.TestEntityManager;

@DataJpaTest
class BookRepositoryTest {

  @Autowired private TestEntityManager entityManager;

  @Autowired private BookRepository bookRepository;

  @Test
  void findAllWithAverageRating_returnsAverageForBookWithReviews() {
    // Given
    var book =
        Book.builder()
            .title("Test Book")
            .author("Author")
            .isbn("123")
            .publicationYear(2020)
            .build();
    entityManager.persist(book);

    var review1 = Review.builder().book(book).rating(4).reviewAuthor("Alice").build();
    var review2 = Review.builder().book(book).rating(2).reviewAuthor("Bob").build();
    entityManager.persist(review1);
    entityManager.persist(review2);

    entityManager.flush();

    // When
    var results = bookRepository.findAllWithAverageRating();

    // Then
    assertThat(results).hasSize(1);
    assertThat(results.get(0).getBook().getTitle()).isEqualTo("Test Book");
    assertThat(results.get(0).getAverageRating()).isEqualTo(3.0);
  }

  @Test
  void findAllWithAverageRating_returnsZeroForBookWithoutReviews() {
    // Given
    var book =
        Book.builder()
            .title("No Reviews")
            .author("Author")
            .isbn("456")
            .publicationYear(2021)
            .build();
    entityManager.persist(book);
    entityManager.flush();

    // When
    var results = bookRepository.findAllWithAverageRating();

    // Then
    assertThat(results).hasSize(1);
    assertThat(results.get(0).getAverageRating()).isEqualTo(0.0);
  }

  @Test
  void findAllWithReviews_eagerLoadsReviews() {
    // Given
    var book =
        Book.builder()
            .title("With Reviews")
            .author("Author")
            .isbn("789")
            .publicationYear(2022)
            .build();
    entityManager.persist(book);

    var review = Review.builder().book(book).rating(5).reviewAuthor("Carol").build();
    entityManager.persist(review);
    entityManager.flush();
    entityManager.clear(); // Clear persistence context to force a fresh fetch

    // When
    var results = bookRepository.findAllWithReviews();

    // Then
    assertThat(results).hasSize(1);
    assertThat(results.get(0).getReviews()).hasSize(1);
    assertThat(results.get(0).getReviews().get(0).getRating()).isEqualTo(5);
  }
}
