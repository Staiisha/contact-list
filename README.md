# Приложение управления контактами

Полнофункциональное веб-приложение для управления контактами с возможностью добавления, редактирования, удаления и просмотра контактов.

## Стек

### Frontend
- **React 18** с TypeScript
- **Vite** - сборщик проекта
- **SCSS** - стилизация

### Backend
- **Node.js** с Express.js
- **PostgreSQL** - база данных
- **CORS** - поддержка кросс-доменных запросов

## Установка и настройка

### Предварительные требования

- Node.js (версия 16 или выше)
- PostgreSQL (версия 12 или выше)
- npm или yarn

### 1. Клонирование репозитория

\`\`\`bash
git clone <repository-url>
cd contact-app
\`\`\`

### 2. Настройка базы данных

Создайте базу данных PostgreSQL:

\`\`\`sql
-- Подключитесь к PostgreSQL
psql -U postgres

-- Создайте базу данных
CREATE DATABASE mydatabase;

-- Подключитесь к созданной базе данных
\c mydatabase;

-- Создайте таблицу контактов
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавьте тестовые данные (опционально)
INSERT INTO contacts (name, phone) VALUES 
    ('имя', 'номер телефона'),
\`\`\`

### 3. Настройка сервера

Отредактируйте файл `server.js` и укажите ваши данные для подключения к PostgreSQL:

\`\`\`javascript
const pool = new Pool({
  user: "postgres",        // ваш пользователь PostgreSQL
  host: "localhost",       // хост базы данных
  database: "mydatabase",  // название вашей базы данных
  password: "your_password", // ваш пароль
  port: 5432,             // порт PostgreSQL
})
\`\`\`

### 4. Установка зависимостей

#### Серверные зависимости:
\`\`\`bash
npm init -y
npm install express pg cors
\`\`\`

#### Клиентские зависимости:
\`\`\`bash
npm create vite@latest client -- --template react-ts
cd client
npm install
\`\`\`

### 5. Запуск приложения

#### Запуск сервера:
\`\`\`bash
node server.js
\`\`\`
Сервер запустится на `http://localhost:5000`

#### Запуск клиента:
\`\`\`bash
cd client
npm run dev
\`\`\`
Клиент запустится на `http://localhost:5173`

