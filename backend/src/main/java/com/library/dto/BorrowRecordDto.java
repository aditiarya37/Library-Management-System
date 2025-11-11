package com.library.dto;

import com.library.entity.BorrowRecord;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowRecordDto {
    private String id;
    private String bookTitle;
    private String userName; // Null when fetched by a user for their own history
    private LocalDateTime borrowDate;
    private LocalDateTime returnDate;

    // Constructor for user history (omits userName)
    public BorrowRecordDto(BorrowRecord record, String bookTitle) {
        this.id = record.getId();
        this.bookTitle = bookTitle;
        this.borrowDate = record.getBorrowDate();
        this.returnDate = record.getReturnDate();
    }

    // Constructor for admin dashboard (includes userName)
    public BorrowRecordDto(BorrowRecord record, String bookTitle, String userName) {
        this(record, bookTitle);
        this.userName = userName;
    }
}