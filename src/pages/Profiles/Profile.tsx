import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  FileText,
  Vote,
  Bookmark,
  LogOut,
  Edit,
  Save,
  Upload,
  Trash2,
  Eye,
  MessageSquare,
  ThumbsUp,
  Calendar,
  BarChart3,
  Settings,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "../../components/ui/sidebar";
import { useAuth } from "../../contexts/useAuth";

// Mock user data
const mockUser = {
  id: "user1",
  username: "테크마스터",
  email: "tech@example.com",
  bio: "AI 및 신기술 전문가, 10년차 개발자",
  avatar: "/placeholder.svg?height=100&width=100",
  coverImage: "/placeholder.svg?height=300&width=1000",
  joinDate: "2022-05-15T00:00:00",
  location: "서울, 대한민국",
  website: "https://techmaster.blog",
  stats: {
    posts: 24,
    votes: 18,
    bookmarks: 37,
    followers: 156,
    following: 89,
  },
};

// Mock boards data
const mockBoards = [
  {
    id: 1,
    title: "인공지능의 미래에 대한 토론",
    description: "AI 기술의 발전과 미래 사회에 미칠 영향에 대해 논의해봅시다.",
    category: "기술",
    createdAt: "2023-11-15T09:30:00",
    likes: 128,
    comments: 32,
    views: 456,
  },
  {
    id: 2,
    title: "프로그래밍 언어 트렌드 2024",
    description: "올해와 내년에 주목해야 할 프로그래밍 언어와 기술 스택은?",
    category: "기술",
    createdAt: "2023-11-10T14:25:00",
    likes: 143,
    comments: 38,
    views: 421,
  },
  {
    id: 3,
    title: "개발자를 위한 생산성 도구 추천",
    description: "개발 효율을 높이는 데 도움이 되는 도구와 팁을 공유합니다.",
    category: "개발",
    createdAt: "2023-10-28T11:15:00",
    likes: 95,
    comments: 27,
    views: 312,
  },
];

// Mock votes data
const mockVotes = [
  {
    id: 1,
    title: "가장 배우기 쉬운 프로그래밍 언어는?",
    options: [
      { id: 1, text: "Python", votes: 245 },
      { id: 2, text: "JavaScript", votes: 189 },
      { id: 3, text: "Java", votes: 112 },
      { id: 4, text: "C#", votes: 87 },
    ],
    totalVotes: 633,
    category: "프로그래밍",
    createdAt: "2023-11-05T10:30:00",
    endDate: "2023-12-05T10:30:00",
    isActive: true,
  },
  {
    id: 2,
    title: "2024년에 가장 전망 있는 기술 분야는?",
    options: [
      { id: 1, text: "인공지능/머신러닝", votes: 312 },
      { id: 2, text: "블록체인", votes: 145 },
      { id: 3, text: "AR/VR", votes: 178 },
      { id: 4, text: "양자 컴퓨팅", votes: 98 },
    ],
    totalVotes: 733,
    category: "기술 트렌드",
    createdAt: "2023-10-20T15:45:00",
    endDate: "2023-11-20T15:45:00",
    isActive: false,
  },
  {
    id: 3,
    title: "개발자가 가장 선호하는 작업 환경은?",
    options: [
      { id: 1, text: "재택근무", votes: 287 },
      { id: 2, text: "사무실 근무", votes: 124 },
      { id: 3, text: "하이브리드", votes: 215 },
      { id: 4, text: "코워킹 스페이스", votes: 76 },
    ],
    totalVotes: 702,
    category: "개발 문화",
    createdAt: "2023-09-15T09:20:00",
    endDate: "2023-10-15T09:20:00",
    isActive: false,
  },
];

// Mock bookmarks data
const mockBookmarks = [
  {
    id: 1,
    type: "board",
    title: "2024년 최고의 여행지 추천",
    category: "여행",
    author: "여행자",
    createdAt: "2023-11-14T15:45:00",
    savedAt: "2023-11-15T10:20:00",
  },
  {
    id: 2,
    type: "vote",
    title: "최고의 프로그래밍 에디터는?",
    category: "개발",
    author: "코드마스터",
    createdAt: "2023-11-08T12:30:00",
    savedAt: "2023-11-10T09:15:00",
  },
  {
    id: 3,
    type: "board",
    title: "건강한 식습관과 운동 루틴 공유",
    category: "건강",
    author: "헬스프로",
    createdAt: "2023-11-13T11:20:00",
    savedAt: "2023-11-14T18:45:00",
  },
];

// Format date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
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

// Dashboard component
const Dashboard = ({ user }: { user: typeof mockUser }) => {
  return (
    <div className='p-6 border-4 border-black w-full'>
      <h1 className='text-2xl font-bold mb-6'>대시보드</h1>

      {/* User stats cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <Card className='bg-[#1e2642] border-gray-700'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>게시글</p>
                <h3 className='text-2xl font-bold text-white'>
                  {user.stats.posts}
                </h3>
              </div>
              <FileText className='h-8 w-8 text-blue-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-[#1e2642] border-gray-700'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>투표</p>
                <h3 className='text-2xl font-bold text-white'>
                  {user.stats.votes}
                </h3>
              </div>
              <Vote className='h-8 w-8 text-purple-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-[#1e2642] border-gray-700'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>북마크</p>
                <h3 className='text-2xl font-bold text-white'>
                  {user.stats.bookmarks}
                </h3>
              </div>
              <Bookmark className='h-8 w-8 text-green-400' />
            </div>
          </CardContent>
        </Card>

        <Card className='bg-[#1e2642] border-gray-700'>
          <CardContent className='p-6'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-400'>팔로워</p>
                <h3 className='text-2xl font-bold text-white'>
                  {user.stats.followers}
                </h3>
              </div>
              <User className='h-8 w-8 text-orange-400' />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity chart */}
      <Card className='bg-[#1e2642] border-gray-700 mb-8'>
        <CardHeader>
          <CardTitle className='text-white'>활동 통계</CardTitle>
          <CardDescription className='text-gray-400'>
            최근 30일 동안의 활동
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='h-[200px] flex items-end justify-between gap-2'>
            {/* Mock chart bars */}
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className='bg-blue-500 rounded-t w-full'
                style={{
                  height: `${Math.floor(Math.random() * 150) + 20}px`,
                  opacity: 0.6 + i / 20,
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent activity */}
      <Card className='bg-[#1e2642] border-gray-700'>
        <CardHeader>
          <CardTitle className='text-white'>최근 활동</CardTitle>
          <CardDescription className='text-gray-400'>
            최근 활동 내역
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-start gap-4'>
              <div className='bg-blue-500/20 p-2 rounded-full'>
                <FileText className='h-5 w-5 text-blue-500' />
              </div>
              <div>
                <p className='text-white font-medium'>새 게시글 작성</p>
                <p className='text-sm text-gray-400'>
                  인공지능의 미래에 대한 토론
                </p>
                <p className='text-xs text-gray-500'>2시간 전</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='bg-purple-500/20 p-2 rounded-full'>
                <Vote className='h-5 w-5 text-purple-500' />
              </div>
              <div>
                <p className='text-white font-medium'>새 투표 생성</p>
                <p className='text-sm text-gray-400'>
                  가장 배우기 쉬운 프로그래밍 언어는?
                </p>
                <p className='text-xs text-gray-500'>1일 전</p>
              </div>
            </div>

            <div className='flex items-start gap-4'>
              <div className='bg-green-500/20 p-2 rounded-full'>
                <MessageSquare className='h-5 w-5 text-green-500' />
              </div>
              <div>
                <p className='text-white font-medium'>댓글 작성</p>
                <p className='text-sm text-gray-400'>
                  2024년 최고의 여행지 추천
                </p>
                <p className='text-xs text-gray-500'>3일 전</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Profile edit component
const ProfileEdit = ({ user }: { user: typeof mockUser }) => {
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    bio: user.bio,
    location: user.location,
    website: user.website,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would call an API to update the user profile
    alert("프로필이 업데이트되었습니다!");
  };

  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>프로필 수정</h1>

      <Card className='bg-[#1e2642] border-gray-700 mb-8'>
        <CardHeader>
          <CardTitle className='text-white'>프로필 이미지</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex flex-col sm:flex-row items-center gap-6'>
            <Avatar className='h-24 w-24'>
              <AvatarImage src={user.avatar} alt={user.username} />
              <AvatarFallback>{user.username.charAt(0)}</AvatarFallback>
            </Avatar>

            <div className='flex flex-col gap-4'>
              <Button className='bg-blue-600 hover:bg-blue-700'>
                <Upload className='mr-2 h-4 w-4' />
                이미지 업로드
              </Button>
              <Button
                variant='outline'
                className='border-gray-700 text-gray-400 hover:text-white'
              >
                <Trash2 className='mr-2 h-4 w-4' />
                이미지 삭제
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-[#1e2642] border-gray-700'>
        <CardHeader>
          <CardTitle className='text-white'>개인 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <label htmlFor='username' className='text-sm text-gray-400'>
                사용자 이름
              </label>
              <Input
                id='username'
                name='username'
                value={formData.username}
                onChange={handleChange}
                className='bg-[#151b33] border-gray-700 text-white'
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm text-gray-400'>
                이메일
              </label>
              <Input
                id='email'
                name='email'
                type='email'
                value={formData.email}
                onChange={handleChange}
                className='bg-[#151b33] border-gray-700 text-white'
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='bio' className='text-sm text-gray-400'>
                자기소개
              </label>
              <Textarea
                id='bio'
                name='bio'
                value={formData.bio}
                onChange={handleChange}
                className='bg-[#151b33] border-gray-700 text-white min-h-[100px]'
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='location' className='text-sm text-gray-400'>
                위치
              </label>
              <Input
                id='location'
                name='location'
                value={formData.location}
                onChange={handleChange}
                className='bg-[#151b33] border-gray-700 text-white'
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='website' className='text-sm text-gray-400'>
                웹사이트
              </label>
              <Input
                id='website'
                name='website'
                value={formData.website}
                onChange={handleChange}
                className='bg-[#151b33] border-gray-700 text-white'
              />
            </div>

            <div className='flex justify-end'>
              <Button type='submit' className='bg-blue-600 hover:bg-blue-700'>
                <Save className='mr-2 h-4 w-4' />
                변경사항 저장
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

// My boards component
const MyBoards = ({ boards }: { boards: typeof mockBoards }) => {
  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>내 게시글</h1>
        <Button className='bg-blue-600 hover:bg-blue-700'>
          <FileText className='mr-2 h-4 w-4' />새 게시글 작성
        </Button>
      </div>

      <div className='space-y-4'>
        {boards.map((board) => (
          <Card
            key={board.id}
            className='bg-[#1e2642] border-gray-700 hover:border-blue-500 transition-colors'
          >
            <CardHeader className='pb-2'>
              <div className='flex justify-between items-start'>
                <Badge className='bg-blue-600 hover:bg-blue-700 mb-2'>
                  {board.category}
                </Badge>
                <span className='text-sm text-gray-400'>
                  {formatRelativeTime(board.createdAt)}
                </span>
              </div>
              <CardTitle className='text-xl text-white'>
                {board.title}
              </CardTitle>
              <CardDescription className='text-gray-300 mt-1'>
                {board.description}
              </CardDescription>
            </CardHeader>
            <CardFooter className='border-t border-gray-700 pt-4 flex justify-between'>
              <div className='flex items-center text-gray-400 text-sm'>
                <Eye className='h-4 w-4 mr-1' />
                <span className='mr-3'>{board.views}</span>
                <MessageSquare className='h-4 w-4 mr-1' />
                <span className='mr-3'>{board.comments}</span>
                <ThumbsUp className='h-4 w-4 mr-1' />
                <span>{board.likes}</span>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 border-gray-700 hover:border-blue-500 hover:text-blue-400'
                >
                  <Edit className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 border-gray-700 hover:border-red-500 hover:text-red-400'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

// My votes component
const MyVotes = ({ votes }: { votes: typeof mockVotes }) => {
  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>내 투표</h1>
        <Button className='bg-blue-600 hover:bg-blue-700'>
          <Vote className='mr-2 h-4 w-4' />새 투표 생성
        </Button>
      </div>

      <div className='space-y-6'>
        {votes.map((vote) => (
          <Card
            key={vote.id}
            className='bg-[#1e2642] border-gray-700 hover:border-blue-500 transition-colors'
          >
            <CardHeader>
              <div className='flex justify-between items-start mb-2'>
                <Badge
                  className={`${
                    vote.isActive
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-gray-600 hover:bg-gray-700"
                  }`}
                >
                  {vote.isActive ? "진행 중" : "종료됨"}
                </Badge>
                <Badge className='bg-blue-600 hover:bg-blue-700'>
                  {vote.category}
                </Badge>
              </div>
              <CardTitle className='text-xl text-white'>{vote.title}</CardTitle>
              <div className='flex items-center text-sm text-gray-400 mt-2'>
                <Calendar className='h-4 w-4 mr-1' />
                <span>
                  {formatDate(vote.createdAt)} ~ {formatDate(vote.endDate)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {vote.options.map((option) => (
                  <div key={option.id} className='space-y-1'>
                    <div className='flex justify-between text-sm'>
                      <span className='text-white'>{option.text}</span>
                      <span className='text-gray-400'>
                        {option.votes} 표 (
                        {Math.round((option.votes / vote.totalVotes) * 100)}%)
                      </span>
                    </div>
                    <div className='w-full bg-[#151b33] rounded-full h-2.5'>
                      <div
                        className='bg-blue-600 h-2.5 rounded-full'
                        style={{
                          width: `${(option.votes / vote.totalVotes) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className='mt-4 text-sm text-gray-400 text-right'>
                총 {vote.totalVotes}명 참여
              </div>
            </CardContent>
            <CardFooter className='border-t border-gray-700 pt-4 flex justify-between'>
              <div className='flex items-center text-gray-400 text-sm'>
                <BarChart3 className='h-4 w-4 mr-1' />
                <span>통계</span>
              </div>
              <div className='flex gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 border-gray-700 hover:border-blue-500 hover:text-blue-400'
                >
                  <Edit className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='sm'
                  className='h-8 border-gray-700 hover:border-red-500 hover:text-red-400'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

// Bookmarks component
const Bookmarks = ({ bookmarks }: { bookmarks: typeof mockBookmarks }) => {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>북마크</h1>

      <Tabs defaultValue='all' className='mb-6'>
        <TabsList className='bg-[#151b33] h-auto'>
          <TabsTrigger value='all' className='data-[state=active]:bg-blue-600'>
            전체
          </TabsTrigger>
          <TabsTrigger
            value='boards'
            className='data-[state=active]:bg-blue-600'
          >
            게시글
          </TabsTrigger>
          <TabsTrigger
            value='votes'
            className='data-[state=active]:bg-blue-600'
          >
            투표
          </TabsTrigger>
        </TabsList>

        <TabsContent value='all' className='mt-4'>
          <div className='space-y-4'>
            {bookmarks.map((bookmark) => (
              <Card
                key={bookmark.id}
                className='bg-[#1e2642] border-gray-700 hover:border-blue-500 transition-colors'
              >
                <CardHeader className='pb-2'>
                  <div className='flex justify-between items-start'>
                    <div className='flex items-center gap-2'>
                      <Badge
                        className={`${
                          bookmark.type === "board"
                            ? "bg-blue-600"
                            : "bg-purple-600"
                        }`}
                      >
                        {bookmark.type === "board" ? "게시글" : "투표"}
                      </Badge>
                      <Badge className='bg-gray-600'>{bookmark.category}</Badge>
                    </div>
                    <span className='text-sm text-gray-400'>
                      저장일: {formatRelativeTime(bookmark.savedAt)}
                    </span>
                  </div>
                  <CardTitle className='text-lg text-white mt-2'>
                    {bookmark.title}
                  </CardTitle>
                </CardHeader>
                <CardFooter className='border-t border-gray-700 pt-3 flex justify-between'>
                  <div className='text-sm text-gray-400'>
                    작성자: {bookmark.author} · 작성일:{" "}
                    {formatRelativeTime(bookmark.createdAt)}
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    className='h-8 border-gray-700 hover:border-red-500 hover:text-red-400'
                  >
                    <Bookmark className='h-4 w-4' />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value='boards' className='mt-4'>
          <div className='space-y-4'>
            {bookmarks
              .filter((b) => b.type === "board")
              .map((bookmark) => (
                <Card
                  key={bookmark.id}
                  className='bg-[#1e2642] border-gray-700 hover:border-blue-500 transition-colors'
                >
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-start'>
                      <Badge className='bg-gray-600'>{bookmark.category}</Badge>
                      <span className='text-sm text-gray-400'>
                        저장일: {formatRelativeTime(bookmark.savedAt)}
                      </span>
                    </div>
                    <CardTitle className='text-lg text-white mt-2'>
                      {bookmark.title}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className='border-t border-gray-700 pt-3 flex justify-between'>
                    <div className='text-sm text-gray-400'>
                      작성자: {bookmark.author} · 작성일:{" "}
                      {formatRelativeTime(bookmark.createdAt)}
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 border-gray-700 hover:border-red-500 hover:text-red-400'
                    >
                      <Bookmark className='h-4 w-4' />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value='votes' className='mt-4'>
          <div className='space-y-4'>
            {bookmarks
              .filter((b) => b.type === "vote")
              .map((bookmark) => (
                <Card
                  key={bookmark.id}
                  className='bg-[#1e2642] border-gray-700 hover:border-blue-500 transition-colors'
                >
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-start'>
                      <Badge className='bg-gray-600'>{bookmark.category}</Badge>
                      <span className='text-sm text-gray-400'>
                        저장일: {formatRelativeTime(bookmark.savedAt)}
                      </span>
                    </div>
                    <CardTitle className='text-lg text-white mt-2'>
                      {bookmark.title}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className='border-t border-gray-700 pt-3 flex justify-between'>
                    <div className='text-sm text-gray-400'>
                      작성자: {bookmark.author} · 작성일:{" "}
                      {formatRelativeTime(bookmark.createdAt)}
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      className='h-8 border-gray-700 hover:border-red-500 hover:text-red-400'
                    >
                      <Bookmark className='h-4 w-4' />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Settings component
const SettingsComponent = () => {
  return (
    <div>
      <h1 className='text-2xl font-bold mb-6'>설정</h1>

      <Card className='bg-[#1e2642] border-gray-700 mb-6'>
        <CardHeader>
          <CardTitle className='text-white'>계정 설정</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between items-center'>
            <div>
              <h3 className='text-white font-medium'>이메일 알림</h3>
              <p className='text-sm text-gray-400'>
                새 댓글, 좋아요 등에 대한 이메일 알림을 받습니다.
              </p>
            </div>
            <div className='h-6 w-11 bg-blue-600 rounded-full relative cursor-pointer'>
              <div className='h-5 w-5 bg-white rounded-full absolute top-0.5 right-0.5' />
            </div>
          </div>

          <Separator className='bg-gray-700' />

          <div className='flex justify-between items-center'>
            <div>
              <h3 className='text-white font-medium'>2단계 인증</h3>
              <p className='text-sm text-gray-400'>
                계정 보안을 위한 2단계 인증을 활성화합니다.
              </p>
            </div>
            <div className='h-6 w-11 bg-gray-700 rounded-full relative cursor-pointer'>
              <div className='h-5 w-5 bg-white rounded-full absolute top-0.5 left-0.5' />
            </div>
          </div>

          <Separator className='bg-gray-700' />

          <div className='flex justify-between items-center'>
            <div>
              <h3 className='text-white font-medium'>공개 프로필</h3>
              <p className='text-sm text-gray-400'>
                다른 사용자가 내 프로필을 볼 수 있도록 합니다.
              </p>
            </div>
            <div className='h-6 w-11 bg-blue-600 rounded-full relative cursor-pointer'>
              <div className='h-5 w-5 bg-white rounded-full absolute top-0.5 right-0.5' />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className='bg-[#1e2642] border-gray-700 mb-6'>
        <CardHeader>
          <CardTitle className='text-white'>비밀번호 변경</CardTitle>
        </CardHeader>
        <CardContent>
          <form className='space-y-4'>
            <div className='space-y-2'>
              <label
                htmlFor='current-password'
                className='text-sm text-gray-400'
              >
                현재 비밀번호
              </label>
              <Input
                id='current-password'
                type='password'
                className='bg-[#151b33] border-gray-700 text-white'
              />
            </div>

            <div className='space-y-2'>
              <label htmlFor='new-password' className='text-sm text-gray-400'>
                새 비밀번호
              </label>
              <Input
                id='new-password'
                type='password'
                className='bg-[#151b33] border-gray-700 text-white'
              />
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='confirm-password'
                className='text-sm text-gray-400'
              >
                비밀번호 확인
              </label>
              <Input
                id='confirm-password'
                type='password'
                className='bg-[#151b33] border-gray-700 text-white'
              />
            </div>

            <div className='flex justify-end'>
              <Button className='bg-blue-600 hover:bg-blue-700'>
                비밀번호 변경
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className='bg-[#1e2642] border-gray-700'>
        <CardHeader>
          <CardTitle className='text-white text-red-500'>위험 구역</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div>
              <h3 className='text-white font-medium'>계정 비활성화</h3>
              <p className='text-sm text-gray-400 mb-2'>
                계정을 일시적으로 비활성화합니다. 언제든지 다시 로그인하여
                활성화할 수 있습니다.
              </p>
              <Button
                variant='outline'
                className='border-yellow-600 text-yellow-500 hover:bg-yellow-950 hover:text-yellow-400'
              >
                계정 비활성화
              </Button>
            </div>

            <Separator className='bg-gray-700' />

            <div>
              <h3 className='text-white font-medium'>계정 삭제</h3>
              <p className='text-sm text-gray-400 mb-2'>
                계정과 모든 데이터를 영구적으로 삭제합니다. 이 작업은 되돌릴 수
                없습니다.
              </p>
              <Button
                variant='outline'
                className='border-red-600 text-red-500 hover:bg-red-950 hover:text-red-400'
              >
                계정 삭제
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Main ProfilePage component
const ProfilePage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    // <div className='min-h-screen bg-[#151b33]'>
    <div className='min-h-screen bg-[#ebc427] border-4 border-red-500'>
      <SidebarProvider>
        <div className='flex justify-between'>
          {/* Sidebar */}
          <Sidebar className='bg-[#00f244] border-r border-white-700 border-4 relative top-0 left-0 h-full'>
            {/* <Sidebar className='bg-[#1e2642] border-r border-gray-700 relative top-0 left-0 h-full'> */}
            <SidebarHeader className='p-4'>
              <div className='flex items-center gap-3 border-4 border-red-500'>
                <Avatar className='h-10 w-10'>
                  <AvatarImage src={mockUser.avatar} alt={mockUser.username} />
                  <AvatarFallback>{mockUser.username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className='font-medium text-white'>
                    {mockUser.username}
                  </h3>
                  <p className='text-xs text-gray-400'>
                    가입일: {formatDate(mockUser.joinDate)}
                  </p>
                </div>
              </div>
            </SidebarHeader>

            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("dashboard")}
                    isActive={activeSection === "dashboard"}
                  >
                    <LayoutDashboard className='h-5 w-5' />
                    <span>대시보드</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("profile")}
                    isActive={activeSection === "profile"}
                  >
                    <User className='h-5 w-5' />
                    <span>프로필 수정</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("boards")}
                    isActive={activeSection === "boards"}
                  >
                    <FileText className='h-5 w-5' />
                    <span>내 게시글</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("votes")}
                    isActive={activeSection === "votes"}
                  >
                    <Vote className='h-5 w-5' />
                    <span>내 투표</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("bookmarks")}
                    isActive={activeSection === "bookmarks"}
                  >
                    <Bookmark className='h-5 w-5' />
                    <span>북마크</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>

                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveSection("settings")}
                    isActive={activeSection === "settings"}
                  >
                    <Settings className='h-5 w-5' />
                    <span>설정</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>

            <SidebarSeparator />

            <SidebarFooter className='p-4'>
              <Button
                variant='outline'
                className='w-full border-gray-700 text-gray-400 hover:text-white'
                onClick={handleSignOut}
              >
                <LogOut className='mr-2 h-4 w-4' />
                로그아웃
              </Button>
            </SidebarFooter>
          </Sidebar>

          {/* Main content */}
          <div className='flex flex-1 p-6 border-4 border-purple-500 w-full'>
            {/* Adjusted for Sidebar width */}
            {activeSection === "dashboard" && <Dashboard user={mockUser} />}
            {activeSection === "profile" && <ProfileEdit user={mockUser} />}
            {activeSection === "boards" && <MyBoards boards={mockBoards} />}
            {activeSection === "votes" && <MyVotes votes={mockVotes} />}
            {activeSection === "bookmarks" && (
              <Bookmarks bookmarks={mockBookmarks} />
            )}
            {activeSection === "settings" && <SettingsComponent />}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default ProfilePage;
