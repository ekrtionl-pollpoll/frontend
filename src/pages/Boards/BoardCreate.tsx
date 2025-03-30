import type React from "react";

import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Image,
  LinkIcon,
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Quote,
  Code,
  X,
  Plus,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { toast } from "sonner";

// 카테고리 목록
const categories = [
  "기술",
  "프로그래밍",
  "여행",
  "음식",
  "영화/TV",
  "음악",
  "게임",
  "스포츠",
  "건강",
  "교육",
  "정치",
  "경제",
  "환경",
  "일상",
  "취미",
  "기타",
];

// 태그 색상
const tagColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-red-500",
  "bg-indigo-500",
  "bg-pink-500",
  "bg-teal-500",
];

const BoardCreatePage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 폼 상태
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 에디터 상태
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // 태그 추가
  const addTag = () => {
    if (!newTag.trim()) return;

    if (tags.includes(newTag.trim())) {
      toast.error("이미 존재하는 태그입니다.");
      return;
    }

    if (tags.length >= 5) {
      toast.error("최대 5개까지 태그를 추가할 수 있습니다.");
      return;
    }

    setTags([...tags, newTag.trim()]);
    setNewTag("");
  };

  // 태그 삭제
  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // 이미지 업로드 핸들러
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  // 에디터 버튼 클릭 핸들러
  const handleEditorAction = (action: string) => {
    // 실제 구현에서는 에디터 라이브러리의 API를 사용하여 텍스트 포맷팅
    let insertText = "";

    switch (action) {
      case "bold":
        insertText = "**굵은 텍스트**";
        break;
      case "italic":
        insertText = "*기울임 텍스트*";
        break;
      case "heading1":
        insertText = "# 제목 1";
        break;
      case "heading2":
        insertText = "## 제목 2";
        break;
      case "list":
        insertText = "\n- 항목 1\n- 항목 2\n- 항목 3";
        break;
      case "orderedList":
        insertText = "\n1. 항목 1\n2. 항목 2\n3. 항목 3";
        break;
      case "quote":
        insertText = "> 인용문";
        break;
      case "code":
        insertText = "```\n코드 블록\n```";
        break;
      case "link":
        insertText = "[링크 텍스트](https://example.com)";
        break;
      case "image":
        insertText = "![이미지 설명](이미지 URL)";
        break;
    }

    setContent(
      (prev) =>
        prev +
        (prev.length > 0 && !prev.endsWith("\n") ? "\n" : "") +
        insertText
    );
  };

  // 마크다운 미리보기 렌더링
  const renderMarkdown = (text: string) => {
    // 실제 구현에서는 마크다운 라이브러리를 사용하여 HTML로 변환
    // 여기서는 간단한 변환만 수행

    const html = text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/# (.*?)$/gm, "<h1>$1</h1>")
      .replace(/## (.*?)$/gm, "<h2>$1</h2>")
      .replace(/- (.*?)$/gm, "<li>$1</li>")
      .replace(/> (.*?)$/gm, "<blockquote>$1</blockquote>")
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      .replace(/\[(.*?)\]$$(.*?)$$/g, '<a href="$2">$1</a>')
      .replace(/!\[(.*?)\]$$(.*?)$$/g, '<img src="$2" alt="$1" />')
      .replace(/\n/g, "<br />");

    return html;
  };

  // 폼 유효성 검사
  const validateForm = () => {
    if (!title.trim()) {
      toast.error("게시글 제목을 입력해주세요."); 
      return false;
    }

    if (!category) {
      toast.error("카테고리를 선택해주세요.");
      return false;
    }

    if (!content.trim()) {
      toast.error("게시글 내용을 입력해주세요.");
      return false;
    }

    return true;
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // 실제 구현에서는 API 호출로 대체
    setTimeout(() => {
      toast.success("게시글이 성공적으로 작성되었습니다.");
      navigate("/boards");
    }, 1500);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* 뒤로 가기 버튼 */}
      <Button
        variant='ghost'
        className='mb-6 text-gray-400 hover:text-white'
        onClick={() => navigate("/boards")}
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        게시판으로 돌아가기
      </Button>

      <div className='bg-[#1e2642] rounded-lg p-6'>
        <h1 className='text-2xl md:text-3xl font-bold text-white mb-6'>
          새 게시글 작성
        </h1>

        <form onSubmit={handleSubmit}>
          {/* 기본 정보 */}
          <div className='space-y-6 mb-8'>
            <div className='space-y-2'>
              <Label htmlFor='title' className='text-white'>
                게시글 제목 <span className='text-red-500'>*</span>
              </Label>
              <Input
                id='title'
                placeholder='게시글 제목을 입력하세요'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='bg-[#151b33] border-gray-700 text-white'
                maxLength={100}
              />
              <div className='text-right text-xs text-gray-400'>
                {title.length}/100
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='description' className='text-white'>
                간단한 설명
              </Label>
              <Textarea
                id='description'
                placeholder='게시글에 대한 간단한 설명을 입력하세요 (선택사항)'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='bg-[#151b33] border-gray-700 text-white'
                maxLength={200}
              />
              <div className='text-right text-xs text-gray-400'>
                {description.length}/200
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='category' className='text-white'>
                카테고리 <span className='text-red-500'>*</span>
              </Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className='bg-[#151b33] border-gray-700 text-white'>
                  <SelectValue placeholder='카테고리 선택' />
                </SelectTrigger>
                <SelectContent className='bg-[#1e2642] border-gray-700 text-white'>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className='bg-gray-700 my-8' />

          {/* 에디터 */}
          <div className='space-y-4 mb-8'>
            <Tabs
              value={activeTab}
              onValueChange={(value) =>
                setActiveTab(value as "write" | "preview")
              }
            >
              <div className='flex justify-between items-center mb-4'>
                <TabsList className='bg-[#151b33]'>
                  <TabsTrigger
                    value='write'
                    className='data-[state=active]:bg-blue-600'
                  >
                    작성
                  </TabsTrigger>
                  <TabsTrigger
                    value='preview'
                    className='data-[state=active]:bg-blue-600'
                  >
                    미리보기
                  </TabsTrigger>
                </TabsList>

                {activeTab === "write" && (
                  <div className='flex items-center gap-1'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white'
                            onClick={() => handleEditorAction("bold")}
                          >
                            <Bold className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>굵게</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white'
                            onClick={() => handleEditorAction("italic")}
                          >
                            <Italic className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>기울임</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white'
                            onClick={() => handleEditorAction("heading1")}
                          >
                            <Heading1 className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>제목 1</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white'
                            onClick={() => handleEditorAction("heading2")}
                          >
                            <Heading2 className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>제목 2</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Separator
                      orientation='vertical'
                      className='h-6 bg-gray-700 mx-1'
                    />

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white'
                            onClick={() => handleEditorAction("list")}
                          >
                            <List className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>목록</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white'
                            onClick={() => handleEditorAction("orderedList")}
                          >
                            <ListOrdered className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>번호 목록</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white'
                            onClick={() => handleEditorAction("quote")}
                          >
                            <Quote className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>인용구</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white'
                            onClick={() => handleEditorAction("code")}
                          >
                            <Code className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>코드 블록</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <Separator
                      orientation='vertical'
                      className='h-6 bg-gray-700 mx-1'
                    />

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white'
                            onClick={() => handleEditorAction("link")}
                          >
                            <LinkIcon className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>링크</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-8 w-8 text-gray-400 hover:text-white'
                            onClick={handleImageUpload}
                          >
                            <Image className='h-4 w-4' />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>이미지</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <input
                      type='file'
                      ref={fileInputRef}
                      className='hidden'
                      accept='image/*'
                      onChange={(e) => {
                        // 실제 구현에서는 이미지 업로드 처리
                        if (e.target.files && e.target.files[0]) {
                          handleEditorAction("image");
                        }
                      }}
                    />
                  </div>
                )}
              </div>

              <TabsContent value='write' className='mt-0'>
                <Textarea
                  placeholder='마크다운을 지원하는 에디터입니다. 게시글 내용을 작성해주세요.'
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className='bg-[#151b33] border-gray-700 text-white min-h-[300px] font-mono'
                />
              </TabsContent>

              <TabsContent value='preview' className='mt-0'>
                <div
                  className='bg-[#151b33] border border-gray-700 rounded-md p-4 min-h-[300px] prose prose-invert max-w-none'
                  dangerouslySetInnerHTML={{
                    __html: content
                      ? renderMarkdown(content)
                      : '<p class="text-gray-500">내용을 입력하면 미리보기가 표시됩니다.</p>',
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          <Separator className='bg-gray-700 my-8' />

          {/* 태그 */}
          <div className='space-y-4 mb-8'>
            <Label className='text-white'>태그</Label>

            <div className='flex flex-wrap gap-2 mb-4'>
              {tags.map((tag, index) => (
                <Badge
                  key={tag}
                  className={`${tagColors[index % tagColors.length]} hover:${
                    tagColors[index % tagColors.length]
                  }`}
                >
                  {tag}
                  <button
                    type='button'
                    className='ml-1 hover:text-white'
                    onClick={() => removeTag(tag)}
                  >
                    <X className='h-3 w-3' />
                  </button>
                </Badge>
              ))}

              {tags.length === 0 && (
                <span className='text-gray-400 text-sm'>
                  태그가 없습니다. 태그를 추가해보세요.
                </span>
              )}
            </div>

            <div className='flex gap-2'>
              <Input
                placeholder='태그 입력 (최대 5개)'
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className='bg-[#151b33] border-gray-700 text-white'
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button
                type='button'
                onClick={addTag}
                disabled={tags.length >= 5}
                className='bg-blue-600 hover:bg-blue-700'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </div>
            <p className='text-xs text-gray-400'>
              Enter 키를 누르거나 추가 버튼을 클릭하여 태그를 추가할 수
              있습니다.
            </p>
          </div>

          {/* 제출 버튼 */}
          <div className='flex justify-end gap-4 mt-8'>
            <Button
              type='button'
              variant='outline'
              className='border-gray-700 text-gray-300 hover:text-white'
              onClick={() => navigate("/boards")}
            >
              취소
            </Button>

            <Button
              type='submit'
              className='bg-blue-600 hover:bg-blue-700'
              disabled={isSubmitting}
            >
              <Save className='mr-2 h-4 w-4' />
              {isSubmitting ? "게시 중..." : "게시하기"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BoardCreatePage;
