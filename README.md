# Blogger Platform

REST API блог-платформы с системой аутентификации, управлением контентом и quiz-игрой. Построен на NestJS с использованием паттерна CQRS, TypeORM и PostgreSQL.

## Технологический стек

- **Runtime:** Node.js, TypeScript
- **Framework:** NestJS 11
- **ORM:** TypeORM 0.3
- **База данных:** PostgreSQL
- **Аутентификация:** JWT (access + refresh в http-only cookie), Passport (Local, JWT), HTTP Basic Auth для SA
- **Архитектура:** CQRS (`@nestjs/cqrs`), модульная структура
- **Документация API:** Swagger (`/swagger`)
- **Рассылка:** Nodemailer + `@nestjs-modules/mailer` (SMTP)
- **Тестирование:** Jest, Supertest (e2e)

## Структура проекта

```
src/
├── core/                              # Общие DTO, фильтры исключений
│   ├── dto/                           # Базовые классы пагинации и query-параметров
│   └── exceptions/                    # Domain-исключения и HTTP-фильтры
├── setup/                             # Конфигурация приложения
│   ├── app.setup.ts                   # Pipes, глобальный префикс, Swagger
│   └── swagger.setup.ts              
├── modules/
│   ├── user-accounts/                 # Пользователи, сессии, аутентификация
│   │   ├── api/                       # Контроллеры (auth, sa.users, security-devices)
│   │   ├── application/               # CQRS use-cases и queries
│   │   ├── domain/                    # Сущности: User, Session, EmailConfirmation
│   │   ├── guards/                    # JWT, Local, Basic guards и стратегии
│   │   └── infrastructure/            # Репозитории
│   ├── blogers-platform/              # Блоги, посты, комментарии, лайки
│   │   ├── api/                       # Контроллеры (blogs, posts, comments, sa.blogs)
│   │   ├── application/               # CQRS use-cases
│   │   ├── domain/                    # Сущности: Blog, Post, Comment, PostReaction, CommentReaction
│   │   └── infrastructure/            # Репозитории
│   ├── quiz-game/                     # Quiz-игра (вопросы, игры)
│   │   ├── api/                       # SA контроллер для управления вопросами
│   │   ├── domain/                    # Сущности: Question, Game
│   │   └── infrastructure/            # Репозитории
│   ├── notifications/                 # Email-сервис для отправки писем
│   └── testing/                       # Эндпоинт для очистки БД в тестах
└── main.ts
```

## Модули и функциональность

### User Accounts
Регистрация, аутентификация (login/logout), подтверждение email, восстановление пароля, refresh-токены, управление устройствами (сессиями). SA-эндпоинты для администрирования пользователей.

### Blogers Platform
Полный CRUD для блогов, постов и комментариев. Система лайков/дизлайков для постов и комментариев. Публичные эндпоинты с опциональной JWT-авторизацией для персонализации выдачи. SA-эндпоинты для управления контентом.

### Quiz Game
Управление вопросами для quiz-игры (SA). Сущность `Game` подготовлена для реализации игрового процесса.

### Notifications
Отправка email-уведомлений (подтверждение регистрации, восстановление пароля) через SMTP.

## API эндпоинты

Все маршруты имеют префикс `/api`.

| Группа | Метод | Эндпоинт | Авторизация |
|--------|-------|----------|-------------|
| **Auth** | POST | `auth/login` | Local (login + password) |
| | POST | `auth/registration` | — |
| | POST | `auth/registration-confirmation` | — |
| | POST | `auth/registration-email-resending` | — |
| | POST | `auth/password-recovery` | — |
| | POST | `auth/new-password` | — |
| | POST | `auth/refresh-token` | Cookie |
| | POST | `auth/logout` | Cookie |
| | GET | `auth/me` | Bearer JWT |
| **SA Users** | GET/POST/DELETE | `sa/users` | Basic Auth |
| **Security** | GET/DELETE | `security/devices` | Cookie |
| **Blogs** | GET | `blogs`, `blogs/:id`, `blogs/:id/posts` | Optional JWT |
| **SA Blogs** | CRUD | `sa/blogs`, `sa/blogs/:id/posts` | Basic Auth |
| **Posts** | GET | `posts`, `posts/:id` | Optional JWT |
| | POST | `posts/:postId/comments` | Bearer JWT |
| | PUT | `posts/:postId/like-status` | Bearer JWT |
| **Comments** | GET/PUT/DELETE | `comments/:id` | Bearer JWT |
| **SA Quiz** | GET | `sa/quiz/questions` | Basic Auth |
| **Testing** | DELETE | `test/all-data` | — |

## Сущности БД

| Сущность | Описание |
|----------|----------|
| `User` | Логин, email, хэш пароля, код восстановления, soft delete |
| `EmailConfirmation` | Код подтверждения, срок действия, статус |
| `Session` | Устройство, IP, IAT/EXP refresh-токена |
| `Blog` | Название, описание, URL сайта |
| `Post` | Заголовок, описание, контент, привязка к блогу |
| `Comment` | Контент, привязка к посту и пользователю |
| `PostReaction` | Лайк/дизлайк поста пользователем |
| `CommentReaction` | Лайк/дизлайк комментария пользователем |
| `Question` | Тело вопроса, правильные ответы (JSONB), статус публикации |
| `Game` | Игровая сессия (в разработке) |

## Установка и запуск

### Переменные окружения

Создайте файл `.env` в корне проекта:

```env
PORT=3000
PG_URL=postgres://user:password@localhost:5432/blogger_platform
SECRET_KEY=your-jwt-secret
ACCESS_TOKEN_EXPIRE_IN=5m
EMAIL=your-email@mail.ru
PASS=your-email-password
```

### Запуск

```bash
# Установка зависимостей
npm install

# Применение миграций
npm run migration:run

# Запуск в dev-режиме
npm run start:dev

# Запуск в production
npm run build && npm run start:prod
```

### Миграции

```bash
# Генерация миграции на основе изменений в сущностях
npm run migration:generate -- migrations/MigrationName

# Создание пустой миграции
npm run migration:create -- migrations/MigrationName

# Применение миграций
npm run migration:run

# Откат последней миграции
npm run migration:revert
```

### Тесты

```bash
# Unit-тесты
npm run test

# E2E-тесты
npm run test:e2e
```

## Swagger

После запуска приложения документация API доступна по адресу:

```
http://localhost:3000/swagger
```
