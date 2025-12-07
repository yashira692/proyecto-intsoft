Iniciar Backend Django:
bash
cd backend-admin
python manage.py runserver
Iniciar Backend Spring Boot:
bash
cd backend-estudiante
./mvnw spring-boot:run
Iniciar Frontend Admin:
bash
cd frontend-admin
npm run dev
Iniciar Frontend Estudiante:
bash
cd frontend-estudiante
npm run dev
Anexo C: Variables de Entorno
Django (.env):
DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=mysql://user:password@localhost:3306/intsoft_db
ALLOWED_HOSTS=localhost,127.0.0.1
Spring Boot (application.properties):
spring.datasource.url=jdbc:mysql://localhost:3306/intsoft_db
spring.datasource.username=user
spring.datasource.password=tu_password

