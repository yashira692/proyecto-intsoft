import re
from typing import Optional

from django.contrib.auth import get_user_model

from rest_framework import viewsets, parsers, generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Group, ForumPost, Comment
from .serializers import (
    GroupSerializer,
    ForumPostSerializer,
    RegisterSerializer,
    CommentSerializer,
)
from .base_tec_ai import generar_respuesta_tecsup, extraer_datos_grupo

User = get_user_model()


class BaseTecChatView(APIView):
    """
    Endpoint de chat para la IA (usa OpenAI, con contexto de grupos).
    """

    def _extraer_seccion(self, texto: str) -> Optional[str]:
        patron = r"secci[óo]n\s+([A-Za-z])"
        m = re.search(patron, texto.lower())
        if m:
            return m.group(1).upper()
        return None

    def _extraer_keywords(self, texto: str):
        texto = re.sub(r"[¿?¡!.,;:]", " ", texto.lower())
        palabras = [p for p in texto.split() if len(p) >= 3]
        return palabras

    def _construir_contexto_grupos(self, pregunta: str) -> Optional[str]:
        seccion = self._extraer_seccion(pregunta)
        keywords = self._extraer_keywords(pregunta)

        grupos_qs = Group.objects.all().order_by("seccion", "numero")
        if not grupos_qs.exists():
            return "No hay grupos registrados actualmente en la base de datos."

        lineas = []

        # 1) Filtrar por sección si la mencionan
        if seccion:
            grupos_seccion = grupos_qs.filter(seccion__iexact=seccion)
            if grupos_seccion.exists():
                lineas.append(f"Grupos en la sección {seccion}:")
                for g in grupos_seccion:
                    lineas.append(
                        f"- Grupo {g.numero} (Sección {g.seccion}): "
                        f"tema '{g.tema}', integrantes: {g.integrantes}."
                    )
            else:
                lineas.append(f"No hay grupos registrados en la sección {seccion}.")

        # 2) Coincidencias por palabras clave en tema / integrantes
        coincidencias = []
        for g in grupos_qs:
            texto_busqueda = (g.tema or "").lower() + " " + (g.integrantes or "").lower()
            if any(k in texto_busqueda for k in keywords):
                coincidencias.append(g)

        if coincidencias:
            lineas.append("\nGrupos que coinciden con palabras clave de la pregunta:")
            for g in coincidencias:
                lineas.append(
                    f"- Grupo {g.numero} (Sección {g.seccion}): "
                    f"tema '{g.tema}', integrantes: {g.integrantes}."
                )

        # 3) Resumen global
        lineas.append("\nResumen general de todos los grupos registrados:")
        for g in grupos_qs:
            lineas.append(
                f"- Grupo {g.numero} (Sección {g.seccion}): "
                f"tema '{g.tema}', integrantes: {g.integrantes}."
            )

        return "\n".join(lineas) if lineas else None

    def post(self, request):
        pregunta = request.data.get("message", "").strip()

        if not pregunta:
            return Response({"error": "Falta el mensaje"}, status=400)

        try:
            contexto = self._construir_contexto_grupos(pregunta)
            respuesta = generar_respuesta_tecsup(pregunta, contexto_grupos=contexto)
            return Response({"reply": respuesta})
        except Exception as e:
            print("ERROR IA:", e)
            return Response(
                {"reply": "Error al conectar con el modelo de IA."},
                status=500,
            )


class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class ForumPostViewSet(viewsets.ModelViewSet):
    queryset = ForumPost.objects.all()
    serializer_class = ForumPostSerializer
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class VoiceGroupCreateView(APIView):
    """
    Recibe una frase por voz (ya convertida a texto),
    usa la IA para extraer los datos y CREA el grupo.
    """

    def post(self, request):
        frase = request.data.get("message", "").strip()
        if not frase:
            return Response({"error": "Falta el mensaje"}, status=400)

        try:
            datos = extraer_datos_grupo(frase)

            numero = datos.get("numero")
            seccion = datos.get("seccion")
            integrantes = datos.get("integrantes", "")
            tema = datos.get("tema", "")
            descripcion = datos.get("descripcion", "")

            if not numero or not seccion:
                return Response(
                    {"error": "La IA no pudo detectar número o sección."},
                    status=400,
                )

            group = Group.objects.create(
                numero=numero,
                seccion=seccion,
                integrantes=integrantes,
                tema=tema,
                descripcion=descripcion,
            )

            serializer = GroupSerializer(group)
            return Response(serializer.data, status=201)

        except Exception as e:
            print("ERROR VoiceGroupCreateView:", e)
            return Response(
                {"error": "Error al procesar los datos del grupo."},
                status=500,
            )


class CommentListCreateView(APIView):
    """
    Lista y crea comentarios para un post específico.
    Endpoint: /api/posts/<post_id>/comentarios/
    """

    def get(self, request, post_id):
        comentarios = Comment.objects.filter(post_id=post_id).order_by("creado_en")
        serializer = CommentSerializer(comentarios, many=True)
        return Response(serializer.data)

    def post(self, request, post_id):
        data = request.data.copy()
        data["post"] = post_id
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
