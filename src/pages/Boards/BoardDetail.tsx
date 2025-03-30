import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ThumbsUp,
  MessageSquare,
  Share2,
  Bookmark,
  MoreHorizontal,
  ArrowLeft,
  Send,
  Edit,
  Trash2,
  Flag,
  Eye,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { useAuth } from "../../contexts/useAuth";

// Mock data for a single board
const mockBoardDetail = {
  id: 1,
  title: "인공지능의 미래에 대한 토론",
  content: `
    <p>안녕하세요, 여러분!</p>
    <p>최근 인공지능 기술의 급속한 발전으로 우리 사회는 큰 변화를 맞이하고 있습니다. ChatGPT, DALL-E, Midjourney와 같은 생성형 AI의 등장은 많은 산업 분야에 혁명적인 변화를 가져오고 있죠.</p>
    <p>이러한 변화 속에서 우리가 고민해봐야 할 몇 가지 질문들이 있습니다:</p>
    <ul>
      <li>AI가 인간의 일자리를 대체할까요? 그렇다면 어떤 직업이 가장 위험할까요?</li>
      <li>AI 윤리와 규제는 어떻게 이루어져야 할까요?</li>
      <li>AI와 인간의 공존을 위해 우리 사회는 어떻게 준비해야 할까요?</li>
    </ul>
    <p>여러분의 생각과 의견을 자유롭게 나눠주세요. 다양한 관점에서의 토론을 통해 함께 미래를 준비해봅시다!</p>
  `,
  category: "기술",
  author: {
    id: "author1",
    name: "테크마스터",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "AI 및 신기술 전문가, 10년차 개발자",
  },
  createdAt: "2023-11-15T09:30:00",
  updatedAt: "2023-11-15T11:45:00",
  likes: 128,
  isLiked: false,
  isBookmarked: false,
  comments: [
    {
      id: 1,
      author: {
        id: "user1",
        name: "AI연구자",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "AI가 일자리를 완전히 대체하기보다는 협업하는 방식으로 발전할 것 같습니다. 반복적이고 창의성이 덜 요구되는 업무는 AI가 담당하고, 인간은 더 창의적이고 감성적인 영역에 집중하게 될 것 같아요.",
      createdAt: "2023-11-15T10:15:00",
      likes: 24,
    },
    {
      id: 2,
      author: {
        id: "user2",
        name: "미래학자",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "AI 윤리와 규제는 정말 중요한 문제입니다. 기술 발전 속도에 비해 법과 제도는 항상 뒤처지는 경향이 있어요. 국제적인 협력을 통해 AI 개발과 활용에 대한 가이드라인을 마련하는 것이 시급합니다.",
      createdAt: "2023-11-15T12:30:00",
      likes: 18,
    },
    {
      id: 3,
      author: {
        id: "user3",
        name: "교육전문가",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "AI 시대에 맞는 교육 시스템의 변화도 필요합니다. 암기식 교육보다는 창의성, 비판적 사고, 문제 해결 능력을 키우는 교육이 더욱 중요해질 것입니다.",
      createdAt: "2023-11-15T14:45:00",
      likes: 31,
    },
  ],
  views: 456,
  relatedBoards: [
    {
      id: 6,
      title: "프로그래밍 언어 트렌드 2024",
      description: "올해와 내년에 주목해야 할 프로그래밍 언어와 기술 스택은?",
      category: "기술",
      author: {
        name: "코드마스터",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-11-10T14:25:00",
      likes: 143,
      comments: 38,
    },
    {
      id: 7,
      title: "메타버스와 가상현실의 현재와 미래",
      description:
        "메타버스 기술의 현주소와 앞으로의 발전 방향에 대해 논의합니다.",
      category: "기술",
      author: {
        name: "VR전문가",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      createdAt: "2023-11-08T16:40:00",
      likes: 98,
      comments: 27,
    },
  ],
};

// Format date to readable format
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};

// Format relative time
const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}초 전`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 2592000)
    return `${Math.floor(diffInSeconds / 86400)}일 전`;
  if (diffInSeconds < 31536000)
    return `${Math.floor(diffInSeconds / 2592000)}개월 전`;
  return `${Math.floor(diffInSeconds / 31536000)}년 전`;
};

const BoardDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isAuthor = isLoggedIn && user.userId === mockBoardDetail.author.id;

  const [board, setBoard] = useState(mockBoardDetail);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Simulate fetching board data
  useEffect(() => {
    // In a real app, you would fetch the board data based on the id
    console.log(`Fetching board with id: ${id}`);
    // For now, we'll just use our mock data
  }, [id]);

  const handleLike = () => {
    if (!isLoggedIn) {
      // Redirect to login or show login prompt
      return;
    }

    setBoard((prev) => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }));
  };

  const handleBookmark = () => {
    if (!isLoggedIn) {
      // Redirect to login or show login prompt
      return;
    }

    setBoard((prev) => ({
      ...prev,
      isBookmarked: !prev.isBookmarked,
    }));
  };

  const handleShare = () => {
    // In a real app, you would implement sharing functionality
    navigator.clipboard.writeText(window.location.href);
    alert("링크가 클립보드에 복사되었습니다!");
  };

  const handleSubmitComment = () => {
    if (!isLoggedIn || !newComment.trim()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newCommentObj = {
        id: board.comments.length + 1,
        author: {
          id: user.userId,
          name: user.username,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: newComment,
        createdAt: new Date().toISOString(),
        likes: 0,
      };

      setBoard((prev) => ({
        ...prev,
        comments: [newCommentObj, ...prev.comments],
      }));

      setNewComment("");
      setIsSubmitting(false);
    }, 500);
  };

  const handleDeleteBoard = () => {
    if (confirm("정말로 이 게시글을 삭제하시겠습니까?")) {
      // In a real app, you would call an API to delete the board
      navigate("/boards");
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Back button */}
      <Button
        variant='ghost'
        className='mb-6 text-gray-400 hover:text-white'
        onClick={() => navigate("/boards")}
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        게시판으로 돌아가기
      </Button>

      {/* Board header */}
      <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
        <div className='flex justify-between items-start mb-4'>
          <Badge className='bg-blue-600 hover:bg-blue-700'>
            {board.category}
          </Badge>

          {isAuthor ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <MoreHorizontal className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align='end'
                className='bg-[#1e2642] border-gray-700 text-white'
              >
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={() => navigate(`/boards/${id}/edit`)}
                >
                  <Edit className='mr-2 h-4 w-4' />
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-gray-700' />
                <DropdownMenuItem
                  className='cursor-pointer text-red-500 focus:text-red-500'
                  onClick={handleDeleteBoard}
                >
                  <Trash2 className='mr-2 h-4 w-4' />
                  삭제하기
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant='ghost'
              size='sm'
              className='h-8 w-8 p-0 text-gray-400 hover:text-white'
            >
              <Flag className='h-4 w-4' />
            </Button>
          )}
        </div>

        <h1 className='text-2xl md:text-3xl font-bold text-white mb-4'>
          {board.title}
        </h1>

        <div className='flex items-center mb-6'>
          <Avatar className='h-10 w-10 mr-3'>
            <AvatarImage src={board.author.avatar} alt={board.author.name} />
            <AvatarFallback>{board.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className='font-medium text-white'>{board.author.name}</div>
            <div className='text-sm text-gray-400'>
              {formatDate(board.createdAt)}
              {board.updatedAt !== board.createdAt &&
                ` (${formatRelativeTime(board.updatedAt)} 수정됨)`}
            </div>
          </div>
        </div>

        <div className='flex items-center text-sm text-gray-400 mb-2'>
          <Eye className='h-4 w-4 mr-1' />
          <span className='mr-4'>조회 {board.views}</span>
          <MessageSquare className='h-4 w-4 mr-1' />
          <span className='mr-4'>댓글 {board.comments.length}</span>
          <ThumbsUp className='h-4 w-4 mr-1' />
          <span>좋아요 {board.likes}</span>
        </div>
      </div>

      {/* Board content */}
      <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
        <div
          className='prose prose-invert max-w-none'
          dangerouslySetInnerHTML={{ __html: board.content }}
        />

        <div className='flex flex-wrap gap-2 mt-8'>
          <Button
            variant={board.isLiked ? "default" : "outline"}
            className={`${
              board.isLiked
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-gray-700 hover:border-blue-500 hover:text-blue-400"
            }`}
            onClick={handleLike}
          >
            <ThumbsUp className='mr-2 h-4 w-4' />
            좋아요 {board.likes}
          </Button>

          <Button
            variant='outline'
            className='border-gray-700 hover:border-blue-500 hover:text-blue-400'
            onClick={handleShare}
          >
            <Share2 className='mr-2 h-4 w-4' />
            공유하기
          </Button>

          <Button
            variant={board.isBookmarked ? "default" : "outline"}
            className={`${
              board.isBookmarked
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-gray-700 hover:border-blue-500 hover:text-blue-400"
            }`}
            onClick={handleBookmark}
          >
            <Bookmark className='mr-2 h-4 w-4' />
            {board.isBookmarked ? "저장됨" : "저장하기"}
          </Button>
        </div>
      </div>

      {/* Author info */}
      <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
        <div className='flex items-center'>
          <Avatar className='h-16 w-16 mr-4'>
            <AvatarImage src={board.author.avatar} alt={board.author.name} />
            <AvatarFallback>{board.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className='text-lg font-medium text-white mb-1'>
              {board.author.name}
            </h3>
            <p className='text-gray-400'>{board.author.bio}</p>
          </div>
        </div>
      </div>

      {/* Comments section */}
      <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
        <h2 className='text-xl font-bold text-white mb-6'>
          댓글 {board.comments.length}개
        </h2>

        {/* Comment form */}
        {isLoggedIn ? (
          <div className='mb-6'>
            <Textarea
              placeholder='댓글을 작성해주세요...'
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className='bg-[#151b33] border-gray-700 text-white mb-3 min-h-[100px]'
            />
            <div className='flex justify-end'>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                className='bg-blue-600 hover:bg-blue-700'
              >
                <Send className='mr-2 h-4 w-4' />
                댓글 작성
              </Button>
            </div>
          </div>
        ) : (
          <div className='bg-[#151b33] rounded-lg p-4 mb-6 text-center'>
            <p className='text-gray-400 mb-3'>
              댓글을 작성하려면 로그인이 필요합니다.
            </p>
            <Link to='/signin'>
              <Button className='bg-blue-600 hover:bg-blue-700'>
                로그인하기
              </Button>
            </Link>
          </div>
        )}

        <Separator className='bg-gray-700 mb-6' />

        {/* Comments list */}
        <div className='space-y-6'>
          {board.comments.map((comment) => (
            <div key={comment.id} className='bg-[#151b33] rounded-lg p-4'>
              <div className='flex justify-between mb-3'>
                <div className='flex items-center'>
                  <Avatar className='h-8 w-8 mr-2'>
                    <AvatarImage
                      src={comment.author.avatar}
                      alt={comment.author.name}
                    />
                    <AvatarFallback>
                      {comment.author.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-medium text-white'>
                      {comment.author.name}
                    </div>
                    <div className='text-xs text-gray-400'>
                      {formatRelativeTime(comment.createdAt)}
                    </div>
                  </div>
                </div>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 w-8 p-0 text-gray-400 hover:text-white'
                >
                  <ThumbsUp className='h-4 w-4' />
                </Button>
              </div>
              <p className='text-gray-300'>{comment.content}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Related boards */}
      <div className='bg-[#1e2642] rounded-lg p-6'>
        <h2 className='text-xl font-bold text-white mb-6'>관련 게시글</h2>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {board.relatedBoards.map((relatedBoard) => (
            <Link to={`/boards/${relatedBoard.id}`} key={relatedBoard.id}>
              <Card className='bg-[#151b33] border-gray-700 hover:border-blue-500 transition-colors h-full'>
                <CardHeader className='pb-2'>
                  <div className='flex justify-between items-start'>
                    <Badge className='bg-blue-600 hover:bg-blue-700 mb-2'>
                      {relatedBoard.category}
                    </Badge>
                    <span className='text-sm text-gray-400'>
                      {formatRelativeTime(relatedBoard.createdAt)}
                    </span>
                  </div>
                  <CardTitle className='text-lg text-white line-clamp-2'>
                    {relatedBoard.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className='text-gray-300 line-clamp-2'>
                    {relatedBoard.description}
                  </p>
                </CardContent>
                <CardFooter className='border-t border-gray-700 pt-3'>
                  <div className='flex items-center text-gray-400 text-sm'>
                    <ThumbsUp className='h-4 w-4 mr-1' />
                    <span className='mr-3'>{relatedBoard.likes}</span>
                    <MessageSquare className='h-4 w-4 mr-1' />
                    <span>{relatedBoard.comments}</span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BoardDetailPage;
