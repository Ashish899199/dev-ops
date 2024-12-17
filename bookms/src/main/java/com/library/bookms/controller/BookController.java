package com.library.bookms.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.library.bookms.entity.Book;
import com.library.bookms.service.BookService;


@RestController
@RequestMapping(value="/api")
public class BookController {
	@Autowired 
	BookService bookService;
	
	@PostMapping("/add")
	public Book addBook(@RequestBody Book book){
		System.out.println("Add new book deatils"+ book);
		return bookService.addBook(book);
		//return null;
	}	
	
	@PostMapping("/update")
	public Book updateBook(@RequestBody Book book){
		System.out.println("Upadet  book deatils"+ book);
		return bookService.updateBook(book);
		//return null;
	}	
	
	@GetMapping("/getAll")
	public ResponseEntity<List<Book>> getAllBook(){
		System.out.println("Get All available book ");
		return ResponseEntity.ok(bookService.getAllBook());
	} 
	@GetMapping("/get/{bookid}")
	public ResponseEntity<Object> getAllBookById(@PathVariable Long bookid){
		System.out.println("Get  book by book id");
		Book book=null;
		try {
			book=bookService.getById(bookid);
		} catch (Exception e) {
			System.out.println("Data is not found given id"+e.getMessage());
			return ResponseEntity.ok(e.getMessage());
		}
		return ResponseEntity.ok(book);
	} 
	
	
	@PostMapping("/delete/{bookid}")
	public ResponseEntity<String> delete(@PathVariable Long bookid) {
		System.out.println("Delete book by book ID");
		return ResponseEntity.ok(bookService.deleteBook(bookid));
	}
	

}
