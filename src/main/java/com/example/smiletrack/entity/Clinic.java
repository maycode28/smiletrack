package com.example.smiletrack.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Entity
@Table(name = "CLINIC")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Clinic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "clinic_id")
    private Integer id;

    @Column(name = "clinic_name", nullable = false)
    private String clinicName;

    @Column(name = "clinic_alias")
    private String alias;

    @Column(name = "phone_number")
    private String phone;

    private String email;

    private String address;

    @Column(name = "shipping_instruction")
    private String shippingNotes;

    @Column(name = "assigned_account_manager_id")
    private Integer accountManagerId;
}
