import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongodb';
import Comment from '@/app/models/Comment';

// GET 요청 처리 - 모든 댓글 가져오기
export async function GET() {
  try {
    await connectToDatabase();
    const comments = await Comment.find({}).sort({ timestamp: -1 });
    
    return NextResponse.json({ success: true, data: comments });
  } catch (error) {
    console.error('댓글 가져오기 오류:', error);
    return NextResponse.json(
      { success: false, message: '댓글을 가져오는 중 오류가 발생했습니다', error: error.message },
      { status: 500 }
    );
  }
}

// POST 요청 처리 - 새 댓글 추가
export async function POST(request) {
  try {
    const body = await request.json();
    
    // 필수 필드 확인
    if (!body.nickname || !body.content || !body.mbtiType) {
      return NextResponse.json(
        { success: false, message: '필수 필드가 누락되었습니다' },
        { status: 400 }
      );
    }
    
    await connectToDatabase();
    
    // 새 댓글 생성
    const newComment = await Comment.create({
      nickname: body.nickname,
      content: body.content,
      timestamp: Date.now(),
      mbtiType: body.mbtiType,
      rating: body.rating || 5
    });
    
    return NextResponse.json(
      { success: true, data: newComment },
      { status: 201 }
    );
  } catch (error) {
    console.error('댓글 추가 오류:', error);
    return NextResponse.json(
      { success: false, message: '댓글을 추가하는 중 오류가 발생했습니다', error: error.message },
      { status: 500 }
    );
  }
} 