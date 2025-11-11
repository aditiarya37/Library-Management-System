package com.library.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "borrow_records")
public class BorrowRecord {
    
    @Id
    private String id;
    
    private String bookId;
    private String userId;
    
    private LocalDateTime borrowDate;
    private LocalDateTime returnDate;

    public BorrowRecord(String bookId, String userId) {
        this.bookId = bookId;
        this.userId = userId;
        this.borrowDate = LocalDateTime.now();
        this.returnDate = null; // Mark as not returned
    }
}