package com.library.bookms.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library.bookms.entity.Book;
import com.library.bookms.repository.BookRepository;
@Service
public class BookServiceImpl implements BookService{
@Autowired 
BookRepository repository;
	@Override
	public List<Book> getAllBook() {
		// TODO Auto-generated method stub
		return repository.findAll();
	}

	@Override
	public Book getById(Long id) {
		Book book=repository.getReferenceById(id);
		if(book!=null && book.getIsbn()!=null) {
			return book;
		}else {
			return new Book();
		}
		
		 
	}

	@Override
	public Book addBook(Book book) {
		// TODO Auto-generated method stub
		return repository.save(book);
	}

	@Override
	public Book updateBook(Book book) {
		Book updateBook=repository.getReferenceById(book.getId());
		updateBook=book;
		return repository.save(updateBook);
	}

	@Override
	public String deleteBook(Long id) {
		// TODO Auto-generated method stub
		 repository.deleteById(id); 
		 return null;
	}

}