package com.example.smiletrack.util;

import com.example.smiletrack.entity.Employee;
import com.example.smiletrack.repository.EmployeeRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@Scope(value = "request", proxyMode = ScopedProxyMode.TARGET_CLASS)
@Getter
@Setter
public class Rq {

    private final EmployeeRepository employeeRepository;
    private boolean isLoggedIn = false;
    private int loggedInEmployeeId = 0;
    private Employee loggedInEmployee = null;

    private HttpServletRequest req;
    private HttpServletResponse resp;
    private HttpSession session;

    public Rq(HttpServletRequest req, HttpServletResponse resp, EmployeeRepository employeeRepository) {
        this.req = req;
        this.resp = resp;
        this.session = req.getSession();

        if (session.getAttribute("loggedInEmployeeId") != null) {
            isLoggedIn = true;
            loggedInEmployeeId = (int) session.getAttribute("loggedInEmployeeId");
        }

        this.req.setAttribute("rq", this);
        this.employeeRepository = employeeRepository;
    }



    public void logout() {
        session.removeAttribute("loggedInEmployeeId");
    }

    public void login(Employee employee) {
        session.setAttribute("loggedInEmployeeId", employee.getEmployeeId());
    }

    public void initBeforeActionInterceptor() {
        System.err.println("initBeforeActionInterceptor 실행됨");
    }

    public Employee getLoggedInEmployee() {
        if (loggedInEmployee != null) return loggedInEmployee;

        HttpSession session = req.getSession(false);
        if (session == null) return null;

        Integer loggedInEmployeeId = (Integer) session.getAttribute("loggedInEmployeeId");
        if (loggedInEmployeeId == null) return null;

        loggedInEmployee = employeeRepository.findById(loggedInEmployeeId).orElseThrow();
        return loggedInEmployee;
    }

    public boolean isLoggedIn() {
        return getLoggedInEmployee() != null;
    }


    public String getCurrentUri() {
        String currentUri = req.getRequestURI();
        String queryString = req.getQueryString();

        System.out.println(currentUri);
        System.out.println(queryString);

        if (currentUri != null && queryString != null) {
            currentUri += "?" + queryString;
        }

        return currentUri;
    }

}
