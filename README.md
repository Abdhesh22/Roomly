# 🏠 Roomly

Roomly is a **full-stack room rental platform** where hosts can list rooms in their homes, and guests can seamlessly book, rent, and pay online.  
It provides an end-to-end flow including **room listing, image uploads, interactive map-based location picker, secure payments, refunds, and real-time email notifications.**

🔗 **Live Demo**: [Roomly on Render](https://roomly-d2ep.onrender.com/)  

---

## ✨ Features

- 🔑 **User Authentication** – Secure login/signup  
- 🏘️ **Room Listings** – Hosts can add/edit rooms with images, pricing, and occupancy details  
- 🗺️ **Location Picker** – Integrated with **Leaflet + OSM** and autocomplete for easy room location  
- 📸 **Image Uploads** – Cloudinary integration with efficient add/remove flow  
- 💳 **Payments** – Integrated **Razorpay** for seamless checkout  
- 💸 **Refund Flow** – Guests can request refunds, processed securely  
- 📧 **Email Notifications** – Real-time confirmation & updates using **SMTP**  
- 📅 **Reservation System** – Guests can select check-in/check-out dates and number of occupants  

---

## 🛠️ Tech Stack

**Frontend**
- React, React Hook Form  
- Leaflet + LocationIQ for maps & autocomplete  
- Custom CSS  

**Backend**
- Node.js, Express.js  
- MongoDB with Mongoose  

**Other Integrations**
- Cloudinary (image hosting)  
- Razorpay (payments + refunds)  
- SMTP (transactional emails)  

**Deployment**
- Render (Frontend + Backend)  
- Railway (Backend alternative)  

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Abdhesh22/Roomly.git
cd Roomly
```

### 2. Front Setup
## Create .env file in front directory
- 👉 [Frontend .env Setup Guide](https://docs.google.com/document/d/1JrXRnu1E_hUQQh0O7QquCnA1hW60CP-15wRfWPJAfEI/edit?addon_store&tab=t.0)

```bash
cd ./client
npm install

# Create environment file
touch .env

# Run frontend
npm run dev

```

### 3. Backend Setup
## Create .env file in server directory
- 👉 [Backend .env Setup Guide](https://docs.google.com/document/d/1JrXRnu1E_hUQQh0O7QquCnA1hW60CP-15wRfWPJAfEI/edit?addon_store&tab=t.jdnobkf3e0xf)  

```bash
cd ./server
npm install

# Create environment file
touch .env

# Run Seeds
npm run seeds

# OR run in production
npm start
```