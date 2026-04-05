from django.contrib import admin
from .models import ChatSession, ChatMessage, LessonAIComment


class ChatMessageInline(admin.TabularInline):
    model = ChatMessage
    readonly_fields = ['role', 'content', 'created_at']
    extra = 0


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'lesson', 'created_at', 'updated_at']
    list_filter = ['created_at']
    search_fields = ['user__username', 'user__email']
    inlines = [ChatMessageInline]


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['session', 'role', 'short_content', 'created_at']
    list_filter = ['role', 'created_at']

    @admin.display(description='Content')
    def short_content(self, obj):
        return obj.content[:80]


@admin.register(LessonAIComment)
class LessonAICommentAdmin(admin.ModelAdmin):
    list_display = ['lesson', 'comment_count', 'input_tokens', 'output_tokens', 'updated_at']
    readonly_fields = ['comments', 'input_tokens', 'output_tokens']

    @admin.display(description='Comments')
    def comment_count(self, obj):
        return len(obj.comments) if obj.comments else 0
