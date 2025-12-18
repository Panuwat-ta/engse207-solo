# Client-Server Architecture: VM Deployment & REST API

## ส่วนที่ 1: VirtualBox & VM Setup
![alt text](start.png)
* VM IP 192.168.56.110
---

## ส่วนที่ 2: ตั้งค่า Ubuntu Server

### 2.1 อัพเดทระบบ
* ![alt text](update.png)

### 2.2 ติดตั้งเครื่องมือพื้นฐาน
* ![alt text](1.png)

* ![alt text](2.png)

### 2.3 ตั้งค่า Firewall
* ![alt text](3.png)

### 2.4 ทดสอบการเชื่อมต่อ Network
* ![alt text](4.png)
* VM IP ของฉัน: 192.168.56.110 

## ส่วนที่ 3: ติดตั้งสภาพแวดล้อมพัฒนา

### 3.1 ติดตั้ง Node.js
* ![alt text](5.png)

### ติดตั้ง SQLite
* ![alt text](6.png)

### 3.3 ตั้งค่าโฟลเดอร์โปรเจกต์
* ![alt text](7.png)

### 3.4 ทดสอบ Node.js
* ![alt text](8.png)

## ส่วนที่ 4: Deploy Backend ไปยัง VM
* ![alt text](9.png)

## ส่วนที่ 5: ตั้งค่าการสื่อสาร Client-Server
* ![alt text](10.png)

## ส่วนที่ 6: Production Deployment ด้วย PM2

### 6.2 สร้าง PM2 Ecosystem File 
* ![alt text](11.png)

### 6.3 เริ่มแอปพลิเคชันด้วย PM2
* ![alt text](12.png)

### 6.4 ตั้งค่า Auto-Start เมื่อ Boot 
* ![alt text](13.png)

## PART 7: Testing & Monitoring
* ![alt text](14.png)

### 7.2 Monitor Performance
* ![alt text](15.png)
* ![alt text](16.png)

### 7.3 Log Management
* ![alt text](17.png)

### PART 8: Documentation
* ![alt text](18.png)

## ส่วนที่ 9: การวิเคราะห์และเปรียบเทียบ