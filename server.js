import express from "express"
import { Pool } from "pg"
import cors from "cors"

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "mydatabase",
  password: "29893564",
  port: 5432,
  application_name: "myapp",
  options: "--client_encoding=UTF8",
})


pool.on("connect", async (client) => {
  try {
    await client.query("SET client_encoding TO 'UTF8'")
    await client.query("SET standard_conforming_strings TO on")
    console.log("Кодировка установлена в UTF-8")
  } catch (err) {
    console.error("Ошибка установки кодировки:", err)
  }
})

const app = express()


app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
  next()
})


app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }),
)

app.use(
  express.json({
    limit: "10mb",
    type: "application/json",
  }),
)

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  }),
)


app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  next()
})


app.get("/api/contacts", async (req, res) => {
  const client = await pool.connect()
  try {
    await client.query("SET client_encoding TO 'UTF8'")
    const { rows } = await client.query("SELECT * FROM contacts ORDER BY id")
    console.log("Данные из БД:", rows)
    res.json(rows)
  } catch (err) {
    console.error("Ошибка при запросе к БД:", err)
    res.status(500).json({
      error: "Ошибка сервера",
      details: err.message,
    })
  } finally {
    client.release()
  }
})

// Добавление контакта
app.post("/api/contacts", async (req, res) => {
  const { name, phone } = req.body
  console.log("POST /api/contacts - получены данные:", { name, phone })

  if (!name || !phone) {
    return res.status(400).json({
      error: "Имя и телефон обязательны",
    })
  }

  const client = await pool.connect()
  try {
    await client.query("SET client_encoding TO 'UTF8'")
    const { rows } = await client.query("INSERT INTO contacts (name, phone) VALUES ($1, $2) RETURNING *", [name, phone])
    console.log("Добавлен контакт:", rows[0])
    res.status(201).json(rows[0])
  } catch (err) {
    console.error("Ошибка при добавлении контакта:", err)
    res.status(500).json({
      error: "Ошибка при добавлении контакта",
      details: err.message,
    })
  } finally {
    client.release()
  }
})


app.put("/api/contacts/:id", async (req, res) => {
  const { id } = req.params
  const { name, phone } = req.body

  console.log(`PUT /api/contacts/${id} - получены данные:`, { name, phone })

  if (!name || !phone) {
    return res.status(400).json({ error: "Имя и телефон обязательны" })
  }

  const client = await pool.connect()
  try {
    await client.query("SET client_encoding TO 'UTF8'")

    const result = await client.query("UPDATE contacts SET name = $1, phone = $2 WHERE id = $3 RETURNING *", [
      name,
      phone,
      id,
    ])

    console.log(`Результат обновления контакта ${id}:`, result.rows)

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Контакт не найден" })
    }

    res.json(result.rows[0])
  } catch (err) {
    console.error("Ошибка при обновлении контакта:", err)
    res.status(500).json({ error: err.message })
  } finally {
    client.release()
  }
})

// Удаление контакта
app.delete("/api/contacts/:id", async (req, res) => {
  const { id } = req.params
  console.log(`DELETE /api/contacts/${id}`)

  const client = await pool.connect()
  try {
    await client.query("SET client_encoding TO 'UTF8'")
    const { rows } = await client.query("DELETE FROM contacts WHERE id = $1 RETURNING *", [id])

    if (rows.length === 0) {
      return res.status(404).json({ error: "Контакт не найден" })
    }

    res.json({ message: "Контакт удален", contact: rows[0] })
  } catch (err) {
    console.error("Ошибка при удалении контакта:", err)
    res.status(500).json({
      error: "Ошибка при удалении контакта",
      details: err.message,
    })
  } finally {
    client.release()
  }
})

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
  console.log(`API доступно по адресу: http://localhost:${PORT}/api/contacts`)
})


pool.on("error", (err) => {
  console.error("Ошибка пула подключений:", err)
})

process.on("SIGINT", async () => {
  console.log("Закрытие сервера...")
  await pool.end()
  process.exit(0)
})
