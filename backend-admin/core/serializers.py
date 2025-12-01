from rest_framework import serializers
from django.contrib.auth import get_user_model

from .models import Group, ForumPost, Comment

User = get_user_model()


# Registro general (si lo usas en alguna parte)
class RegistroSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if not value.endswith("@tecsup.edu.pe"):
            raise serializers.ValidationError(
                "El correo debe pertenecer a TECSUP (@tecsup.edu.pe)."
            )
        return value

    def create(self, validated_data):
        user = User(
            username=validated_data["username"],
            email=validated_data["email"],
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


# Registro para el login (JWT): email + password
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ["id", "email", "password"]

    def validate_email(self, value):
        if not value.endswith("@tecsup.edu.pe"):
            raise serializers.ValidationError(
                "El correo debe pertenecer a TECSUP (@tecsup.edu.pe)."
            )
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este correo.")
        return value

    def create(self, validated_data):
        email = validated_data["email"]
        user = User(
            username=email,
            email=email,
        )
        user.set_password(validated_data["password"])
        user.save()
        return user


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = [
            "id",
            "numero",
            "seccion",
            "integrantes",
            "tema",
            "descripcion",
        ]


class ForumPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = ForumPost
        fields = ["id", "titulo", "contenido", "autor", "imagen", "creado_en"]


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "post", "autor", "contenido", "creado_en"]
        read_only_fields = ["creado_en"]
