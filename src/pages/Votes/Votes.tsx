
import { useState, useEffect } from "react";
import {
  Filter,
  ArrowUpDown,
  Clock,
  ThumbsUp,
  Plus,
  Search,
  Calendar,
  BarChart3,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useAuth } from "../../contexts/useAuth";
import { Link } from "react-router-dom";

// Mock data for votes
const mockVotes = [
  {
    id: "1",
    title: "가장 배우기 쉬운 프로그래밍 언어는?",
    description:
      "프로그래밍을 처음 시작하는 사람들에게 가장 추천하는 언어를 선택해주세요.",
    category: "프로그래밍",
    author: {
      name: "테크마스터",
      avatar: "/placeholder.svg?height=40&width=40",
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
    views: 1245,
  },
  {
    id: "2",
    title: "2024년에 가장 전망 있는 기술 분야는?",
    description:
      "다가오는 2024년, 어떤 기술 분야가 가장 주목받을지 여러분의 의견을 들려주세요.",
    category: "기술 트렌드",
    author: {
      name: "미래학자",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-10-20T15:45:00",
    endDate: "2023-11-20T15:45:00",
    isActive: false,
    options: [
      { id: "1", text: "인공지능/머신러닝", votes: 312, color: "#9b59b6" },
      { id: "2", text: "블록체인", votes: 145, color: "#34495e" },
      { id: "3", text: "AR/VR", votes: 178, color: "#16a085" },
      { id: "4", text: "양자 컴퓨팅", votes: 98, color: "#d35400" },
    ],
    totalVotes: 733,
    views: 982,
  },
  {
    id: "3",
    title: "개발자가 가장 선호하는 작업 환경은?",
    description:
      "개발자로서 가장 선호하는 작업 환경은 어디인가요? 여러분의 경험을 공유해주세요.",
    category: "개발 문화",
    author: {
      name: "코드마스터",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-09-15T09:20:00",
    endDate: "2023-10-15T09:20:00",
    isActive: false,
    options: [
      { id: "1", text: "재택근무", votes: 287, color: "#3498db" },
      { id: "2", text: "사무실 근무", votes: 124, color: "#f1c40f" },
      { id: "3", text: "하이브리드", votes: 215, color: "#e74c3c" },
      { id: "4", text: "코워킹 스페이스", votes: 76, color: "#2ecc71" },
    ],
    totalVotes: 702,
    views: 845,
  },
  {
    id: "4",
    title: "가장 많이 사용하는 코드 에디터는?",
    description:
      "여러분이 코딩할 때 가장 많이 사용하는 코드 에디터는 무엇인가요?",
    category: "개발 도구",
    author: {
      name: "개발자킴",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-11-01T11:30:00",
    endDate: "2023-12-01T11:30:00",
    isActive: true,
    options: [
      { id: "1", text: "Visual Studio Code", votes: 412, color: "#3498db" },
      { id: "2", text: "IntelliJ IDEA", votes: 215, color: "#f1c40f" },
      { id: "3", text: "Sublime Text", votes: 98, color: "#e74c3c" },
      { id: "4", text: "Vim", votes: 120, color: "#2ecc71" },
    ],
    totalVotes: 845,
    views: 1102,
  },
  {
    id: "5",
    title: "최고의 프론트엔드 프레임워크는?",
    description:
      "2023년 현재, 여러분이 생각하는 최고의 프론트엔드 프레임워크는 무엇인가요?",
    category: "프로그래밍",
    author: {
      name: "프론트엔드개발자",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-10-10T14:15:00",
    endDate: "2023-11-10T14:15:00",
    isActive: false,
    options: [
      { id: "1", text: "React", votes: 356, color: "#3498db" },
      { id: "2", text: "Vue.js", votes: 245, color: "#f1c40f" },
      { id: "3", text: "Angular", votes: 132, color: "#e74c3c" },
      { id: "4", text: "Svelte", votes: 178, color: "#2ecc71" },
    ],
    totalVotes: 911,
    views: 1320,
  },
  {
    id: "6",
    title: "가장 좋아하는 프로그래밍 언어는?",
    description:
      "여러분이 가장 좋아하는 프로그래밍 언어는 무엇인가요? 그 이유도 함께 공유해주세요.",
    category: "프로그래밍",
    author: {
      name: "코딩마니아",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-11-08T16:40:00",
    endDate: "2023-12-08T16:40:00",
    isActive: true,
    options: [
      { id: "1", text: "JavaScript", votes: 278, color: "#3498db" },
      { id: "2", text: "Python", votes: 312, color: "#f1c40f" },
      { id: "3", text: "Java", votes: 156, color: "#e74c3c" },
      { id: "4", text: "C++", votes: 98, color: "#2ecc71" },
      { id: "5", text: "Go", votes: 134, color: "#9b59b6" },
      { id: "6", text: "Rust", votes: 167, color: "#34495e" },
    ],
    totalVotes: 1145,
    views: 1678,
  },
];

// All unique categories from mock data
const allCategories = [
  "전체",
  ...new Set(mockVotes.map((vote) => vote.category)),
];

// Format date to relative time (e.g., "3 days ago")
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

// Format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("ko-KR", options);
};

const VotePage = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [selectedStatus, setSelectedStatus] = useState("전체");
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVotes, setFilteredVotes] = useState(mockVotes);
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Filter and sort votes based on selected options
  useEffect(() => {
    let result = [...mockVotes];

    // Apply category filter
    if (selectedCategory !== "전체") {
      result = result.filter((vote) => vote.category === selectedCategory);
    }

    // Apply status filter
    if (selectedStatus !== "전체") {
      result = result.filter(
        (vote) =>
          (selectedStatus === "active" && vote.isActive) ||
          (selectedStatus === "ended" && !vote.isActive)
      );
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (vote) =>
          vote.title.toLowerCase().includes(query) ||
          vote.description.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "popular":
          return b.totalVotes - a.totalVotes;
        case "ending-soon":
          // Sort by active first, then by end date
          if (a.isActive && !b.isActive) return -1;
          if (!a.isActive && b.isActive) return 1;
          return new Date(a.endDate).getTime() - new Date(b.endDate).getTime();
        default:
          return 0;
      }
    });

    setFilteredVotes(result);
  }, [selectedCategory, selectedStatus, sortOption, searchQuery]);

  // Get the leading option for each vote
  const getLeadingOption = (options: (typeof mockVotes)[0]["options"]) => {
    return options.reduce((prev, current) =>
      prev.votes > current.votes ? prev : current
    );
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
          <h1 className='text-3xl font-bold text-white mb-4 md:mb-0'>투표</h1>

          <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
            <div className='relative w-full sm:w-64'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='투표 검색...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10 bg-[#1e2642] border-gray-700 text-white'
              />
            </div>

            {isLoggedIn && (
              <Link to='/votes/create'>
                <Button className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700'>
                  <Plus className='mr-2 h-4 w-4' />새 투표 만들기
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className='bg-[#1e2642] rounded-lg p-4'>
          <div className='flex flex-col sm:flex-row justify-between gap-4'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center gap-4'>
              <div className='flex items-center'>
                <Filter className='mr-2 h-5 w-5 text-gray-400' />
                <span className='text-white mr-3'>카테고리:</span>
                <Tabs
                  defaultValue='전체'
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  className='w-full sm:w-auto'
                >
                  <TabsList className='bg-[#151b33] h-auto flex flex-wrap'>
                    {allCategories.map((category) => (
                      <TabsTrigger
                        key={category}
                        value={category}
                        className='data-[state=active]:bg-blue-600'
                      >
                        {category}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <div className='flex items-center'>
                <Calendar className='mr-2 h-5 w-5 text-gray-400' />
                <span className='text-white mr-3'>상태:</span>
                <Tabs
                  defaultValue='전체'
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                  className='w-full sm:w-auto'
                >
                  <TabsList className='bg-[#151b33] h-auto'>
                    <TabsTrigger
                      value='전체'
                      className='data-[state=active]:bg-blue-600'
                    >
                      전체
                    </TabsTrigger>
                    <TabsTrigger
                      value='active'
                      className='data-[state=active]:bg-green-600'
                    >
                      진행 중
                    </TabsTrigger>
                    <TabsTrigger
                      value='ended'
                      className='data-[state=active]:bg-gray-600'
                    >
                      종료됨
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>

            <div className='flex items-center'>
              <ArrowUpDown className='mr-2 h-5 w-5 text-gray-400' />
              <span className='text-white mr-3'>정렬:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    className='bg-[#151b33] border-gray-700'
                  >
                    {sortOption === "newest" && "최신순"}
                    {sortOption === "oldest" && "오래된순"}
                    {sortOption === "popular" && "인기순"}
                    {sortOption === "ending-soon" && "마감임박순"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className='bg-[#1e2642] border-gray-700 text-white'>
                  <DropdownMenuItem onClick={() => setSortOption("newest")}>
                    <Clock className='mr-2 h-4 w-4' />
                    최신순
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("oldest")}>
                    <Clock className='mr-2 h-4 w-4' />
                    오래된순
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOption("popular")}>
                    <ThumbsUp className='mr-2 h-4 w-4' />
                    인기순
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOption("ending-soon")}
                  >
                    <Calendar className='mr-2 h-4 w-4' />
                    마감임박순
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Vote Listing */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredVotes.length > 0 ? (
          filteredVotes.map((vote) => {
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
                      <span className='text-sm text-gray-400'>
                        {formatRelativeTime(vote.createdAt)}
                      </span>
                    </div>
                    <CardTitle className='text-xl text-white line-clamp-2 mt-2'>
                      {vote.title}
                    </CardTitle>
                    <CardDescription className='text-gray-300 line-clamp-2 mt-1'>
                      {vote.description}
                    </CardDescription>
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

                    <div className='flex items-center mt-4'>
                      <img
                        src={vote.author.avatar || "/placeholder.svg"}
                        alt={vote.author.name}
                        className='w-6 h-6 rounded-full mr-2'
                      />
                      <span className='text-sm text-gray-300'>
                        {vote.author.name}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter className='border-t border-gray-700 pt-3 flex justify-between'>
                    <div className='flex items-center text-gray-400 text-sm'>
                      <Calendar className='h-4 w-4 mr-1' />
                      <span className='mr-3'>{formatDate(vote.endDate)}</span>
                    </div>
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
          })
        ) : (
          <div className='col-span-full flex flex-col items-center justify-center py-16 text-gray-400'>
            <svg
              className='h-16 w-16 mb-4 text-gray-500'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <rect
                x='4'
                y='4'
                width='16'
                height='16'
                rx='2'
                stroke='currentColor'
                strokeWidth='2'
              />
              <path
                d='M9 10V14M15 10V14'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
            <h3 className='text-xl font-medium mb-2'>투표가 없습니다</h3>
            <p className='text-center max-w-md'>
              선택한 카테고리나 검색어에 맞는 투표가 없습니다. 다른 카테고리를
              선택하거나 검색어를 변경해보세요.
            </p>
            {isLoggedIn && (
              <Link to='/votes/create'>
                <Button className='mt-6 bg-blue-600 hover:bg-blue-700'>
                  <Plus className='mr-2 h-4 w-4' />첫 투표 만들기
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VotePage;
