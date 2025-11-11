package com.library.service;

import com.library.dto.BorrowRecordDto;
import com.library.entity.Book;
import com.library.entity.BorrowRecord;
import com.library.entity.User;
import com.library.exception.BadRequestException;
import com.library.exception.ResourceNotFoundException;
import com.library.repository.BookRepository;
import com.library.repository.BorrowRecordRepository;
import com.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowServiceImpl implements BorrowService {

    @Autowired
    private BorrowRecordRepository borrowRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    @Transactional
    public void borrowBook(String bookId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new ResourceNotFoundException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new BadRequestException("Book is not available for borrowing");
        }

        // Check if the user has already borrowed this book and not returned it
        borrowRepository.findByUserIdAndBookIdAndReturnDateIsNull(user.getId(), bookId)
            .ifPresent(record -> {
                throw new BadRequestException("You have already borrowed this book");
            });

        // Update book availability
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepository.save(book);

        // Create borrow record
        BorrowRecord record = new BorrowRecord(bookId, user.getId());
        borrowRepository.save(record);
    }

    @Override
    @Transactional
    public void returnBook(String recordId) {
        BorrowRecord record = borrowRepository.findById(recordId)
                .orElseThrow(() -> new ResourceNotFoundException("Borrow record not found"));

        if (record.getReturnDate() != null) {
            throw new BadRequestException("This book has already been returned");
        }

        // Update return date
        record.setReturnDate(LocalDateTime.now());
        borrowRepository.save(record);

        // Update book availability
        Book book = bookRepository.findById(record.getBookId())
                .orElseThrow(() -> new ResourceNotFoundException("Book not found")); // Should not happen
        
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);
    }

    @Override
    public List<BorrowRecordDto> getUserHistory(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        List<BorrowRecord> records = borrowRepository.findByUserIdOrderByBorrowDateDesc(user.getId());
        
        return records.stream().map(record -> {
            Book book = bookRepository.findById(record.getBookId())
                    .orElse(new Book(null, "Deleted Book", "N/A", "N/A", 0)); // Handle deleted books
            return new BorrowRecordDto(record, book.getTitle());
        }).collect(Collectors.toList());
    }

    @Override
    public List<BorrowRecordDto> getAllRecords() {
        List<BorrowRecord> records = borrowRepository.findAllByOrderByBorrowDateDesc();
        
        return records.stream().map(record -> {
            Book book = bookRepository.findById(record.getBookId())
                    .orElse(new Book(null, "Deleted Book", "N/A", "N/A", 0));
            User user = userRepository.findById(record.getUserId())
                    .orElse(new User(null, "Deleted User", "N/A", "N/A", User.Role.USER));
            return new BorrowRecordDto(record, book.getTitle(), user.getName());
        }).collect(Collectors.toList());
    }
}