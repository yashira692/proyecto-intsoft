# 🚀 INTSOFT – Plataforma para Gestión de Proyectos Integradores

INTSOFT es una plataforma web desarrollada con **Django**, **Spring Boot** y **React**, diseñada para facilitar la gestión, consulta y organización de los Proyectos Integradores dentro de Tecsup.

Este repositorio contiene el código fuente completo del frontend, backend y la documentación técnica necesaria para la ejecución y despliegue de la aplicación en un servidor.

##  Estructura del Proyecto

proyecto-intsoft/
│
├── backend-admin/ # Backend para administrador (Django)
├── backend-estudiante/ # Backend para estudiantes (Spring Boot)
│
├── frontend-admin/ # Frontend administrador (React)
├── frontend-estudiante/ # Frontend estudiante (React)
│
├── docs/ # Diagramas y documentación adicional
│ ├── MER.png
│ ├── arquitectura.png
│ └── gantt.png
│
└── README.md


#  Configuración del Proyecto

##  Variables de Entorno – Django

Crear archivo `.env` dentro de **backend-admin**:

DEBUG=True
SECRET_KEY=your-secret-key
DATABASE_URL=mysql://user:password@localhost:3306/intsoft_db
ALLOWED_HOSTS=localhost,127.0.0.1


## 🛠 Configuración – Spring Boot

Editar el archivo `application.properties` en **backend-estudiante**:

spring.datasource.url=jdbc:mysql://localhost:3306/intsoft_db
spring.datasource.username=user
spring.datasource.password=tu_password


#  Cómo ejecutar el proyecto en local

##  Backend Django (Administrador)

```bash
cd backend-admin
python manage.py runserver

 Backend Spring Boot (Estudiante)
bash
Copiar código
cd backend-estudiante
./mvnw spring-boot:run

Frontend (Administrador)
bash
Copiar código
cd frontend-admin
npm install
npm run dev

 Frontend (Estudiante)
bash
Copiar código
cd frontend-estudiante
npm install
npm run dev

 Despliegue en un Servidor 
Este repositorio incluye las instrucciones necesarias para desplegar INTSOFT en un servidor Linux (Ubuntu recomendado).

1. Instalar dependencias necesarias
bash
Copiar código
sudo apt update
sudo apt install python3-pip mysql-server openjdk-17-jdk nodejs npm

2. Configurar base de datos MySQL
bash
Copiar código
sudo mysql -u root -p
CREATE DATABASE intsoft_db;
CREATE USER 'user'@'%' IDENTIFIED BY 'tu_password';
GRANT ALL PRIVILEGES ON intsoft_db.* TO 'user'@'%';
FLUSH PRIVILEGES;

3. Desplegar Backend Django
bash
Copiar código
cd backend-admin
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic
gunicorn backend_admin.wsgi
(Recomendado: usar Nginx + Gunicorn para producción)

4. Desplegar Backend Spring Boot
bash
Copiar código
cd backend-estudiante
./mvnw clean package
java -jar target/backend-estudiante.jar

 5. Desplegar Frontend (React)
Frontend administrador:
bash
Copiar código
cd frontend-admin
npm install
npm run build
Frontend estudiante:
bash
Copiar código
cd frontend-estudiante
npm install
npm run build
Sube el contenido de la carpeta /dist a un servidor web estático como Nginx o Apache.

Tecnologías Utilizadas
Django (Backend administrador)
Spring Boot (Backend estudiantes)
React (Interfaces web)
MySQL (Base de datos)
Node.js & npm

Nginx / Apache (para despliegue)
