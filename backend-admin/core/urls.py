from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import (
    GroupViewSet,
    ForumPostViewSet,
    RegisterView,
    BaseTecChatView,
    VoiceGroupCreateView,
    CommentListCreateView,
)

router = DefaultRouter()
router.register(r"grupos", GroupViewSet, basename="grupo")
router.register(r"posts", ForumPostViewSet, basename="post")

urlpatterns = [
    # AUTH
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/token/", TokenObtainPairView.as_view(), name="auth-token"),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="auth-token-refresh"),

    # IA
    path("base-tec/chat/", BaseTecChatView.as_view(), name="base-tec-chat"),
    path("voice-group/", VoiceGroupCreateView.as_view(), name="voice-group"),

    # Comentarios por post
    path(
        "posts/<int:post_id>/comentarios/",
        CommentListCreateView.as_view(),
        name="post-comentarios",
    ),

    # Rutas REST de grupos y posts
    path("", include(router.urls)),  # -> /api/grupos/, /api/posts/
]
