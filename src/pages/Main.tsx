import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  TrendingUp,
  BarChart3,
  MessageSquare,
  Users,
  Vote,
  FileText,
  ChevronRight,
  ThumbsUp,
  Search,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

// Mock data for trending votes
const trendingVotes = [
  {
    id: "1",
    title: "가장 배우기 쉬운 프로그래밍 언어는?",
    category: "프로그래밍",
    totalVotes: 633,
    options: [
      { id: "1", text: "Python", votes: 245, color: "#3498db" },
      { id: "2", text: "JavaScript", votes: 189, color: "#f1c40f" },
      { id: "3", text: "Java", votes: 112, color: "#e74c3c" },
      { id: "4", text: "C#", votes: 87, color: "#2ecc71" },
    ],
    isActive: true,
    endDate: "2023-12-05T10:30:00",
  },
  {
    id: "2",
    title: "2024년에 가장 전망 있는 기술 분야는?",
    category: "기술 트렌드",
    totalVotes: 733,
    options: [
      { id: "1", text: "인공지능/머신러닝", votes: 312, color: "#9b59b6" },
      { id: "2", text: "블록체인", votes: 145, color: "#34495e" },
      { id: "3", text: "AR/VR", votes: 178, color: "#16a085" },
      { id: "4", text: "양자 컴퓨팅", votes: 98, color: "#d35400" },
    ],
    isActive: false,
    endDate: "2023-11-20T15:45:00",
  },
  {
    id: "6",
    title: "가장 좋아하는 프로그래밍 언어는?",
    category: "프로그래밍",
    totalVotes: 1145,
    options: [
      { id: "1", text: "JavaScript", votes: 278, color: "#3498db" },
      { id: "2", text: "Python", votes: 312, color: "#f1c40f" },
      { id: "3", text: "Java", votes: 156, color: "#e74c3c" },
      { id: "4", text: "C++", votes: 98, color: "#2ecc71" },
      { id: "5", text: "Go", votes: 134, color: "#9b59b6" },
      { id: "6", text: "Rust", votes: 167, color: "#34495e" },
    ],
    isActive: true,
    endDate: "2023-12-08T16:40:00",
  },
];

// Mock data for recent boards
const recentBoards = [
  {
    id: 1,
    title: "인공지능의 미래에 대한 토론",
    description: "AI 기술의 발전과 미래 사회에 미칠 영향에 대해 논의해봅시다.",
    category: "기술",
    author: {
      name: "테크마스터",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-11-15T09:30:00",
    likes: 128,
    comments: 32,
  },
  {
    id: 2,
    title: "2024년 최고의 여행지 추천",
    description:
      "포스트 코로나 시대, 꼭 가봐야 할 국내외 여행지를 공유해주세요.",
    category: "여행",
    author: {
      name: "여행자",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-11-14T15:45:00",
    likes: 95,
    comments: 47,
  },
  {
    id: 3,
    title: "건강한 식습관과 운동 루틴 공유",
    description: "일상에서 실천할 수 있는 건강한 생활 습관에 대해 이야기해요.",
    category: "건강",
    author: {
      name: "헬스프로",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-11-13T11:20:00",
    likes: 76,
    comments: 28,
  },
];

// Mock statistics
const appStats = {
  totalUsers: 12458,
  totalVotes: 3254,
  totalBoards: 1876,
  totalComments: 24689,
  activeVotes: 487,
  dailyVotes: 1245,
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

  if (days > 0) return `${days}일 ${hours}시간 남음`;
  if (hours > 0) return `${hours}시간 남음`;
  return "1시간 미만 남음";
};

// Get the leading option for each vote
const getLeadingOption = (options: (typeof trendingVotes)[0]["options"]) => {
  return options.reduce((prev, current) =>
    prev.votes > current.votes ? prev : current
  );
};

const MainPage = () => {
  // const { user } = useAuth();
  const user = { username: "test" };
  const isLoggedIn = !!user;
  const [searchQuery, setSearchQuery] = useState("");

  // Animated counter hook
  const useCounter = (end: number, duration = 2000) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime: number | null = null;
      let animationFrame: number;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(step);
        }
      };

      animationFrame = window.requestAnimationFrame(step);
      return () => window.cancelAnimationFrame(animationFrame);
    }, [end, duration]);

    return count;
  };

  // Animated counters for statistics
  const userCount = useCounter(appStats.totalUsers);
  const voteCount = useCounter(appStats.totalVotes);
  const boardCount = useCounter(appStats.totalBoards);
  const commentCount = useCounter(appStats.totalComments);

  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section className='relative py-20 overflow-hidden'>
        {/* Background gradient */}
        <div className='absolute inset-0 bg-gradient-to-b from-blue-900/20 to-[#151b33] pointer-events-none' />

        {/* Animated background circles */}
        <div className='absolute top-20 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse' />
        <div
          className='absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse'
          style={{ animationDelay: "1s" }}
        />

        <div className='container mx-auto px-4 relative z-10'>
          <div className='max-w-3xl mx-auto text-center'>
            <h1 className='text-4xl md:text-6xl font-bold text-white mb-6'>
              당신의 의견이 <span className='text-blue-400'>폴폴</span>{" "}
              날아다닌다!
            </h1>
            <p className='text-xl text-gray-300 mb-8'>
              자유롭게 투표하고 세상과 소통하세요. 여러분의 목소리가 모여 더
              나은 세상을 만듭니다.
            </p>

            <div className='flex flex-col sm:flex-row justify-center gap-4 mb-12'>
              {isLoggedIn ? (
                <>
                  <Link to='/votes/create'>
                    <Button className='w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg'>
                      투표 만들기
                      <Vote className='ml-2 h-5 w-5' />
                    </Button>
                  </Link>
                  <Link to='/boards/create'>
                    <Button
                      variant='outline'
                      className='w-full sm:w-auto border-gray-600 hover:bg-gray-800 text-white px-8 py-6 rounded-full text-lg'
                    >
                      게시글 작성하기
                      <FileText className='ml-2 h-5 w-5' />
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to='/signin'>
                    <Button className='w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg'>
                      시작하기
                      <ArrowRight className='ml-2 h-5 w-5' />
                    </Button>
                  </Link>
                  <Link to='/votes'>
                    <Button
                      variant='outline'
                      className='w-full sm:w-auto border-gray-600 hover:bg-gray-800 text-white px-8 py-6 rounded-full text-lg'
                    >
                      둘러보기
                      <Search className='ml-2 h-5 w-5' />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Search bar */}
            <div className='relative max-w-2xl mx-auto'>
              <Input
                placeholder='투표나 게시글 검색...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='bg-[#1e2642]/80 backdrop-blur-sm border-gray-700 text-white h-14 pl-12 pr-4 rounded-full text-lg'
              />
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6' />
              <Button className='absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full h-10 bg-blue-600 hover:bg-blue-700'>
                검색
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className='py-16 bg-[#1a2035]'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <div className='bg-[#1e2642] rounded-lg p-6 text-center'>
              <Users className='h-8 w-8 text-blue-400 mx-auto mb-3' />
              <h3 className='text-3xl font-bold text-white mb-1'>
                {userCount.toLocaleString()}
              </h3>
              <p className='text-gray-400'>사용자</p>
            </div>

            <div className='bg-[#1e2642] rounded-lg p-6 text-center'>
              <Vote className='h-8 w-8 text-purple-400 mx-auto mb-3' />
              <h3 className='text-3xl font-bold text-white mb-1'>
                {voteCount.toLocaleString()}
              </h3>
              <p className='text-gray-400'>투표</p>
            </div>

            <div className='bg-[#1e2642] rounded-lg p-6 text-center'>
              <FileText className='h-8 w-8 text-green-400 mx-auto mb-3' />
              <h3 className='text-3xl font-bold text-white mb-1'>
                {boardCount.toLocaleString()}
              </h3>
              <p className='text-gray-400'>게시글</p>
            </div>

            <div className='bg-[#1e2642] rounded-lg p-6 text-center'>
              <MessageSquare className='h-8 w-8 text-orange-400 mx-auto mb-3' />
              <h3 className='text-3xl font-bold text-white mb-1'>
                {commentCount.toLocaleString()}
              </h3>
              <p className='text-gray-400'>댓글</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Votes Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center mb-8'>
            <div>
              <h2 className='text-3xl font-bold text-white'>인기 투표</h2>
              <p className='text-gray-400 mt-2'>
                지금 가장 많은 사람들이 참여하고 있는 투표입니다.
              </p>
            </div>
            <Link to='/votes'>
              <Button
                variant='outline'
                className='border-gray-700 hover:border-blue-500 hover:text-blue-400'
              >
                모든 투표 보기
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {trendingVotes.map((vote) => {
              const leadingOption = getLeadingOption(vote.options);
              return (
                <Link
                  to={`/votes/${vote.id}`}
                  key={vote.id}
                  className='block transition-transform hover:scale-[1.02]'
                >
                  <Card className='h-full bg-[#1e2642] border-gray-700 hover:border-blue-500 transition-colors overflow-hidden'>
                    <CardHeader className='pb-2'>
                      <div className='flex justify-between items-start'>
                        <div className='flex flex-wrap gap-2'>
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
                        <TrendingUp className='h-5 w-5 text-red-400' />
                      </div>
                      <CardTitle className='text-xl text-white line-clamp-2 mt-2'>
                        {vote.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className='mt-3 space-y-2'>
                        <div className='flex justify-between text-sm'>
                          <span className='text-white font-medium'>
                            현재 1위: {leadingOption.text}
                          </span>
                          <span className='text-gray-400'>
                            {Math.round(
                              (leadingOption.votes / vote.totalVotes) * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className='w-full bg-[#151b33] rounded-full h-2.5'>
                          <div
                            className='h-2.5 rounded-full'
                            style={{
                              width: `${
                                (leadingOption.votes / vote.totalVotes) * 100
                              }%`,
                              backgroundColor: leadingOption.color,
                            }}
                          />
                        </div>
                        <div className='flex items-center text-xs text-gray-400 mt-1'>
                          <BarChart3 className='h-3 w-3 mr-1' />
                          <span>총 {vote.totalVotes}명 참여</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className='border-t border-gray-700 pt-3 flex justify-between'>
                      <div className='text-sm text-gray-400'>
                        {vote.isActive ? (
                          <span className='text-green-400'>
                            {calculateTimeRemaining(vote.endDate)}
                          </span>
                        ) : (
                          <span>투표 종료</span>
                        )}
                      </div>
                    </CardFooter>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recent Boards Section */}
      <section className='py-16 bg-[#1a2035]'>
        <div className='container mx-auto px-4'>
          <div className='flex justify-between items-center mb-8'>
            <div>
              <h2 className='text-3xl font-bold text-white'>최신 게시글</h2>
              <p className='text-gray-400 mt-2'>
                최근에 작성된 인기 게시글을 확인해보세요.
              </p>
            </div>
            <Link to='/boards'>
              <Button
                variant='outline'
                className='border-gray-700 hover:border-blue-500 hover:text-blue-400'
              >
                모든 게시글 보기
                <ChevronRight className='ml-2 h-4 w-4' />
              </Button>
            </Link>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            {recentBoards.map((board) => (
              <Link
                to={`/boards/${board.id}`}
                key={board.id}
                className='block transition-transform hover:scale-[1.02]'
              >
                <Card className='h-full bg-[#1e2642] border-gray-700 hover:border-blue-500 transition-colors overflow-hidden'>
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-start'>
                      <Badge className='bg-blue-600 hover:bg-blue-700 mb-2'>
                        {board.category}
                      </Badge>
                      <span className='text-sm text-gray-400'>
                        {formatRelativeTime(board.createdAt)}
                      </span>
                    </div>
                    <CardTitle className='text-xl text-white line-clamp-2'>
                      {board.title}
                    </CardTitle>
                    <CardDescription className='text-gray-300 line-clamp-2 mt-1'>
                      {board.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='flex items-center mt-2'>
                      <img
                        src={board.author.avatar || "/placeholder.svg"}
                        alt={board.author.name}
                        className='w-6 h-6 rounded-full mr-2'
                      />
                      <span className='text-sm text-gray-300'>
                        {board.author.name}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className='border-t border-gray-700 pt-3 flex justify-between'>
                    <div className='flex items-center text-gray-400 text-sm'>
                      <ThumbsUp className='h-4 w-4 mr-1' />
                      <span className='mr-3'>{board.likes}</span>
                      <MessageSquare className='h-4 w-4 mr-1' />
                      <span>{board.comments}</span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='py-16'>
        <div className='container mx-auto px-4'>
          <div className='text-center mb-12'>
            <h2 className='text-3xl font-bold text-white mb-4'>
              PollPoll의 특별한 기능
            </h2>
            <p className='text-gray-400 max-w-2xl mx-auto'>
              PollPoll은 단순한 투표 서비스를 넘어 다양한 기능을 제공합니다.
              여러분의 의견을 더 효과적으로 표현하고 공유해보세요.
            </p>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='bg-[#1e2642] rounded-lg p-6 transition-transform hover:scale-[1.02]'>
              <div className='bg-blue-500/20 p-3 rounded-full w-fit mb-4'>
                <Vote className='h-6 w-6 text-blue-400' />
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>
                다양한 투표 옵션
              </h3>
              <p className='text-gray-400'>
                단일 선택, 복수 선택, 순위 선택 등 다양한 투표 방식을
                지원합니다. 원하는 방식으로 투표를 만들어보세요.
              </p>
            </div>

            <div className='bg-[#1e2642] rounded-lg p-6 transition-transform hover:scale-[1.02]'>
              <div className='bg-purple-500/20 p-3 rounded-full w-fit mb-4'>
                <BarChart3 className='h-6 w-6 text-purple-400' />
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>
                실시간 결과 분석
              </h3>
              <p className='text-gray-400'>
                투표 결과를 다양한 차트와 그래프로 실시간 확인할 수 있습니다.
                데이터를 시각적으로 분석해보세요.
              </p>
            </div>

            <div className='bg-[#1e2642] rounded-lg p-6 transition-transform hover:scale-[1.02]'>
              <div className='bg-green-500/20 p-3 rounded-full w-fit mb-4'>
                <MessageSquare className='h-6 w-6 text-green-400' />
              </div>
              <h3 className='text-xl font-bold text-white mb-2'>토론과 댓글</h3>
              <p className='text-gray-400'>
                투표에 대한 의견을 댓글로 남기고 다른 사용자들과 토론할 수
                있습니다. 더 깊이 있는 소통을 경험하세요.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='py-20 bg-gradient-to-r from-blue-900/30 to-purple-900/30'>
        <div className='container mx-auto px-4 text-center'>
          <h2 className='text-3xl md:text-4xl font-bold text-white mb-6'>
            지금 바로 시작하세요!
          </h2>
          <p className='text-xl text-gray-300 mb-8 max-w-2xl mx-auto'>
            여러분의 의견이 중요합니다. 지금 PollPoll에 가입하고 다양한 주제에
            대한 투표에 참여해보세요.
          </p>

          {isLoggedIn ? (
            <div className='flex flex-col sm:flex-row justify-center gap-4'>
              <Link to='/votes/create'>
                <Button className='w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg'>
                  투표 만들기
                  <Vote className='ml-2 h-5 w-5' />
                </Button>
              </Link>
              <Link to='/votes'>
                <Button
                  variant='outline'
                  className='w-full sm:w-auto border-gray-600 hover:bg-gray-800 text-white px-8 py-6 rounded-full text-lg'
                >
                  투표 참여하기
                  <BarChart3 className='ml-2 h-5 w-5' />
                </Button>
              </Link>
            </div>
          ) : (
            <div className='flex flex-col sm:flex-row justify-center gap-4'>
              <Link to='/signup'>
                <Button className='w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-6 rounded-full text-lg'>
                  회원가입
                  <Users className='ml-2 h-5 w-5' />
                </Button>
              </Link>
              <Link to='/signin'>
                <Button
                  variant='outline'
                  className='w-full sm:w-auto border-gray-600 hover:bg-gray-800 text-white px-8 py-6 rounded-full text-lg'
                >
                  로그인
                  <ArrowRight className='ml-2 h-5 w-5' />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default MainPage;

// import { Button } from '@/components/ui/button';
// import { Link } from 'react-router-dom';

// const MainPage = () => {
//   return (
//     <>
//       <section className='card-cta'>
//         <div className='flex flex-col gap-6 max-w-lg'>
//           <h2>Get Interview-Ready with AI-powered Practice</h2>
//           <p className='text-lg'>
//             Get the confidence you need to ace your next interview with
//             AI-powered feedback on your coding skills.
//           </p>
//           <Button asChild className='btn-primary max-sm:w-full'>
//             <Link to='/profile'>Go to Profile</Link>
//           </Button>
//         </div>
//       </section>
//     </>
//   );
// };

// export default MainPage;
