"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { getMBTIResult, useMBTI } from "@/app/context/MBTIContext";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Star, StarHalf } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/app/components/ui/dialog";

// 참여자 통계 타입 정의
type MBTIStats = {
  totalParticipants: number;
  typeCount: Record<string, number>;
};

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

// 모든 MBTI 유형 배열
const ALL_MBTI_TYPES = [
  "ISTJ", "ISFJ", "INFJ", "INTJ",
  "ISTP", "ISFP", "INFP", "INTP",
  "ESTP", "ESFP", "ENFP", "ENTP",
  "ESTJ", "ESFJ", "ENFJ", "ENTJ"
];

export const ResultCard = () => {
  const { state, resetTest } = useMBTI();
  const { result } = state;
  const [stats, setStats] = useState<MBTIStats>({
    totalParticipants: 0,
    typeCount: {}
  });
  
  // 댓글 관련 상태
  const [comments, setComments] = useState<Comment[]>([]);
  const [nickname, setNickname] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rating, setRating] = useState(5); // 기본값 5점
  const commentsPerPage = 5;

  // 모달 상태 관리
  const [commentModalOpen, setCommentModalOpen] = useState(false);

  // 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(false);

  const mbtiResult = getMBTIResult(result);

  // 테스트 결과 저장 및 통계 로드
  useEffect(() => {
    if (result) {
      // 기존 통계 데이터 로드
      const storedStats = localStorage.getItem('mbti-stats');
      let currentStats: MBTIStats = storedStats 
        ? JSON.parse(storedStats) 
        : { totalParticipants: 0, typeCount: {} };
      
      // 현재 결과 추가
      currentStats.totalParticipants += 1;
      currentStats.typeCount[result] = (currentStats.typeCount[result] || 0) + 1;
      
      // 통계 업데이트 및 저장
      setStats(currentStats);
      localStorage.setItem('mbti-stats', JSON.stringify(currentStats));
      
      // 댓글 로드
      loadComments();
    }
  }, [result]);

  // 댓글 로드 함수 수정
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

  // 댓글 추가 함수 수정
  const addComment = async () => {
    if (!nickname.trim() || !commentContent.trim() || !result) return;
    
    try {
      setIsLoading(true);
      
      const commentData = {
        nickname: nickname.trim(),
        content: commentContent.trim(),
        timestamp: Date.now(),
        mbtiType: result,
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

  const handleRetakeTest = () => {
    resetTest();
  };

  // MBTI 유형별 백분율 계산
  const getPercentage = (type: string) => {
    if (stats.totalParticipants === 0) return 0;
    return Math.round(((stats.typeCount[type] || 0) / stats.totalParticipants) * 100);
  };

  // 막대 그래프 너비 계산
  const getBarWidth = (type: string) => {
    const percentage = getPercentage(type);
    return percentage > 0 ? `${percentage}%` : '2%'; // 최소 너비 설정
  };
  
  // 참여한 MBTI 유형만 필터링
  const participatedTypes = ALL_MBTI_TYPES.filter(type => stats.typeCount[type] && stats.typeCount[type] > 0);
  
  // 페이지네이션 관련 데이터
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(comments.length / commentsPerPage);

  // 페이지 변경 함수
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
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

  if (!mbtiResult) {
    return (
      <Card className="w-full max-w-md mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">결과를 불러올 수 없습니다</CardTitle>
          <CardDescription>
            테스트를 다시 시작해주세요.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/">
            <Button onClick={handleRetakeTest} className="w-full">
              테스트 다시 하기
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg bg-card/90 backdrop-blur-md">
      <CardHeader className="text-center pb-0">
        <CardTitle className="text-xl font-medium text-primary-foreground/80 mb-2">
          당신의 MBTI 유형은
        </CardTitle>
        <CardTitle className="text-4xl font-bold text-primary">
          {mbtiResult.type}
        </CardTitle>
        <CardDescription className="mt-4 text-base">
          {mbtiResult.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div>
          <h3 className="text-lg font-semibold mb-3 text-center text-primary-foreground/90">궁합이 좋은 유형</h3>
          <div className="grid grid-cols-2 gap-3">
            {mbtiResult.compatibleTypes.map((type) => {
              const compatibleResult = getMBTIResult(type);
              return (
                <div key={type} className="border border-border/50 rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <p className="font-bold text-primary text-center mb-1">{type}</p>
                  <p className="text-sm text-foreground/80">
                    {compatibleResult?.description.substring(0, 30)}...
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* MBTI 유형 분포도 */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-3 text-center text-primary-foreground/90">
            지금까지 참여자 수 {stats.totalParticipants}명
          </h3>
          <div className="space-y-2">
            {participatedTypes.length > 0 ? (
              participatedTypes.map(type => (
                <div key={type} className={`relative ${type === mbtiResult.type ? 'bg-primary/10 rounded-md p-1' : ''}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-sm font-medium ${type === mbtiResult.type ? 'text-primary font-bold' : ''}`}>
                      {type}
                    </span>
                    <span className="text-xs text-foreground/70">
                      {stats.typeCount[type] || 0}명 ({getPercentage(type)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${type === mbtiResult.type ? 'bg-primary' : 'bg-secondary/70'}`}
                      style={{ width: getBarWidth(type) }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-foreground/70 text-sm">아직 참여자가 없습니다.</p>
            )}
          </div>
        </div>
        
        {/* 댓글 영역 */}
        <div className="mt-6 border-t border-border/30 pt-4">
          <h3 className="text-lg font-semibold mb-3 text-center text-primary-foreground/90">
            댓글 남기기
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
                        {comment.nickname} <span className="text-xs text-primary">({comment.mbtiType})</span>
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
      </CardContent>
      <CardFooter className="pt-2">
        <Link href="/" className="w-full">
          <Button onClick={handleRetakeTest} className="w-full py-6 text-lg">
            테스트 다시 하기
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}; 