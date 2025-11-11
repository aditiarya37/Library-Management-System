package com.library.service;

import com.library.entity.Book;
import java.util.List;

public interface BookService {
    List<Book> findAll();
    Book findById(String id);
    Book save(Book book);
    Book update(String id, Book bookDetails);
    void delete(String id);
}