# SmileTrack

치과 기공소의 **케이스 등록, 기준 데이터 조회, 공정 흐름 관리**를 위한  
**Spring Boot + React 기반 웹 애플리케이션**입니다.

이 프로젝트는 치과 기공소 업무에서 발생하는 케이스를 단순 등록하는 수준을 넘어,  
향후 **공정 추적, 지연 확인, 병목 파악, 담당자별 업무 가시화**로 확장할 수 있는 구조를 만드는 것을 목표로 개발한 **MVP(초기 구현 버전)** 입니다.

---

## 1. 프로젝트 개요

치과 기공소에서는 하나의 케이스가 여러 공정을 거치며 이동하고,  
담당자, 제품, 의사, 납기일 등 다양한 정보가 함께 관리되어야 합니다.

규모가 커질수록 다음과 같은 문제가 자주 발생합니다.

- 현재 케이스가 어느 공정에 있는지 바로 파악하기 어렵다.
- 예상보다 지연된 케이스를 뒤늦게 인지하게 된다.
- 담당자 변경이나 이동 이력이 체계적으로 남지 않는다.
- CS팀이나 매니저가 직접 케이스를 추적해야 하는 상황이 반복된다.
- 공정별 병목이나 인력 배분 상태를 한눈에 파악하기 어렵다.

SmileTrack은 이러한 문제를 해결하기 위한 기반 시스템으로,  
현재는 **로그인, 클리닉 등록, 케이스 등록, 기준 데이터 조회**를 중심으로 구현되어 있습니다.

---

## 2. 주요 기능

현재 레포 기준으로 실제 확인 가능한 기능입니다.

### 구현된 기능
- 직원 로그인 / 로그아웃
- 로그인 세션 확인 API
- 클리닉 등록 API 및 입력 화면
- 의사 목록 조회 API
- 공정 목록 조회 API
- 제품 목록 조회 API
- 제품별 워크플로우 조회 API
- 케이스 등록 API 및 입력 화면
- 케이스 등록 시 공정별 예정 일정 계산 로직

### 향후 확장 목표
- 케이스별 진행 상태 추적
- 공정별 병목 시각화
- 담당자별 현재 작업량 확인
- 지연 / 이슈 케이스 모아보기
- 모바일 기반 상태 변경 및 이벤트 기록
- 매니저용 통계 및 알림 기능

---

## 3. 기술 스택

| 구분 | 기술 |
|---|---|
| Backend | Java 17, Spring Boot 4.0.2, Spring Web, Spring Data JPA |
| Frontend | React, React Router, Axios, Tailwind CSS |
| Database | MariaDB |
| Build Tool | Gradle, npm |

---

## 4. 프로젝트 구조

```text
smiletrack
├── build.gradle
├── src/main/java/com/example/smiletrack
│   ├── controller        # 로그인, 케이스, 클리닉, 의사, 제품, 공정 API
│   ├── service           # 케이스 생성 및 조회용 서비스 로직
│   ├── repository        # JPA Repository
│   ├── entity            # DB 테이블 매핑 엔티티
│   ├── dto               # 요청/응답 DTO
│   ├── interceptor       # 요청 전 Rq 초기화
│   └── util              # 세션 기반 로그인 보조 객체
├── src/main/resources
│   ├── application.yaml  # 서버/DB 설정
│   └── db.sql            # MariaDB 스키마 + 테스트 데이터
└── src/main/frontend
    ├── package.json
    ├── public
    └── src
        ├── components/Login.jsx
        ├── components/AddClinic.jsx
        ├── components/cases/AddCase.jsx
        ├── components/cases/CaseList.jsx
        └── components/dashboard/ManagerDashboard.jsx
```

---

## 5. 실행 방법

실행은 **DB → 백엔드 → 프론트엔드** 순서로 진행합니다.

### 5-1. DB 준비
MariaDB에서 `src/main/resources/db.sql`을 실행합니다.

- DB 이름: `smileTrack`
- `db.sql`에는 `DROP DATABASE IF EXISTS smileTrack;`가 포함되어 있으므로 기존 동일 이름 DB가 있다면 삭제될 수 있습니다.
- JPA 설정은 `ddl-auto: validate` 이므로 애플리케이션이 테이블을 자동 생성하지 않습니다.

### 5-2. 백엔드 실행

실행 전 환경변수를 설정합니다.

```bash
export DB_URL='jdbc:mariadb://127.0.0.1:3306/smileTrack?useUnicode=true&characterEncoding=utf8&autoReconnect=true&serverTimezone=Asia/Seoul'
export DB_USERNAME='root'
export DB_PASSWORD='여기에_본인_MariaDB_비밀번호'
```

프로젝트 루트에서 실행합니다.

```bash
./gradlew bootRun
```

기본 실행 정보:
- 서버 포트: `8080`
- JPA: `ddl-auto=validate`
- SQL 출력: `show-sql=true`

### 5-3. 프론트엔드 실행

프론트엔드 경로:

```bash
cd src/main/frontend
npm install
npm start
```

기본 실행 정보:
- 프론트 개발 서버 포트: `3000`
- proxy: `http://localhost:8080`

---

## 6. 주요 화면 경로

- `/` : 로그인 화면
- `/dashboard` : 대시보드 화면
- `/doctors/addClinic` : 클리닉 등록 화면
- `/cases/addCase` : 케이스 등록 화면
- `/cases/list` : 케이스 목록 화면

---

## 7. 주요 API

### 로그인
- `POST /api/employee/doLogin`
- `POST /api/employee/doLogout`
- `GET /api/employee/me`

로그인 성공 시 세션에 `loggedInEmployeeId`를 저장합니다.

### 기준 데이터 조회
- `GET /api/doctors`
- `GET /api/processes`
- `GET /api/products`
- `GET /api/products/{productId}/workflow`

### 클리닉 등록
- `POST /api/clinic`

### 케이스 등록
- `POST /api/cases`

---

## 8. 케이스 등록 흐름

1. 프론트엔드에서 의사 / 제품 / 공정 목록을 조회합니다.
2. 사용자가 환자명, 치아 번호, 제품, 납기일, 공정 순서를 입력합니다.
   현재 납기일은 날짜와 시간을 함께 입력합니다.
3. `POST /api/cases`로 케이스를 저장합니다.
4. 백엔드에서 제품/의사 엔티티를 조회하고 `CASE`, `CASE_PROCESS`, `CASE_NOTE`를 저장합니다.
5. 공정별 소요 시간을 기준으로 예정 시작일과 예정 종료일을 계산합니다.

---

## 9. 현재 구현 상태

### 구현 완료
- MariaDB 스키마 및 예제 데이터 구성 (`db.sql`)
- 직원 로그인/로그아웃 및 세션 확인 API
- 의사/공정/제품/제품 워크플로우 조회 API
- 클리닉 등록 API
- 케이스 등록 API
- React 기반 로그인 / 클리닉 등록 / 케이스 등록 화면

### 미구현 또는 미완성
- 케이스 목록 화면은 현재 실제 DB 조회가 아닌 프론트 내부 목업 데이터 기반입니다.
- 대시보드는 화면 틀만 있으며 실제 통계/업무 지표 기능은 구현되지 않았습니다.
- 권한 분리, 예외 처리, 입력 검증이 충분하지 않습니다.
- 테스트 코드가 거의 작성되어 있지 않습니다.
- 일부 메뉴(`Assignment`, `Staff`, `Doctors`)는 연결된 화면이 없습니다.

---

## 10. 아쉬운 점 / 한계

- 로그인 비밀번호가 현재 **평문 저장 및 평문 비교 방식**입니다.
- `db.sql`의 예제 계정도 데모용 평문 비밀번호를 사용합니다.
- 일부 프론트 화면은 실제 API 연동보다 UI 시안 성격이 더 강합니다.
- 케이스의 납기일은 시간까지 저장하지만, 아직 이를 기준으로 한 지연 판정이나 대시보드 분석 기능은 구현되지 않았습니다.

---

## 11. 향후 개선 계획

- 비밀번호 BCrypt 적용 및 인증 구조 개선
- 케이스 목록 / 상세 / 대시보드의 실제 DB 기반 구현
- 예외 처리 및 입력 검증 강화
- 테스트 코드 작성
- 프론트/백엔드 응답 형식 정리
- 케이스 위치 추적 및 이벤트 기록 기능 추가
- 병목 공정 가시화 및 매니저용 통계 기능 추가
- 직원별 작업 목록 / 알림 기능 추가

---

## 12. 프로젝트 한줄 요약

**SmileTrack은 치과 기공소의 케이스와 공정 흐름을 체계적으로 관리하기 위해 설계한 Spring Boot + React 기반 업무 관리 시스템입니다.**
