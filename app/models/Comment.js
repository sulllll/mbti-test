import mongoose from 'mongoose';

// 모델이 이미 존재하는지 확인하여 중복 정의 방지
const CommentSchema = new mongoose.Schema({
  nickname: {
    type: String,
    required: [true, '닉네임을 입력해주세요'],
    maxlength: [20, '닉네임은 최대 20자까지 입력 가능합니다'],
  },
  content: {
    type: String,
    required: [true, '내용을 입력해주세요'],
    maxlength: [200, '내용은 최대 200자까지 입력 가능합니다'],
  },
  timestamp: {
    type: Number,
    default: Date.now,
  },
  mbtiType: {
    type: String,
    required: [true, 'MBTI 유형이 필요합니다'],
  },
  rating: {
    type: Number,
    required: [true, '별점을 입력해주세요'],
    min: [1, '별점은 최소 1점입니다'],
    max: [5, '별점은 최대 5점입니다'],
    default: 5,
  },
}, {
  timestamps: true,
});

export default mongoose.models.Comment || mongoose.model('Comment', CommentSchema); 