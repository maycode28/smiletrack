package com.example.smiletrack.controller;

import com.example.smiletrack.entity.Employee;
import com.example.smiletrack.service.EmployeeService;
import com.example.smiletrack.util.Rq;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/employee")
public class EmployeeController {
    private final Rq rq;
    private final EmployeeService employeeService;

    public EmployeeController(Rq rq, EmployeeService employeeService) {
        this.rq = rq;
        this.employeeService = employeeService;
    }

    @PostMapping("/doLogin")
    public ResponseEntity<?> doLogin(@RequestBody Map<String, String> body) {
        String loginId = body.get("loginId");
        String loginPw = body.get("loginPw");

        if (loginId == null || loginId.isBlank())
            return ResponseEntity.badRequest().body(Map.of("resultCode", "F-1", "msg", "loginId 입력해"));
        if (loginPw == null || loginPw.isBlank())
            return ResponseEntity.badRequest().body(Map.of("resultCode", "F-2", "msg", "loginPw 입력해"));

        Employee employee = employeeService.getEmployeeByLoginId(loginId);
        if (employee == null)
            return ResponseEntity.badRequest().body(Map.of("resultCode", "F-3", "msg", loginId + "는 없는 아이디"));
        if (!employee.getLoginPw().equals(loginPw))
            return ResponseEntity.badRequest().body(Map.of("resultCode", "F-4", "msg", "비밀번호 틀림"));

        rq.login(employee);
        return ResponseEntity.ok(Map.of("resultCode", "S-1", "msg", "Welcome, " + employee.getEmployeeName()));
    }

    @PostMapping("/doLogout")
    public ResponseEntity<?> doLogout() {
        rq.logout();
        return ResponseEntity.ok(Map.of("resultCode", "S-1", "msg", "로그아웃 성공"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMe() {
        if (!rq.isLoggedIn())
            return ResponseEntity.status(401).body(Map.of("resultCode", "F-1", "msg", "로그인 필요"));

        Employee employee = rq.getLoggedInEmployee();
        return ResponseEntity.ok(Map.of(
                "resultCode", "S-1",
                "id", employee.getEmployeeId(),
                "name", employee.getEmployeeName(),
                "role", employee.getRole() != null ? employee.getRole() : ""
        ));
    }

}
