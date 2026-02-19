package com.example.smiletrack.vo;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Clinic {

    private Long id;

    private String clinicName;      // 클리닉 이름 (필수)
    private String alias;           // 별칭
    private String phone;           // 전화번호
    private String email;           // 이메일
    private String address;         // 주소
    private String shippingNotes;   // 배송 특이사항
    private Long accountManagerId;  // 담당자
}
