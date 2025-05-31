
# 📱 Wallpaper Application

A beautiful and responsive wallpaper app built using **React Native**, powered by the **Pexels API** to fetch high-quality images.

---

## 🚀 Features

- Browse and search for stunning wallpapers  
- Fetch images dynamically from the Pexels API  
- Built with performance and mobile UI best practices  

---

## 🛠️ Getting Started

Follow these steps to set up and run the project on your local machine.

---

### 1. 📦 Clone the Repository

```bash
git clone https://github.com/your-username/wallpaper-app.git
cd wallpaper-app
```

---

### 2. 📥 Install Dependencies

Install all required packages using:

```bash
npm install
```

---

### 3. 🔑 Set Up API Key

You’ll need a **Pexels API Key** to fetch images. Here's how to get one:

1. Visit the [Pexels API Page](https://www.pexels.com/api/documentation/?language=javascript)
2. Log in or create a free account
3. Generate your personal API key

In your project, initialize the client like this:

```javascript
import { createClient } from 'pexels';

const client = createClient('YOUR_PEXELS_API_KEY');
```


### 4. ▶️ Run the Application

Start the app on your emulator or physical device:

```bash
npx react-native run-android
# or
npx react-native run-ios
```

---

## 🧪 Tech Stack

This app is built using:

- ⚛️ **React Native**
- 🖼️ **Pexels API**
- 📦 **JavaScript**
