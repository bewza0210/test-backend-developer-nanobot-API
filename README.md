# test-backend-developer-nanobot

# Backend API Project 
โปรเจกต์นี้เป็น Backend API ที่พัฒนาด้วย Node.js โดยใช้ Express เป็น web framework พร้อมรองรับ WebSocket สำหรับ real-time communication
มีการจัดการฐานข้อมูลด้วย Sequelize (ORM) รองรับทั้ง Migration และ Seeder
ระบบยืนยันตัวตนใช้ JWT (JSON Web Token) และมีการเขียน Unit Test ด้วย Jest

## ✨ Features
- **RESTful API** ด้วย Express  
- **Real-time communication** ผ่าน WebSocket  
- **Database management** ด้วย Sequelize + Migration + Seeder  
- **Authentication system** ด้วย JWT  
- **Unit Testing** ด้วย Jest  

ก่อนเริ่มต้นควรติดตั้ง:
Node.js(>= 18.x)
npmหรือ yarn
Database (MySQL / PostgreSQL / etc. ตามที่ config ไว้)

Getting Started

ทำตามขั้นตอนด้านล่างเพื่อเริ่มต้นใช้งานโปรเจกต์นี้:

ติดตั้ง dependency
npm install

รัน migration สำหรับฐานข้อมูล
npm run migrate

เริ่มต้นเซิร์ฟเวอร์ในโหมดพัฒนา
npm run dev