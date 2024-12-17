package com.library.bookms.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Entity
@Table(name="book_info")
public class Book {
	@Id
	@GeneratedValue
	 private Long id;
	
	 private String isbn; 
	 private String title; 
	 private String  publishedDate; 
	 private Integer totalCopies; 
	 private Integer issuedCopies; 
	 private String  author;
	
	
	 
	 
}
