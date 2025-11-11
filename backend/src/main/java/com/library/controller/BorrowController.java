package com.library.controller;

import com.library.dto.BorrowRecordDto;
import com.library.service.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/borrow")
@CrossOrigin(origins = "http://localhost:3000") // Allow frontend to connect
public class BorrowController {

    @Autowired
    private BorrowService borrowService;

    @PostMapping("/{bookId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<String> borrowBook(@PathVariable String bookId) {
        String userEmail = getAuthenticatedUserEmail();
        borrowService.borrowBook(bookId, userEmail);
        return ResponseEntity.ok("Book borrowed successfully");
    }

    @PostMapping("/return/{recordId}")
    @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
    public ResponseEntity<String> returnBook(@PathVariable String recordId) {
        borrowService.returnBook(recordId);
        return ResponseEntity.ok("Book returned successfully");
    }

    @GetMapping("/history")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<BorrowRecordDto>> getUserHistory() {
        String userEmail = getAuthenticatedUserEmail();
        return ResponseEntity.ok(borrowService.getUserHistory(userEmail));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<BorrowRecordDto>> getAllRecords() {
        return ResponseEntity.ok(borrowService.getAllRecords());
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}