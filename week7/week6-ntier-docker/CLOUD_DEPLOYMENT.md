# Cloud Deployment Analysis
## ENGSE207 - Week 7 Lab

**ชื่อ-นามสกุล:** ภานุวัฒน์ ต๋าคำ
**รหัสนักศึกษา:** 67543210044-3

### 1.1 URLs ของระบบที่ Deploy

| Service | URL |
|---------|-----|
| Frontend | https://empowering-optimism-production.up.railway.app |
| Backend API | https://engse207-solo-production.up.railway.app/api |
| Database | (Internal - ไม่มี public URL) |

### 1.2 Screenshot หลักฐาน (5 รูป)
### api
![](./api.png)
### wed
![](./wed.png)



### 2.1 ความแตกต่างที่สังเกตเห็น (10 คะแนน)

| ด้าน | Docker (Week 6) | Railway (Week 7) |
|------|-----------------|------------------|
| เวลา Deploy | เร็วมาก (Build Local) | ช้ากว่า (Upload & Build Cloud) |
| การตั้งค่า Network | Manual Config (Ports) | Auto Public Domain / HTTPS |
| การจัดการ ENV | .env file | Railway Dashboard (UI) |
| การดู Logs | docker logs command | Railway Logs Tab (Web UI) |
| การ Scale | docker compose --scale | เพิ่ม Replicas ผ่าน UI |

### 2.2 ข้อดี/ข้อเสีย ของแต่ละแบบ (5 คะแนน)

**Docker Local:**
- ข้อดี: ฟรี, ไม่ต้องต่อเน็ต, Develop และ Test ได้รวดเร็ว, Debug ง่าย
- ข้อเสีย: คนอื่นเข้าถึงไม่ได้ (localhost), กินทรัพยากรเครื่องตัวเอง, Environment อาจต่างจาก Production

**Railway Cloud:**
- ข้อดี: มี Public URL ให้คนอื่นเข้าถึงได้, มี HTTPS อัตโนมัติ, ไม่เปลืองทรัพยากรเครื่อง, Online 24 ชม
- ข้อเสีย: มีค่าใช้จ่ายเมื่อเกิน Free Tier, ต้องต่อเน็ตเพื่อ Deploy, ใช้เวลา Build นานกว่า Local


### 3.1 Railway เป็น Service Model แบบไหน?

[ ] IaaS   [x] PaaS   [ ] SaaS

เพราะ: เราไม่ต้องบริหารจัดการ Server (OS, Network, Security Patches) เอง เพียงแค่เตรียม Application Code หรือ Docker Image ระบบ Platform ก็จะจัดการส่วนที่เหลือให้จนใช้งานได้

### 3.2 ถ้าใช้ IaaS (เช่น AWS EC2) ต้องทำอะไรเพิ่มอีก? (ยกตัวอย่าง 4 ข้อ)

1. ติดตั้ง OS และ Runtime Environment (เช่น Node.js, Docker Engine)
2. ตั้งค่า Firewall และ Security Groups (เปิด Port 80, 443)
3. จัดการ SSL/TLS Certificate และต่ออายุเอง (เช่นใช้ Let's Encrypt)
4. ตั้งค่า Load Balancer และ Scaling Policies เอง


### 4.1 Factors ที่เห็นจาก Lab (10 คะแนน)

เลือก 5 Factors และอธิบายว่าเห็นจากไหนใน Railway:

| Factor | เห็นจากไหน? | ทำไมสำคัญ? |
|--------|------------|-----------|
| Factor 3: Config | Variables tab (Dashboard) | แยก Config ออกจาก Code เพื่อความปลอดภัยและเปลี่ยนค่าตาม Env ได้ง่าย |
| Factor 4: Backing Services | Database Service (PostgreSQL) | มอง Database เป็น resource ภายนอกที่เชื่อมต่อผ่าน URL เปลี่ยน DB ได้โดยไม่ต้องแก้ Code |
| Factor 6: Processes | Stateless Container | แอปไม่เก็บ State ไว้ในเครื่อง ทำให้ Scale หรือ Restart ได้โดยข้อมูลไม่หาย |
| Factor 9: Disposability | Fast startup/shutdown | Container เริ่มและหยุดทำงานได้เร็ว รองรับการ deploy บ่อยๆ และ recovery ได้ไว |
| Factor 11: Logs | Logs tab (Stream Output) | Logs ถูกส่งออกทาง stdout และ Railway รวบรวมให้ดูผ่านหน้าเว็บ ไม่ต้องจัดการไฟล์ log เอง |

### 4.2 ถ้าไม่ทำตาม 12-Factor จะมีปัญหาอะไร? (5 คะแนน)

ยกตัวอย่าง 2 ปัญหา:

**ปัญหา 1:** ถ้าไม่ทำตาม Factor 3 (Config)
- สิ่งที่จะเกิด: ต้องแก้ Code ทุกครั้งที่เปลี่ยน Database Password หรือ API Key และมีความเสี่ยงที่ความลับจะหลุดไปใน Source Control (Git)

**ปัญหา 2:** ถ้าไม่ทำตาม Factor 6 (Processes)
- สิ่งที่จะเกิด: แอปจะ Scale ไม่ได้ เพราะถ้าเพิ่ม Container ตัวใหม่ ข้อมูล Session หรือไฟล์ที่อัปโหลดไว้ใน Local Filesystem จะไม่ตามไปด้วย (ข้อมูลหาย)


### 5.1 สิ่งที่เรียนรู้จาก Lab นี้

1. เข้าใจกระบวนการ Deploy Application ขึ้น Cloud Provider (Railway) และข้อดีของ PaaS
2. การจัดการ Environment Variables ใน Production เพื่อแยก Config ออกจาก Code
3. ความสำคัญของ 12-Factor App ในการออกแบบระบบให้รองรับ Cloud Native Architecture

### 5.2 ความท้าทาย/ปัญหาที่พบ และวิธีแก้ไข

ปัญหา: การเชื่อมต่อ Database ล้มเหลวเนื่องจากใช้ Localhost หรือ Environment Variable ผิดพลาด
วิธีแก้: ตรวจสอบ Connection String ใน Railway Variables และแก้ไขให้ถูกต้องตามที่ Service Database กำหนด หรือใช้ Internal Hostname

### 5.3 จะเลือกใช้ Docker หรือ Cloud เมื่อไหร่?

- ใช้ Docker เมื่อ: ต้องการ Develop/Test ในเครื่อง (High speed feedback loop), ต้องการ Environment ที่เหมือนกันในทีม, หรือ Run On-Premise
- ใช้ Cloud (PaaS) เมื่อ: ต้องการ Production Environment ที่ Access ได้จริง, ต้องการความสะดวกในการ Scale และจัดการ Infrastructure, หรือทำ MVP (Minimum Viable Product)