package com.example.bookreview;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Book {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  Integer id;

  @Column(unique = false, insertable = true, updatable = true, nullable = false)
  String title;

  @Column(unique = false, insertable = true, updatable = true, nullable = false)
  String author;

  @Column(unique = true, insertable = true, updatable = true, nullable = false)
  String isbn;

  @Column(unique = false, insertable = true, updatable = true, nullable = false)
  int publicationYear;

  @OneToMany(
      mappedBy = "book",
      fetch = FetchType.LAZY,
      cascade = CascadeType.REMOVE,
      orphanRemoval = true)
  private List<Review> reviews;
}
