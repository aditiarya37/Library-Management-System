package com.library.service;

import com.library.entity.Book;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookServiceImpl implements BookService {

    @Autowired
    private BookRepository bookRepository;

    @Override
    public List<Book> findAll() {
        return bookRepository.findAll();
    }

    @Override
    public Book findById(String id) {
        return bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found with id: " + id));
    }

    @Override
    public Book save(Book book) {
        // When creating a new book, ID is null.
        // If an ID is passed, it acts as an update.
        return bookRepository.save(book);
    }

    @Override
    public Book update(String id, Book bookDetails) {
        Book book = findById(id); // Check if book exists
        
        // Update fields
        book.setTitle(bookDetails.getTitle());
        book.setAuthor(bookDetails.getAuthor());
        book.setIsbn(bookDetails.getIsbn());
        book.setAvailableCopies(bookDetails.getAvailableCopies());
        
        return bookRepository.save(book);
    }

    @Override
    public void delete(String id) {
        Book book = findById(id); // Check if book exists
        bookRepository.delete(book);
    }
}