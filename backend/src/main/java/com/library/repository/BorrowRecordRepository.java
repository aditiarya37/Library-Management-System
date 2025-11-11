package com.library.repository;

import com.library.entity.BorrowRecord;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BorrowRecordRepository extends MongoRepository<BorrowRecord, String> {
    
    // Find all records for a specific user, ordered by borrow date
    List<BorrowRecord> findByUserIdOrderByBorrowDateDesc(String userId);
    
    // Find all records, ordered by borrow date
    List<BorrowRecord> findAllByOrderByBorrowDateDesc();
    
    // Check if a user has an active (not returned) loan for a specific book
    Optional<BorrowRecord> findByUserIdAndBookIdAndReturnDateIsNull(String userId, String bookId);
}