# 기본 구성

NestJS App으로 구성되어 있습니다. 데이터베이스는 Mongo를 사용하였습니다.

# 시작하기

## 설치

```bash
$ yarn
```

## 데이터베이스 실행 및 종료

```bash
# 데이터 베이스 실행
$ yarn docker:up

# 데이터 베이스 종료
$ yarn docker:down
```

## 샘플 데이터 입력

```bash
$ yarn db:insert
```

## 앱 실행

```bash
$ yarn start:dev
```

## 테스트

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

# URL 및 Path 정보

- Swagger [http://localhost:3000/api](http://localhost:3000/api): API 명세를 확인하고 테스트할 수 있습니다.
- Mongo Express  (ID/PW: root/example) [http://localhost:8081](http://localhost:8081): Mongo DB의 데이터를 확인하고 관리할 수 있습니다. Swagger에서 테스트시 id값을 입력해야되는데 Mongo 특성상 id가 랜덤으로 생성되어 확인이 필요합니다.
- DB Schema [prisma/schema.prisma](./prisma/schema.prisma): Prisma로 스키마를 관리합니다.

# 샘플 데이터 설명

## 관리자

- admin1@test.dev: school1
- admin2@test.dev: school2
- admin3@test.dev: 학교X

## 유저

- user1@test.dev: school1, school2 구독
- user2@test.dev: school2 구독

## 뉴스

- news1: school1, 구독 전 과거 뉴스, 조회 X
- news2: school1, 조회 O
- news3: school1, 조회 O
- news4: school2, 구독 전 과거 뉴스, 조회 X
- news5: school2, 조회 O
- news6: school2, 삭제 뉴스, 조회 X