package com.library.service;

import com.library.dto.BorrowRecordDto;
import java.util.List;

public interface BorrowService {
    void borrowBook(String bookId, String userEmail);
    void returnBook(String recordId);
    List<BorrowRecordDto> getUserHistory(String userEmail);
    List<BorrowRecordDto> getAllRecords();
}