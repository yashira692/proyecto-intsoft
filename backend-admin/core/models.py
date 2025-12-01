from django.db import models
from django.contrib.auth.models import User


class Group(models.Model):
    numero = models.CharField(max_length=10)
    seccion = models.CharField(max_length=20)
    integrantes = models.TextField()
    tema = models.CharField(max_length=150)
    descripcion = models.TextField(blank=True)
    creado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="grupos_creados",
    )
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "core_group"   # <-- coincide con la BD
        ordering = ["numero"]

    def __str__(self):
        return f"Grupo {self.numero} - {self.seccion}"


class ForumPost(models.Model):
    titulo = models.CharField(max_length=150)
    contenido = models.TextField()
    autor = models.CharField(max_length=100)
    imagen = models.ImageField(upload_to="foro_imagenes/", null=True, blank=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "core_forumpost"   # <-- OJO: sin 's', igual que en MySQL
        ordering = ["-creado_en"]

    def __str__(self):
        return self.titulo


class Comment(models.Model):
    post = models.ForeignKey(
        ForumPost,
        on_delete=models.CASCADE,
        related_name="comentarios",
        db_column="post_id",   # columna FK en la tabla core_comment
    )
    autor = models.CharField(max_length=100)
    contenido = models.TextField()
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "core_comment"   # coincide con la BD
        ordering = ["creado_en"]

    def __str__(self):
        return f"Comentario de {self.autor} en {self.post.titulo}"
    
