from rest_framework import serializers
from .models import ChatMessage


class ChatInputSerializer(serializers.Serializer):
    lesson_id = serializers.IntegerField()
    message = serializers.CharField(max_length=2000)


class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'role', 'content', 'created_at']
        read_only_fields = fields


class LessonAICommentSerializer(serializers.Serializer):
    time_label = serializers.CharField()
    text = serializers.CharField()
