package com.example.bookreview;

import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/books")
@Slf4j
@AllArgsConstructor
public class BookController {

  private BookRepository bookRepository;
  private ReviewRepository reviewRepository;

  @GetMapping("")
  public ResponseEntity<List<BookResponse>> getBooks() {
    var books = bookRepository.findAllWithAverageRating();

    // var books = bookRepository.findAll();
    // var response = books.stream()
    // .map(book -> BookResponse.builder().id(book.id).isbn(book.isbn).author(book.author)
    // .title(book.title)
    // .averageRating(
    // book.getReviews().stream().mapToInt(Review::getRating).average().orElse(0.0))
    // .build())
    // .toList();
    var response =
        books.stream()
            .map(
                b ->
                    BookResponse.builder()
                        .id(b.getBook().getId())
                        .title(b.getBook().getTitle())
                        .author(b.getBook().getAuthor())
                        .isbn(b.getBook().getIsbn())
                        .publicationYear(b.getBook().getPublicationYear())
                        .averageRating(b.getAverageRating())
                        .build())
            .toList();
    return ResponseEntity.ok(response);
  }

  @GetMapping("/{id}")
  public ResponseEntity<BookResponse> getBook(@PathVariable int id) {
    var book =
        bookRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));

    var reviews =
        book.getReviews().stream()
            .map(
                r ->
                    ReviewResponse.builder()
                        .rating(r.getRating())
                        .reviewAuthor(r.getReviewAuthor())
                        .id(r.getId())
                        .content(r.getContent())
                        .build())
            .toList();

    return ResponseEntity.ok(
        BookResponse.builder()
            .author(book.getAuthor())
            .id(book.getId())
            .title(book.getTitle())
            .isbn(book.getIsbn())
            .publicationYear(book.getPublicationYear())
            .reviews(reviews)
            .build());
  }

  @PostMapping("")
  public ResponseEntity<BookResponse> createBook(@Valid @RequestBody BookRequest request) {
    log.info("request: {}", request.toString());
    var book =
        Book.builder()
            .author(request.author())
            .title(request.title())
            .publicationYear(request.publicationYear())
            .isbn(request.isbn())
            .build();

    var savedBook = bookRepository.save(book);

    var location = URI.create("/books/" + savedBook.getId());
    return ResponseEntity.created(location)
        .body(BookResponse.builder().id(savedBook.getId()).build());
  }

  @PostMapping("/{id}/reviews")
  public ResponseEntity<ReviewResponse> createReview(
      @PathVariable int id, @Valid @RequestBody ReviewRequest request) {

    var book =
        bookRepository
            .findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));

    var review =
        Review.builder()
            .book(book)
            .content(request.content())
            .reviewAuthor(request.reviewAuthor())
            .rating(request.rating())
            .build();

    var savedReview = reviewRepository.save(review);

    return ResponseEntity.ok(
        ReviewResponse.builder()
            .reviewAuthor(savedReview.getReviewAuthor())
            .id(savedReview.getId())
            .content(savedReview.getContent())
            .rating(savedReview.getRating())
            .build());
  }
}
