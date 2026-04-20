# SmileTrack

## 프로젝트 소개
SmileTrack은 치과 기공소 내부에서 케이스를 등록하고, 치과/의사 정보와 제품별 공정 정보를 조회하기 위한 실습용 프로젝트입니다.  
백엔드는 Spring Boot + JPA, 프론트엔드는 React(CRA)로 분리되어 있으며, 현재 레포 기준으로는 "로그인, 클리닉 등록, 케이스 등록에 필요한 기초 조회 API"까지 확인할 수 있습니다.

## 개발 배경 / 문제 정의
치과 기공소는 규모에 따라 운영 방식이 크게 달라질 수 있습니다.  
소규모 기공소는 케이스 수가 많지 않아 작업물이 어디 있는지 직접 확인하는 방식으로도 운영이 가능할 수 있고, 이런 환경에서는 케이스 추적이나 진행 상황 가시화에 대한 요구가 상대적으로 낮을 수 있습니다.

반면, 이 프로젝트는 비교적 큰 규모의 기공소에서 일하며 관찰했던 문제의식에서 출발했습니다. 케이스 수가 많고 공정이 복잡해질수록, 단순히 "등록"하는 것보다 "지금 어디에 있고, 왜 지연되며, 누가 맡고 있는지"를 빠르게 파악하는 일이 중요해집니다.

실제 업무에서 특히 크게 보였던 문제는 다음과 같았습니다.

- 중간 예외 상황이 놓쳐져서 갑자기 급해지는 케이스가 발생함
- 작업 흐름 중 다른 위치나 다른 담당자에게 이동한 케이스를 바로 찾지 못함
- CS 팀이나 매니저가 직접 케이스를 찾아다니는 상황이 반복됨
- 어디에서 병목이 생기는지 한눈에 보기 어려움
- 직원별 처리량이나 현재 업무 배분의 적절성을 파악하기 어려움
- 인건비 부담이 큰 환경에서 인력 관리와 작업 분배가 더 중요하게 작용함

이 프로젝트는 위 문제를 해결하는 전체 기능을 완성한 상태는 아니지만, 케이스 등록과 공정 흐름 데이터 구조를 먼저 만들고, 이후 추적/가시화 기능으로 확장할 수 있는 기반을 만드는 방향으로 진행했습니다.

## 주요 기능
현재 레포에서 실제 확인 가능한 기능입니다.

- 직원 로그인 / 로그아웃
- 로그인 세션 확인 API
- 클리닉 등록 API 및 입력 화면
- 의사 목록 조회 API
- 공정 목록 조회 API
- 제품 목록 조회 API
- 제품별 워크플로우 조회 API
- 케이스 등록 API 및 입력 화면
- 케이스 등록 시 공정별 예정 일정 계산 로직

## 기획한 기능 방향
아래 내용은 현재 전부 구현된 기능이 아니라, 프로젝트를 진행하며 필요하다고 판단한 기능 방향입니다.

### 매니저 관점
- 직원별로 현재 보유 중인 케이스를 확인하는 기능
- 전체 케이스를 프로세스별로 나누어 `on time / late / early` 상태를 보는 기능
- 병목 공정을 빠르게 파악할 수 있는 화면
- 프로세스별 실제 소요 시간 통계
- 월간 / 주간 / 연간 단위의 생산성 확인
- 휴가나 특수 인력 상황을 수동 반영할 수 있는 관리 기능
- 특정 프로세스나 담당 분야에서 이벤트가 발생했을 때 알림을 받는 기능
- 이슈가 발생한 케이스만 따로 모아보는 화면

### 직원 관점
- 모바일에서 케이스를 스캔하는 기능
- 케이스 이동이나 상태 변경 시 간단한 이벤트를 남기는 기능
- 케이스 상세 내용을 바로 확인하는 화면
- 내가 맡은 작업을 기한 순으로 보는 리스트
- 3D 데이터를 웹에서 바로 확인할 수 있는 임베드 기능

## 기술 스택
- Backend: Java 17, Spring Boot 4.0.2, Spring Web, Spring Data JPA
- Frontend: React, React Router, Axios, Tailwind CSS
- Database: MariaDB
- Build: Gradle, npm

## 프로젝트 구조
```text
smiletrack
├── build.gradle
├── src/main/java/com/example/smiletrack
│   ├── controller        # 로그인, 케이스, 클리닉, 의사, 제품, 공정 API
│   ├── service           # 케이스 생성 및 조회용 서비스 로직
│   ├── repository        # JPA Repository
│   ├── entity            # DB 테이블 매핑 엔티티
│   ├── dto               # 화면/요청 응답 DTO
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

## 실행 방법
실행은 `DB -> 백엔드 -> 프론트엔드` 순서로 진행합니다.

### 1. DB 준비
MariaDB에서 `src/main/resources/db.sql`을 실행합니다.

- DB 이름: `smileTrack`
- `db.sql`에 `DROP DATABASE IF EXISTS smileTrack;`, `CREATE DATABASE smileTrack;`가 포함되어 있으므로 기존 동일 DB는 삭제될 수 있습니다.
- JPA 설정은 `ddl-auto: validate`이므로, 애플리케이션이 테이블을 자동 생성하지 않습니다.

### 2. 백엔드 실행
기본 설정:

- 서버 포트: `8080`
- DB URL 기본값: `jdbc:mariadb://127.0.0.1:3306/smileTrack?useUnicode=true&characterEncoding=utf8&autoReconnect=true&serverTimezone=Asia/Seoul`
- JPA: `ddl-auto=validate`, `show-sql=true`

실행 전 환경변수를 맞춰야 합니다.

```bash
export DB_URL='jdbc:mariadb://127.0.0.1:3306/smileTrack?useUnicode=true&characterEncoding=utf8&autoReconnect=true&serverTimezone=Asia/Seoul'
export DB_USERNAME='root'
export DB_PASSWORD='여기에_본인_MariaDB_비밀번호'
```

이후 프로젝트 루트에서 실행합니다.

```bash
./gradlew bootRun
```

### 3. 프론트엔드 실행
프론트엔드 작업 경로는 `src/main/frontend`입니다.

```bash
cd src/main/frontend
npm install
npm start
```

- 프론트 개발 서버 포트: `3000`
- `package.json`의 proxy: `http://localhost:8080`

## 주요 화면 또는 주요 경로
- `/` : 로그인 화면
- `/dashboard` : 대시보드 화면 틀만 존재
- `/doctors/addClinic` : 클리닉 등록 화면
- `/cases/addCase` : 케이스 등록 화면
- `/cases/list` : 케이스 목록 화면

## 주요 API 또는 기능 흐름
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

### 케이스 등록 흐름
1. 프론트에서 의사 / 제품 / 공정 목록을 조회합니다.
2. 사용자가 환자명, 치아 번호, 제품, 납기일, 공정 순서를 입력합니다.
3. `POST /api/cases`로 케이스를 저장합니다.
4. 백엔드에서 제품/의사 엔티티를 조회하고 `CASE`, `CASE_PROCESS`, `CASE_NOTE`를 저장합니다.
5. 공정별 소요 시간을 기준으로 예정 시작일/종료일을 계산합니다.

## 현재 구현 범위
### 구현 완료
- MariaDB 스키마와 예제 데이터(`db.sql`)
- 직원 로그인/로그아웃과 세션 확인 API
- 의사/공정/제품/제품 워크플로우 조회 API
- 클리닉 등록 API
- 케이스 등록 API
- React 기반 로그인, 클리닉 등록, 케이스 등록 화면

### 미구현 또는 미완성
- 케이스 목록 화면은 현재 서버 데이터가 아니라 프론트 내부 목업 데이터로 표시됩니다.
- 대시보드 화면은 헤더만 있고 실제 지표/목록 기능이 없습니다.
- 권한 분리, 예외 처리, 입력 검증이 충분하지 않습니다.
- 테스트 코드가 사실상 작성되어 있지 않습니다.
- 프론트 헤더의 일부 메뉴(`Assignment`, `Staff`, `Doctors`)는 연결된 화면이 없습니다.

## 아쉬운 점 / 한계
- 로그인 비밀번호가 현재 평문 저장 및 평문 비교 방식입니다. 제출 시점 기준으로 BCrypt 등 암호화가 적용되어 있지 않습니다.
- `db.sql`의 예제 계정도 데모용 평문 비밀번호를 사용합니다.
- 케이스 등록 서비스에서 메모 작성자(`employee_id`)를 로그인 사용자 대신 고정 ID 1로 저장합니다.
- 일부 프론트 화면은 실제 API 연동보다 UI 시안 성격이 강합니다.
- 프론트 `node_modules`가 레포에 포함되어 있어 제출 레포가 무겁습니다.

## 향후 개선 계획
- 비밀번호 BCrypt 적용 및 회원/권한 구조 정리
- 케이스 목록/상세/대시보드를 실제 DB 조회 기반으로 구현
- 예외 처리 및 검증 메시지 표준화
- 테스트 코드 작성
- 프론트/백엔드 API 응답 형식 통일
- 케이스 위치 추적, 이벤트 기록, 병목 가시화 기능 추가
- 매니저용 통계/알림 화면과 직원용 작업 목록 화면 구현

## 제출용 확인 메모
- 루트 기준 설명 문서는 이 `README.md`를 우선 확인하면 됩니다.
- 프론트의 기본 CRA 문서는 제출 혼동을 막기 위해 간단 안내 문서로 정리했습니다.
- 샘플 로그인 계정은 `db.sql`에 들어 있는 데모 데이터 기준으로 확인할 수 있습니다. 예: `alice.kim / alice.kim`
