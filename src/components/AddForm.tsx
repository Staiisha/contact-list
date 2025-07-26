import React from "react";
import './AddForm.scss'

interface MyFormProps {
  onCancel: () => void
  onSubmit: (data: { name: string; phone: string }) => void
  initialData?: { name: string; phone: string } | null
}

function MyForm({ onCancel, onSubmit, initialData }: MyFormProps) {
  const [name, setName] = React.useState(initialData?.name || "")
  const [phone, setPhone] = React.useState(initialData?.phone || "")

  React.useEffect(() => {
    if (initialData) {
      setName(initialData.name)
      setPhone(initialData.phone)
    } else {
      setName("")
      setPhone("")
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || !phone.trim()) {
      alert("Пожалуйста, заполните все поля")
      return
    }

    onSubmit({ name: name.trim(), phone: phone.trim() })
  }

  return (
      <div className="contact-form-overlay">
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-group">
        <label>Имя</label>
      <input type="text"  value={name} onChange={(e) => setName(e.target.value)} required />
<label>Номер телефона</label>
      <input
      
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
      />

      <div className="form-buttons">
        <button className="addedit-btn" type="submit">{initialData ? "Сохранить" : "Добавить контакт"}</button>
        <button className='deleteedit-btn' type="button" onClick={onCancel}>
          Отмена
        </button>
        </div>
      </div>
    </form>
    </div>
  )
}

export default MyForm
