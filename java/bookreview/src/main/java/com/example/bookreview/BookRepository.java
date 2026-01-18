package com.example.bookreview;

import java.util.List;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface BookRepository extends JpaRepository<Book, Integer> {
  public interface BookWithAverageRating {
    Book getBook();

    Double getAverageRating();
  }

  @Query(
      "SELECT b AS book, COALESCE(AVG(r.rating), 0.0) AS averageRating FROM Book b LEFT JOIN b.reviews r GROUP BY b")
  List<BookWithAverageRating> findAllWithAverageRating();

  @EntityGraph(attributePaths = {"reviews"})
  @Query("SELECT b FROM Book b")
  List<Book> findAllWithReviews();

  boolean existsByIsbn(String isbn);

  boolean existsByAuthor(String author);
}
