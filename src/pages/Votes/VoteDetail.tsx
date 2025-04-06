import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  MessageSquare,
  ThumbsUp,
  Flag,
  BarChart3,
  PieChart,
  Eye,
  MoreHorizontal,
  Edit,
  Trash2,
  Send,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
import { toast } from "sonner";

// Mock vote data
const mockVoteDetail = {
  id: "1",
  title: "가장 배우기 쉬운 프로그래밍 언어는?",
  description:
    "프로그래밍을 처음 시작하는 사람들에게 가장 추천하는 언어를 선택해주세요. 여러분의 경험과 의견이 많은 초보자들에게 도움이 될 것입니다.",
  category: "프로그래밍",
  author: {
    id: "user1",
    name: "테크마스터",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "AI 및 신기술 전문가, 10년차 개발자",
  },
  createdAt: "2023-11-05T10:30:00",
  endDate: "2023-12-05T10:30:00",
  isActive: true,
  options: [
    { id: "1", text: "Python", votes: 245, color: "#3498db" },
    { id: "2", text: "JavaScript", votes: 189, color: "#f1c40f" },
    { id: "3", text: "Java", votes: 112, color: "#e74c3c" },
    { id: "4", text: "C#", votes: 87, color: "#2ecc71" },
  ],
  totalVotes: 633,
  userVoted: null, // null if user hasn't voted, otherwise the option id
  views: 1245,
  likes: 87,
  isLiked: false,
  comments: [
    {
      id: "1",
      author: {
        id: "user2",
        name: "코딩초보",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "저는 파이썬으로 시작했는데 정말 쉽고 재미있었어요! 문법이 직관적이고 라이브러리도 풍부해서 초보자에게 강추합니다.",
      createdAt: "2023-11-06T14:25:00",
      likes: 12,
    },
    {
      id: "2",
      author: {
        id: "user3",
        name: "웹개발자",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "웹 개발을 목표로 한다면 JavaScript가 최고의 선택이라고 생각해요. 브라우저에서 바로 결과를 볼 수 있고, 요즘은 백엔드도 Node.js로 할 수 있으니까요.",
      createdAt: "2023-11-07T09:15:00",
      likes: 8,
    },
    {
      id: "3",
      author: {
        id: "user4",
        name: "자바마스터",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content:
        "Java는 기업에서 많이 사용하는 언어라 취업을 목표로 한다면 좋은 선택입니다. 객체지향 개념을 확실히 배울 수 있고, 안드로이드 앱 개발도 가능하죠.",
      createdAt: "2023-11-08T16:40:00",
      likes: 5,
    },
  ],
  relatedVotes: [
    {
      id: "2",
      title: "2024년에 가장 전망 있는 기술 분야는?",
      category: "기술 트렌드",
      totalVotes: 733,
      options: [
        { id: "1", text: "인공지능/머신러닝", votes: 312 },
        { id: "2", text: "블록체인", votes: 145 },
        { id: "3", text: "AR/VR", votes: 178 },
        { id: "4", text: "양자 컴퓨팅", votes: 98 },
      ],
    },
    {
      id: "3",
      title: "개발자가 가장 선호하는 작업 환경은?",
      category: "개발 문화",
      totalVotes: 702,
      options: [
        { id: "1", text: "재택근무", votes: 287 },
        { id: "2", text: "사무실 근무", votes: 124 },
        { id: "3", text: "하이브리드", votes: 215 },
        { id: "4", text: "코워킹 스페이스", votes: 76 },
      ],
    },
    {
      id: "4",
      title: "가장 많이 사용하는 코드 에디터는?",
      category: "개발 도구",
      totalVotes: 845,
      options: [
        { id: "1", text: "Visual Studio Code", votes: 412 },
        { id: "2", text: "IntelliJ IDEA", votes: 215 },
        { id: "3", text: "Sublime Text", votes: 98 },
        { id: "4", text: "Vim", votes: 120 },
      ],
    },
  ],
};

// Format date
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

// Calculate time remaining
const calculateTimeRemaining = (endDateString: string) => {
  const endDate = new Date(endDateString);
  const now = new Date();

  if (now > endDate) return "투표 종료";

  const diffInSeconds = Math.floor((endDate.getTime() - now.getTime()) / 1000);
  const days = Math.floor(diffInSeconds / 86400);
  const hours = Math.floor((diffInSeconds % 86400) / 3600);
  const minutes = Math.floor((diffInSeconds % 3600) / 60);

  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 ${minutes}분 남음`;
  return `${minutes}분 남음`;
};

const VoteDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  // const { user } = useAuth();
  const user = { username: "test", userId: "1" };
  // const { toast } = useToast();
  const isLoggedIn = !!user;

  const [vote, setVote] = useState(mockVoteDetail);
  const [selectedOption, setSelectedOption] = useState<string | null>(
    vote.userVoted
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const isAuthor = isLoggedIn && user.userId === vote.author.id;
  const canVote = isLoggedIn && vote.isActive && !vote.userVoted;

  // Simulate fetching vote data
  useEffect(() => {
    // In a real app, you would fetch the vote data based on the id
    console.log(`Fetching vote with id: ${id}`);
    // For now, we'll just use our mock data
  }, [id]);

  const handleVote = () => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다", {
        description: "투표에 참여하려면 로그인해주세요.",
      });
      return;
    }

    if (!selectedOption) {
      toast.error("옵션을 선택해주세요", {
        description: "투표하기 전에 옵션을 선택해야 합니다.",
      });
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setVote((prev) => {
        const updatedOptions = prev.options.map((option) => {
          if (option.id === selectedOption) {
            return { ...option, votes: option.votes + 1 };
          }
          return option;
        });

        return {
          ...prev,
          options: updatedOptions,
          totalVotes: prev.totalVotes + 1,
          userVoted: selectedOption,
        };
      });

      setIsSubmitting(false);

      toast.success("투표 완료!", {
        description: "성공적으로 투표했습니다.",
      });
    }, 1000);
  };

  const handleLike = () => {
    if (!isLoggedIn) {
      toast.error("로그인이 필요합니다", {
        description: "좋아요를 누르려면 로그인해주세요.",
      });
      return;
    }

    setVote((prev) => ({
      ...prev,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
      isLiked: !prev.isLiked,
    }));
  };

  const handleShare = () => {
    // In a real app, you would implement sharing functionality
    navigator.clipboard.writeText(window.location.href);
    toast.success("링크 복사됨", {
      description: "투표 링크가 클립보드에 복사되었습니다.",
    });
  };

  const handleSubmitComment = () => {
    if (!isLoggedIn || !newComment.trim()) {
      return;
    }

    setIsSubmittingComment(true);

    // Simulate API call
    setTimeout(() => {
      const newCommentObj = {
        id: (vote.comments.length + 1).toString(),
        author: {
          id: user.userId,
          name: user.username,
          avatar: "/placeholder.svg?height=40&width=40",
        },
        content: newComment,
        createdAt: new Date().toISOString(),
        likes: 0,
      };

      setVote((prev) => ({
        ...prev,
        comments: [newCommentObj, ...prev.comments],
      }));

      setNewComment("");
      setIsSubmittingComment(false);

      toast.success("댓글 작성 완료", {
        description: "댓글이 성공적으로 등록되었습니다.",
      });
    }, 500);
  };

  const handleDeleteVote = () => {
    if (confirm("정말로 이 투표를 삭제하시겠습니까?")) {
      // In a real app, you would call an API to delete the vote
      navigate("/votes");
      toast.success("투표 삭제됨", {
        description: "투표가 성공적으로 삭제되었습니다.",
      });
    }
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Back button */}
      <Button
        variant='ghost'
        className='mb-6 text-gray-400 hover:text-white'
        onClick={() => navigate("/votes")}
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        투표 목록으로 돌아가기
      </Button>

      {/* Vote header */}
      <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
        <div className='flex justify-between items-start mb-4'>
          <div className='flex items-center gap-2'>
            <Badge className='bg-blue-600 hover:bg-blue-700'>
              {vote.category}
            </Badge>
            <Badge
              className={
                vote.isActive
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-600 hover:bg-gray-700"
              }
            >
              {vote.isActive ? "진행 중" : "종료됨"}
            </Badge>
          </div>

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
                  onClick={() => navigate(`/votes/${id}/edit`)}
                >
                  <Edit className='mr-2 h-4 w-4' />
                  수정하기
                </DropdownMenuItem>
                <DropdownMenuSeparator className='bg-gray-700' />
                <DropdownMenuItem
                  className='cursor-pointer text-red-500 focus:text-red-500'
                  onClick={handleDeleteVote}
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
          {vote.title}
        </h1>
        <p className='text-gray-300 mb-6'>{vote.description}</p>

        <div className='flex items-center mb-6'>
          <Avatar className='h-10 w-10 mr-3'>
            <AvatarImage src={vote.author.avatar} alt={vote.author.name} />
            <AvatarFallback>{vote.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className='font-medium text-white'>{vote.author.name}</div>
            <div className='text-sm text-gray-400'>
              {formatDate(vote.createdAt)}
            </div>
          </div>
        </div>

        <div className='flex flex-wrap gap-4 text-sm text-gray-400'>
          <div className='flex items-center'>
            <Calendar className='h-4 w-4 mr-1' />
            <span>마감: {formatDate(vote.endDate)}</span>
          </div>
          <div className='flex items-center'>
            <Clock className='h-4 w-4 mr-1' />
            <span>{calculateTimeRemaining(vote.endDate)}</span>
          </div>
          <div className='flex items-center'>
            <Eye className='h-4 w-4 mr-1' />
            <span>조회 {vote.views}</span>
          </div>
          <div className='flex items-center'>
            <ThumbsUp className='h-4 w-4 mr-1' />
            <span>좋아요 {vote.likes}</span>
          </div>
          <div className='flex items-center'>
            <MessageSquare className='h-4 w-4 mr-1' />
            <span>댓글 {vote.comments.length}</span>
          </div>
        </div>
      </div>

      {/* Vote options */}
      <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold text-white'>투표하기</h2>
          <div className='flex items-center gap-2'>
            <Button
              variant='outline'
              size='sm'
              className={`h-8 border-gray-700 ${
                chartType === "bar"
                  ? "bg-blue-900/30 text-blue-400 border-blue-700"
                  : "hover:text-blue-400"
              }`}
              onClick={() => setChartType("bar")}
            >
              <BarChart3 className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              className={`h-8 border-gray-700 ${
                chartType === "pie"
                  ? "bg-blue-900/30 text-blue-400 border-blue-700"
                  : "hover:text-blue-400"
              }`}
              onClick={() => setChartType("pie")}
            >
              <PieChart className='h-4 w-4' />
            </Button>
          </div>
        </div>

        {vote.userVoted ? (
          // User already voted - show results
          <div className='space-y-4'>
            {vote.options.map((option) => (
              <div key={option.id} className='space-y-1'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center'>
                    <div
                      className={`w-4 h-4 rounded-full mr-2`}
                      style={{ backgroundColor: option.color }}
                    />
                    <span
                      className={`text-white font-medium ${
                        option.id === vote.userVoted ? "text-blue-400" : ""
                      }`}
                    >
                      {option.text}{" "}
                      {option.id === vote.userVoted && "(내 투표)"}
                    </span>
                  </div>
                  <span className='text-gray-400'>
                    {option.votes} 표 (
                    {Math.round((option.votes / vote.totalVotes) * 100)}%)
                  </span>
                </div>
                <div className='w-full bg-[#151b33] rounded-full h-3'>
                  <div
                    className='h-3 rounded-full transition-all duration-500 ease-out'
                    style={{
                      width: `${(option.votes / vote.totalVotes) * 100}%`,
                      backgroundColor: option.color,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className='mt-4 text-right text-sm text-gray-400'>
              총 {vote.totalVotes}명 참여
            </div>
          </div>
        ) : (
          // User hasn't voted yet - show voting form
          <div>
            <div className='space-y-3 mb-6'>
              {vote.options.map((option) => (
                <div
                  key={option.id}
                  className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                    selectedOption === option.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/5"
                  }`}
                  onClick={() => vote.isActive && setSelectedOption(option.id)}
                >
                  <div className='flex items-center'>
                    <div
                      className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                        selectedOption === option.id
                          ? "border-blue-500"
                          : "border-gray-500"
                      }`}
                    >
                      {selectedOption === option.id && (
                        <div className='w-3 h-3 rounded-full bg-blue-500' />
                      )}
                    </div>
                    <span className='text-white'>{option.text}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className='flex justify-end'>
              <Button
                onClick={handleVote}
                disabled={!canVote || !selectedOption || isSubmitting}
                className='bg-blue-600 hover:bg-blue-700'
              >
                {isSubmitting ? "투표 중..." : "투표하기"}
              </Button>
            </div>

            {!vote.isActive && (
              <div className='mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-md text-yellow-300 text-sm'>
                이 투표는 이미 종료되었습니다. 결과만 확인할 수 있습니다.
              </div>
            )}

            {!isLoggedIn && (
              <div className='mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-md text-blue-300 text-sm'>
                투표에 참여하려면{" "}
                <Link to='/signin' className='underline font-medium'>
                  로그인
                </Link>
                이 필요합니다.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Vote results visualization */}
      {vote.userVoted && (
        <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
          <h2 className='text-xl font-bold text-white mb-6'>투표 결과</h2>

          <Tabs defaultValue='chart' className='mb-6'>
            <TabsList className='bg-[#151b33] h-auto'>
              <TabsTrigger
                value='chart'
                className='data-[state=active]:bg-blue-600'
              >
                차트
              </TabsTrigger>
              <TabsTrigger
                value='table'
                className='data-[state=active]:bg-blue-600'
              >
                테이블
              </TabsTrigger>
            </TabsList>

            <TabsContent value='chart' className='mt-4'>
              {chartType === "bar" ? (
                <div className='h-[300px] flex items-end justify-around gap-4 mt-8 mb-4'>
                  {vote.options.map((option) => (
                    <div
                      key={option.id}
                      className='flex flex-col items-center w-full'
                    >
                      <div
                        className='w-full rounded-t transition-all duration-500 ease-out'
                        style={{
                          height: `${
                            (option.votes /
                              Math.max(...vote.options.map((o) => o.votes))) *
                            250
                          }px`,
                          backgroundColor: option.color,
                          minHeight: "20px",
                        }}
                      />
                      <div className='mt-2 text-center'>
                        <div className='text-white text-sm font-medium'>
                          {option.text}
                        </div>
                        <div className='text-gray-400 text-xs'>
                          {option.votes} 표
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className='flex justify-center my-8'>
                  <div className='relative w-[300px] h-[300px]'>
                    {/* This is a simplified pie chart representation */}
                    <svg
                      viewBox='0 0 100 100'
                      className='w-full h-full -rotate-90'
                    >
                      {vote.options.map((option, index, array) => {
                        const percentage = option.votes / vote.totalVotes;
                        const previousPercentages = array
                          .slice(0, index)
                          .reduce(
                            (sum, o) => sum + o.votes / vote.totalVotes,
                            0
                          );

                        return (
                          <circle
                            key={option.id}
                            cx='50'
                            cy='50'
                            r='40'
                            fill='transparent'
                            stroke={option.color}
                            strokeWidth='20'
                            strokeDasharray={`${percentage * 251.2} 251.2`}
                            strokeDashoffset={`${-previousPercentages * 251.2}`}
                            className='transition-all duration-500 ease-out'
                          />
                        );
                      })}
                      <circle cx='50' cy='50' r='30' fill='#1e2642' />
                    </svg>
                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='text-center'>
                        <div className='text-white text-lg font-bold'>
                          {vote.totalVotes}
                        </div>
                        <div className='text-gray-400 text-xs'>총 투표수</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className='flex flex-wrap justify-center gap-4 mt-4'>
                {vote.options.map((option) => (
                  <div key={option.id} className='flex items-center'>
                    <div
                      className='w-3 h-3 rounded-full mr-2'
                      style={{ backgroundColor: option.color }}
                    />
                    <span className='text-gray-300 text-sm'>{option.text}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value='table' className='mt-4'>
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse'>
                  <thead>
                    <tr className='border-b border-gray-700'>
                      <th className='py-3 px-4 text-left text-gray-400'>
                        옵션
                      </th>
                      <th className='py-3 px-4 text-right text-gray-400'>
                        투표수
                      </th>
                      <th className='py-3 px-4 text-right text-gray-400'>
                        비율
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vote.options.map((option) => (
                      <tr key={option.id} className='border-b border-gray-700'>
                        <td className='py-3 px-4 text-white'>
                          <div className='flex items-center'>
                            <div
                              className='w-3 h-3 rounded-full mr-2'
                              style={{ backgroundColor: option.color }}
                            />
                            {option.text}
                          </div>
                        </td>
                        <td className='py-3 px-4 text-right text-white'>
                          {option.votes}
                        </td>
                        <td className='py-3 px-4 text-right text-white'>
                          {Math.round((option.votes / vote.totalVotes) * 100)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className='bg-[#151b33]'>
                      <td className='py-3 px-4 text-white font-medium'>총계</td>
                      <td className='py-3 px-4 text-right text-white font-medium'>
                        {vote.totalVotes}
                      </td>
                      <td className='py-3 px-4 text-right text-white font-medium'>
                        100%
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      )}

      {/* Action buttons */}
      <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
        <div className='flex flex-wrap gap-3'>
          <Button
            variant={vote.isLiked ? "default" : "outline"}
            className={`${
              vote.isLiked
                ? "bg-blue-600 hover:bg-blue-700"
                : "border-gray-700 hover:border-blue-500 hover:text-blue-400"
            }`}
            onClick={handleLike}
          >
            <ThumbsUp className='mr-2 h-4 w-4' />
            좋아요 {vote.likes}
          </Button>

          <Button
            variant='outline'
            className='border-gray-700 hover:border-blue-500 hover:text-blue-400'
            onClick={handleShare}
          >
            <Share2 className='mr-2 h-4 w-4' />
            공유하기
          </Button>
        </div>
      </div>

      {/* Comments section */}
      <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
        <h2 className='text-xl font-bold text-white mb-6'>
          댓글 {vote.comments.length}개
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
                disabled={!newComment.trim() || isSubmittingComment}
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
          {vote.comments.map((comment) => (
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

      {/* Related votes */}
      <div className='bg-[#1e2642] rounded-lg p-6'>
        <h2 className='text-xl font-bold text-white mb-6'>관련 투표</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {vote.relatedVotes.map((relatedVote) => (
            <Link to={`/votes/${relatedVote.id}`} key={relatedVote.id}>
              <Card className='bg-[#151b33] border-gray-700 hover:border-blue-500 transition-colors h-full'>
                <CardHeader className='pb-2'>
                  <Badge className='bg-blue-600 hover:bg-blue-700 mb-2 w-fit'>
                    {relatedVote.category}
                  </Badge>
                  <CardTitle className='text-lg text-white line-clamp-2'>
                    {relatedVote.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className='pb-2'>
                  <div className='space-y-2'>
                    {relatedVote.options.slice(0, 2).map((option) => (
                      <div
                        key={option.id}
                        className='flex justify-between text-xs'
                      >
                        <span className='text-gray-300'>{option.text}</span>
                        <span className='text-gray-400'>
                          {Math.round(
                            (option.votes / relatedVote.totalVotes) * 100
                          )}
                          %
                        </span>
                      </div>
                    ))}
                    {relatedVote.options.length > 2 && (
                      <div className='text-xs text-gray-500'>
                        + {relatedVote.options.length - 2}개 더 보기
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className='border-t border-gray-700 pt-3'>
                  <div className='text-sm text-gray-400'>
                    총 {relatedVote.totalVotes}명 참여
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

export default VoteDetailPage;
