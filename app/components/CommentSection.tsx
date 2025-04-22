"use client";

import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Star, StarHalf } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";

// 댓글 타입 정의
type Comment = {
  id?: string;
  _id?: string;
  nickname: string;
  content: string;
  timestamp: number;
  mbtiType: string;
  rating: number; // 별점 (1-5)
};

export default function CommentSection() {
  // 댓글 관련 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState(5); // 기본값 5점
  const [isLoading, setIsLoading] = useState(false);
  const [commentModalOpen, setCommentModalOpen] = useState(false);
  const commentsPerPage = 5;
  
  useEffect(() => {
    // 댓글 로드
    loadComments();
  }, []);

  // 댓글 로드 함수
  const loadComments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/comments');
      
      if (!response.ok) {
        throw new Error('댓글을 가져오는데 실패했습니다');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setComments(data.data);
      } else {
        console.error('댓글 로드 실패:', data.message);
      }
    } catch (error) {
      console.error('댓글 로드 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 댓글 추가 함수
  const addComment = async () => {
    if (!nickname.trim() || !commentContent.trim()) return;
    
    try {
      setIsLoading(true);
      
      const commentData = {
        nickname: nickname.trim(),
        content: commentContent.trim(),
        timestamp: Date.now(),
        mbtiType: "메인페이지", // 메인 페이지에서는 MBTI 결과가 없음
        rating: rating
      };
      
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData),
      });
      
      if (!response.ok) {
        throw new Error('댓글 추가에 실패했습니다');
      }
      
      const data = await response.json();
      
      if (data.success) {
        // 댓글 목록 새로고침
        loadComments();
        
        // 입력 필드 초기화
        setNickname("");
        setCommentContent("");
        setRating(5);
        setCommentModalOpen(false); // 모달 닫기
      } else {
        console.error('댓글 추가 실패:', data.message);
      }
    } catch (error) {
      console.error('댓글 추가 중 오류 발생:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 별점 렌더링 함수
  const renderStars = (rating: number = 5) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    // 꽉 찬 별 추가
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // 반쪽 별 추가
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" className="w-4 h-4 fill-yellow-400 text-yellow-400" />
      );
    }
    
    // 빈 별 추가
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star key={`empty-${i}`} className="w-4 h-4 text-yellow-400/40" />
      );
    }
    
    return stars;
  };
  
  // 페이지네이션 관련 데이터
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  // 페이지 변경 함수
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="w-full max-w-md mx-auto mt-8 border-t border-border/30 pt-4">
      <h3 className="text-lg font-semibold mb-3 text-center">
        테스트를 시작하기 전에 의견을 남겨보세요
      </h3>
      
      {/* 댓글 입력 버튼 */}
      <div className="mb-4 text-center">
        <Button 
          onClick={() => setCommentModalOpen(true)} 
          className="px-6 py-2"
          disabled={isLoading}
        >
          {isLoading ? "로딩 중..." : "새 댓글 작성하기"}
        </Button>
      </div>
      
      {/* 모달 댓글 폼 */}
      <Dialog open={commentModalOpen} onOpenChange={setCommentModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">댓글 남기기</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 my-4">
            <div>
              <input
                type="text"
                placeholder="닉네임"
                className="w-full p-2 rounded-md bg-muted/30 border border-border/30 text-foreground"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                maxLength={20}
                disabled={isLoading}
              />
            </div>
            {/* 별점 선택 UI */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">별점:</span>
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1"
                    disabled={isLoading}
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'text-yellow-400/40'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-sm text-foreground/70">({rating}점)</span>
            </div>
            <div>
              <textarea
                placeholder="내용을 입력하세요..."
                className="w-full p-2 rounded-md bg-muted/30 border border-border/30 text-foreground min-h-[80px]"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                maxLength={200}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setCommentModalOpen(false)} className="w-full sm:w-auto bg-muted/50 hover:bg-muted/70 text-foreground" disabled={isLoading}>
              취소
            </Button>
            <Button onClick={addComment} className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? "처리 중..." : "등록하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* 댓글 목록 */}
      <div className="space-y-3">
        <h4 className="font-medium">
          댓글 ({comments.length})
        </h4>
        
        {isLoading && comments.length === 0 ? (
          <p className="text-center text-foreground/70 text-sm py-4">
            댓글을 불러오는 중...
          </p>
        ) : currentComments.length > 0 ? (
          <div className="space-y-3">
            {currentComments.map((comment) => (
              <div key={comment.id || comment._id} className="p-3 bg-muted/20 rounded-md border border-border/20">
                <div className="flex justify-between items-center mb-2">
                  <div className="font-medium text-foreground/90">
                    {comment.nickname} 
                    {comment.mbtiType !== "메인페이지" && (
                      <span className="text-xs text-primary ml-1">({comment.mbtiType})</span>
                    )}
                  </div>
                  <div className="text-xs text-foreground/50">
                    {new Date(comment.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center mb-2">
                  <div className="flex items-center">
                    {renderStars(comment.rating)}
                  </div>
                  <span className="text-xs ml-2 text-foreground/70">
                    {(comment.rating || 5).toFixed(1)}
                  </span>
                </div>
                <p className="text-sm text-foreground/80">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-foreground/70 text-sm py-4">
            아직 댓글이 없습니다. 첫 번째 댓글을 남겨보세요!
          </p>
        )}
        
        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-1 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted/30 hover:bg-muted/50 text-foreground/70'
                }`}
              >
                {number}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 