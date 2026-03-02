package com.example.smiletrack.repository;


import com.example.smiletrack.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    @Query("""
select d from Doctor d
left join fetch d.clinic
""")
    List<Doctor> findAllWithClinic();
}