package com.eventis.dto;

import java.util.List;

public class SeatLockRequest {

    private List<String> seatNumbers;

    public SeatLockRequest() {
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }
}