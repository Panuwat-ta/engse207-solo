# คำสั่งทดสอบ API สำหรับระบบจัดการนักศึกษา

เอกสารนี้รวบรวมคำสั่ง `curl` สำหรับทดสอบ API ของระบบจัดการนักศึกษา

## สถาปัตยกรรมแบบ Layered 

### ข้อกำหนดเบื้องต้น

1.  ไปที่ไดเรกทอรี `layered-student`:
    ```bash
    cd layered-student
    ```

2.  ติดตั้ง Dependencies:
    ```bash
    npm install
    ```

3.  เริ่มเซิร์ฟเวอร์:
    ```bash
    npm start
    ```
    เซิร์ฟเวอร์จะทำงานที่ `http://localhost:3000`

### ปลายทาง API (API Endpoints)

#### 1. ดึงข้อมูลนักศึกษาทั้งหมด

-   **คำสั่ง:**
    ```bash
    curl http://localhost:3000/api/students
    ```
-   **ดึงข้อมูลนักศึกษาตามสาขาวิชา:**
     ```bash
    curl http://localhost:3000/api/students?major=CS
    ```
-   **ดึงข้อมูลนักศึกษาตามสถานะ:**
     ```bash
    curl http://localhost:3000/api/students?status=active
    ```

#### 2. สร้างนักศึกษาใหม่

-   **คำสั่ง:**
    ```bash
    curl -X POST http://localhost:3000/api/students \
    -H "Content-Type: application/json" \
    -d 
    {
      "student_code": "6754321004",
      "first_name": "panuwat",
      "last_name": "takham",
      "email": "panuwattakham2002@gmail.com",
      "major": "CS"
    }
    ```

#### 3. ดึงข้อมูลนักศึกษาตาม ID

-   **คำสั่ง:**
    แทนที่ `1` ด้วย Student ID จริง
    ```bash
    curl http://localhost:3000/api/students/1
    ```

#### 4. อัปเดตข้อมูลนักศึกษา

-   **คำสั่ง:**
    แทนที่ `1` ด้วย Student ID จริง
    ```bash
    curl -X PUT http://localhost:3000/api/students/1 \
    -H "Content-Type: application/json" \
    -d 
    {
      "first_name": "panuwat",
      "last_name": "takham",
      "email": "panuwattakham2002@gmail.com",
      "major": "CS"
    }
    ```

#### 5. อัปเดต GPA ของนักศึกษา

-   **คำสั่ง:**
    แทนที่ `1` ด้วย Student ID จริง
    ```bash
    curl -X PATCH http://localhost:3000/api/students/1/gpa \
    -H "Content-Type: application/json" \
    -d 
    {
      "gpa": 3.5
    }
    ```

#### 6. อัปเดตสถานะของนักศึกษา

-   **คำสั่ง:**
    แทนที่ `1` ด้วย Student ID จริง
    ```bash
    curl -X PATCH http://localhost:3000/api/students/1/status \
    -H "Content-Type: application/json" \
    -d 
    {
      "status": "graduated"
    }
    ```

#### 7. ลบนักศึกษา

-   **คำสั่ง:**
    แทนที่ `1` ด้วย Student ID จริง
    ```bash
    curl -X DELETE http://localhost:3000/api/students/1
    ```

---

## สถาปัตยกรรมแบบ Monolithic (รวมศูนย์)

**สำคัญ:** ทั้งโปรเจกต์แบบ Monolithic และ Layered ใช้พอร์ต 3000 โปรดตรวจสอบให้แน่ใจว่าได้รันเซิร์ฟเวอร์เพียงตัวเดียวในแต่ละครั้งเพื่อหลีกเลี่ยงข้อขัดแย้งของพอร์ต

### ข้อกำหนดเบื้องต้น

1.  ไปที่ไดเรกทอรี `monolithic-student`:
    ```bash
    cd monolithic-student
    ```

2.  ติดตั้ง Dependencies:
    ```bash
    npm install
    ```

3.  เริ่มเซิร์ฟเวอร์:
    ```bash
    npm start
    ```
    เซิร์ฟเวอร์จะทำงานที่ `http://localhost:3000`

### ปลายทาง API (API Endpoints)

ปลายทาง API สำหรับโปรเจกต์ Monolithic เหมือนกับโปรเจกต์ Layered สามารถใช้คำสั่ง `curl` เดียวกันตามที่ระบุไว้ข้างต้นได้ โปรดทราบว่าการตอบกลับสำหรับ `GET /api/students` จะแตกต่างกันเล็กน้อยในเวอร์ชัน Monolithic เนื่องจากมีการรวมข้อมูลสถิติไว้ด้วย

#### ดึงข้อมูลนักศึกษาทั้งหมด (Monolithic)

-   **คำสั่ง:**
    ```bash
    curl http://localhost:3000/api/students
    ```
-   **ตัวอย่างการตอบกลับ:**
    ```json
    {
      "students": [
        {
          "id": 1,
          "student_code": "6754321004",
          "first_name": "panuwat",
          "last_name": "takham",
          "email": "panuwattakham2002@gmail.com",
          "major": "SE",
          "gpa": 4.00,
          "status": "active",
          "created_at": "..."
        }
      ],
      "statistics": {
        "active": 1,
        "graduated": 0,
        "suspended": 0,
        "total": 1,
        "averageGPA": 4.00
      }
    }
    ```