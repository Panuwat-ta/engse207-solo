
# สร้างโดย: [ชื่อนักศึกษา]
## ENGSE207 Software Architecture - Week 6 EOF

### 8.2 คำสั่งสำหรับเก็บข้อมูล

```bash
# ดู memory usage ของ Docker
docker stats --no-stream

# ดู disk usage
docker system df

# ดู container sizes
docker ps -s

# ดู image sizes
docker images

# ดู network
docker network ls
docker network inspect taskboard-network