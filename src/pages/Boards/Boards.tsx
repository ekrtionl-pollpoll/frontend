import { useState, useEffect } from "react";
import {
  Filter,
  ArrowUpDown,
  Clock,
  ThumbsUp,
  MessageSquare,
  Plus,
  Search,
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

// Mock data for boards
const mockBoards = [
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
    views: 456,
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
    views: 312,
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
    views: 245,
  },
  {
    id: 4,
    title: "최신 영화 리뷰 및 추천",
    description:
      "최근에 본 영화 중 추천하고 싶은 작품과 그 이유를 공유해주세요.",
    category: "엔터테인먼트",
    author: {
      name: "무비버프",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-11-12T18:10:00",
    likes: 112,
    comments: 53,
    views: 389,
  },
  {
    id: 5,
    title: "재테크와 투자 전략",
    description:
      "경제 불확실성 시대의 현명한 자산 관리 방법에 대해 논의합니다.",
    category: "금융",
    author: {
      name: "투자의신",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2023-11-11T10:05:00",
    likes: 87,
    comments: 41,
    views: 278,
  },
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
    views: 421,
  },
];

// All unique categories from mock data
const allCategories = [
  "전체",
  ...new Set(mockBoards.map((board) => board.category)),
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

const BoardPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [sortOption, setSortOption] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBoards, setFilteredBoards] = useState(mockBoards);
  const { user } = useAuth();
  const isLoggedIn = !!user;

  // Filter and sort boards based on selected options
  useEffect(() => {
    let result = [...mockBoards];

    // Apply category filter
    if (selectedCategory !== "전체") {
      result = result.filter((board) => board.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (board) =>
          board.title.toLowerCase().includes(query) ||
          board.description.toLowerCase().includes(query)
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
          return b.likes - a.likes;
        case "comments":
          return b.comments - a.comments;
        default:
          return 0;
      }
    });

    setFilteredBoards(result);
  }, [selectedCategory, sortOption, searchQuery]);

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header Section */}
      <div className='mb-8'>
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center mb-6'>
          <h1 className='text-3xl font-bold text-white mb-4 md:mb-0'>게시판</h1>

          <div className='flex flex-col sm:flex-row gap-3 w-full md:w-auto'>
            <div className='relative w-full sm:w-64'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                placeholder='게시글 검색...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='pl-10 bg-[#1e2642] border-gray-700 text-white'
              />
            </div>

            {isLoggedIn && (
              <Link to='/boards/create'>
                <Button className='w-full sm:w-auto bg-blue-600 hover:bg-blue-700'>
                  <Plus className='mr-2 h-4 w-4' />새 게시글 작성
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className='bg-[#1e2642] rounded-lg p-4'>
          <div className='flex flex-col sm:flex-row justify-between gap-4'>
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
                    {sortOption === "comments" && "댓글순"}
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
                  <DropdownMenuItem onClick={() => setSortOption("comments")}>
                    <MessageSquare className='mr-2 h-4 w-4' />
                    댓글순
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Board Listing */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {filteredBoards.length > 0 ? (
          filteredBoards.map((board) => (
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
                  <div className='text-sm text-gray-400'>
                    조회 {board.views}
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))
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
            <h3 className='text-xl font-medium mb-2'>게시글이 없습니다</h3>
            <p className='text-center max-w-md'>
              선택한 카테고리나 검색어에 맞는 게시글이 없습니다. 다른 카테고리를
              선택하거나 검색어를 변경해보세요.
            </p>
            {isLoggedIn && (
              <Link to='/boards/create'>
                <Button className='mt-6 bg-blue-600 hover:bg-blue-700'>
                  <Plus className='mr-2 h-4 w-4' />첫 게시글 작성하기
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BoardPage;
