package com.library.bookms.service;

import java.util.List;

import com.library.bookms.entity.Book;

public interface BookService {
	public List<Book> getAllBook();

	public Book getById(Long id);

	public Book addBook(Book book);

	public Book updateBook(Book book);

	public String deleteBook(Long id);

}
