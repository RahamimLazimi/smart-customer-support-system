# 🎫 Smart Customer Support System

Full-stack ticket system built with:

```
Frontend  → React ⚛️
Backend   → ASP.NET Core Minimal API 🔧
Storage   → JSON file 📄
```

---

## 🚀 Features

```
👤 User
 ├─ Create ticket
 ├─ View tickets
 └─ Search & filter

🔐 Admin
 ├─ Login (JWT)
 ├─ Update status
 └─ Add resolution
```

---

## 🖼️ Flow

```
[ React UI ]
      ↓
[ API (Minimal API) ]
      ↓
[ TicketService ]
      ↓
[ JSON File ]
```

---

## ➕ Create Ticket

```
Name + Email + Description + Image
            ↓
     Saved to server
            ↓
   (Mock) Email sent 📧
```

---

## 🔍 Ticket View

```
/tickets/{id}

✔ Full details
✔ Status update
✔ Resolution edit
```

---

## 🧠 Tech Highlights

* Clean architecture (DTO + Service)
* FormData + file upload
* JWT Authentication
* Minimal API

---

## ▶️ Run Project

### Backend

```
cd server
dotnet run
```

### Frontend

```
cd client
pnpm install
pnpm dev
```

---

## 📝 Notes

```
📧 Email service → mocked (console log)
🗂️ Data stored locally in JSON
```

---

## 🎯 Summary

```
Simple ✔
Clean ✔
Full-stack ✔
Working ✔
```

## 🔐 Test Users

| Role  | Username | Password |
|-------|----------|----------|
| Admin | `admin`  | `1234`   |
| User  | `user`   | `1234`   |

Frontend: http://localhost:5173  
Backend: http://localhost:5000