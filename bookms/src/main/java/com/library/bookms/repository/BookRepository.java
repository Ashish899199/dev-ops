package com.library.bookms.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library.bookms.entity.Book;

public interface BookRepository extends JpaRepository<Book,Long> {

}
