import { useState, useEffect } from "react"
import "./App.scss"
import MyForm from "./components/AddForm"

interface Contact {
  id: number
  name: string
  phone: string
  created_at?: string
}

function App() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [isAdding, setIsAdding] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchContacts = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "GET",
        headers: {
          Accept: "application/json; charset=utf-8",
          "Content-Type": "application/json; charset=utf-8",
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data: Contact[] = await response.json()
      setContacts(data)
    } catch (err) {
      console.error("Ошибка загрузки контактов:", err)
      setError(err instanceof Error ? err.message : "Произошла неизвестная ошибка")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEditClick = (contact: Contact) => {
    setEditingContact(contact)
    setIsAdding(true)
  }

  const handleAddClick = () => {
    setEditingContact(null)
    setIsAdding(true)
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingContact(null) 
    setError(null)
  }

  const handleFormSubmit = async (data: { name: string; phone: string }) => {
    setIsLoading(true)
    setError(null)

    try {
      const url = editingContact
        ? `http://localhost:5000/api/contacts/${editingContact.id}`
        : "http://localhost:5000/api/contacts"
      const method = editingContact ? "PUT" : "POST"

      console.log(`Отправка ${method} запроса на ${url}`, data)

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Ошибка сервера: ${response.status}`)
      }

      const result = await response.json()
      console.log("Успешный ответ:", result)

      await fetchContacts()
      setIsAdding(false)
      setEditingContact(null)
    } catch (err) {
      console.error("Ошибка сохранения:", err)
      setError(err instanceof Error ? err.message : "Неизвестная ошибка")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить этот контакт?")) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json; charset=utf-8",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Не удалось удалить контакт")
      }

      await fetchContacts()
    } catch (err) {
      console.error("Ошибка удаления:", err)
      setError(err instanceof Error ? err.message : "Ошибка при удалении контакта")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  return (
    <div className="contact-page">
    <div className="contact-list">
      <h1>Список контактов</h1>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={() => setError(null)} className="close-error">
            ×
          </button>
        </div>
      )}

      {isLoading && <div className="loading">Загрузка</div>}

      {isAdding ? (
        <MyForm onCancel={handleCancel} onSubmit={handleFormSubmit} initialData={editingContact} />
      ) : (
        <button className="add-btn" onClick={handleAddClick} disabled={isLoading}>
          Добавить контакт
        </button>
      )}

      <div className="contacts-list">
        {contacts.length === 0 && !isLoading ? (
          <div className="no-contacts">Список контактов пуст</div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="contact-item">
              <div className="contact-info">
                <h3>Имя: {contact.name}</h3>
                <p>Номер: {contact.phone}</p>
              </div>
              <div className="contact-actions">
                <button
                  className="edit-btn"
                  onClick={() => handleEditClick(contact)}
                  disabled={isLoading}
                  title="Редактировать контакт"
                >
                  Редактировать
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(contact.id)}
                  disabled={isLoading}
                  title="Удалить контакт"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </div>
  )
}

export default App
