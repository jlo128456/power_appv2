# ⚡ Energy Plan Finder — Frontend (React)

This is the **React frontend** for the Energy Plan Finder full-stack application. It allows users to explore and compare energy plans, track their energy usage, and receive a consultation.

---

## ✅ Features

- 🔒 Signup and login system (with logout)
- 📍 View plans filtered by postcode
- 📈 Usage history visualised via bar charts (Recharts)
- ☀️ Solar feed-in offsets yearly cost
- 💾 Plan selection with confirmation
- 🧭 Client-side routing (React Router)

---

## 🚀 Setup (VS Code Ready)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/energy-app.git
cd energy-app/frontend
```

### 2. Open the frontend in VS Code

```bash
code .
```

> This opens the current folder in Visual Studio Code

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm start
```

The app will open at: `http://localhost:3000`

Make sure your Flask backend is running at `http://localhost:5000`.

---

## ⚙️ Environment Setup (Optional)

To override default API URLs, create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

Then update your `fetch()` calls to:

```js
fetch(`${process.env.REACT_APP_API_URL}/api/...`)
```

---

## 💡 Recommended VS Code Extensions

- **ESLint** – for linting and clean code
- **Prettier** – for code formatting
- **React Developer Tools** – for inspecting React components
- **Live Server (for static previewing)**

---

## 📁 Folder Structure

```
src/
├── components/
│   ├── Login.js
│   ├── Signup.js
│   ├── PlanFinder.js
│   ├── Account.js
│   ├── ResetPassword.js
│   ├── Contact.js
│   ├── About.js
│   ├── ThankYou.js
│   └── helper.js
├── App.js
├── index.js
```

---

## 🧪 Sample Users

You can use the backend's `seed.py` to create test users, or register directly via the signup form.

---

## 🔗 Live Demo

_You can deploy to [Netlify](https://netlify.com) or [Vercel](https://vercel.com)_  
Make sure to set the correct backend API URL in production.

---

## 📄 License

MIT License — feel free to fork and adapt.

---

## 🙋 Support

For help or suggestions, contact: [your-email@example.com](mailto:your-email@example.com)
