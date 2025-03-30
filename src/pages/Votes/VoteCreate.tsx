import type React from "react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Eye,
  Save,
  Palette,
  AlertCircle,
  ChevronDown,
  ChevronUp,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Separator } from "../../components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { toast } from "sonner";

// 카테고리 목록
const categories = [
  "프로그래밍",
  "기술 트렌드",
  "개발 문화",
  "개발 도구",
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
  "기타",
];

// 기본 색상 팔레트
const colorPalette = [
  "#3498db", // 파랑
  "#f1c40f", // 노랑
  "#e74c3c", // 빨강
  "#2ecc71", // 초록
  "#9b59b6", // 보라
  "#1abc9c", // 청록
  "#e67e22", // 주황
  "#34495e", // 남색
  "#7f8c8d", // 회색
  "#d35400", // 갈색
];

// 날짜 포맷 함수
const formatDate = (date: Date) => {
  return date.toISOString().split("T")[0];
};

// 시간 포맷 함수
const formatTime = (date: Date) => {
  return date.toTimeString().split(" ")[0].substring(0, 5);
};

// 현재 날짜에서 7일 후 날짜 계산
const getDefaultEndDate = () => {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date;
};

const VoteCreatePage = () => {
  const navigate = useNavigate();

  // 폼 상태
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [options, setOptions] = useState([
    { id: "1", text: "", color: colorPalette[0] },
    { id: "2", text: "", color: colorPalette[1] },
  ]);
  const [endDate, setEndDate] = useState(formatDate(getDefaultEndDate()));
  const [endTime, setEndTime] = useState("23:59");
  const [isMultipleChoice, setIsMultipleChoice] = useState(false);
  const [maxSelections, setMaxSelections] = useState(1);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showResults, setShowResults] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 미리보기 상태
  const [showPreview, setShowPreview] = useState(false);

  // 옵션 추가
  const addOption = () => {
    if (options.length >= 10) {
      toast.error("최대 10개까지 옵션을 추가할 수 있습니다.");
      return;
    }

    const newId = (options.length + 1).toString();
    const newColor = colorPalette[options.length % colorPalette.length];
    setOptions([...options, { id: newId, text: "", color: newColor }]);
  };

  // 옵션 삭제
  const removeOption = (id: string) => {
    if (options.length <= 2) {
      toast.error("최소 2개의 옵션이 필요합니다.");
      return;
    }

    setOptions(options.filter((option) => option.id !== id));
  };

  // 옵션 텍스트 변경
  const handleOptionTextChange = (id: string, text: string) => {
    setOptions(
      options.map((option) => (option.id === id ? { ...option, text } : option))
    );
  };

  // 옵션 색상 변경
  const handleOptionColorChange = (id: string, color: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, color } : option
      )
    );
  };

  // 옵션 순서 변경 (위로)
  const moveOptionUp = (index: number) => {
    if (index === 0) return;

    const newOptions = [...options];
    const temp = newOptions[index];
    newOptions[index] = newOptions[index - 1];
    newOptions[index - 1] = temp;
    setOptions(newOptions);
  };

  // 옵션 순서 변경 (아래로)
  const moveOptionDown = (index: number) => {
    if (index === options.length - 1) return;

    const newOptions = [...options];
    const temp = newOptions[index];
    newOptions[index] = newOptions[index + 1];
    newOptions[index + 1] = temp;
    setOptions(newOptions);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    if (!title.trim()) {
      toast.error("투표 제목을 입력해주세요.");
      return false;
    }

    if (!category) {
      toast.error("카테고리를 선택해주세요.");
      return false;
    }

    const emptyOptions = options.filter((option) => !option.text.trim());
    if (emptyOptions.length > 0) {
      toast.error("모든 옵션에 텍스트를 입력해주세요.");
      return false;
    }

    const endDateTime = new Date(`${endDate}T${endTime}:00`);
    if (endDateTime <= new Date()) {
      toast.error("마감일은 현재 시간 이후로 설정해주세요.");
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
      toast.success("투표가 성공적으로 생성되었습니다.");
      navigate("/votes");
    }, 1500);
  };

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* 뒤로 가기 버튼 */}
      <Button
        variant='ghost'
        className='mb-6 text-gray-400 hover:text-white'
        onClick={() => navigate("/votes")}
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        투표 목록으로 돌아가기
      </Button>

      <div className='flex flex-col lg:flex-row gap-8'>
        {/* 폼 섹션 */}
        <div className='w-full lg:w-2/3'>
          <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
            <h1 className='text-2xl md:text-3xl font-bold text-white mb-6'>
              새 투표 만들기
            </h1>

            <form onSubmit={handleSubmit}>
              {/* 기본 정보 */}
              <div className='space-y-6 mb-8'>
                <div className='space-y-2'>
                  <Label htmlFor='title' className='text-white'>
                    투표 제목 <span className='text-red-500'>*</span>
                  </Label>
                  <Input
                    id='title'
                    placeholder='투표 제목을 입력하세요'
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
                    투표 설명
                  </Label>
                  <Textarea
                    id='description'
                    placeholder='투표에 대한 설명을 입력하세요 (선택사항)'
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className='bg-[#151b33] border-gray-700 text-white min-h-[100px]'
                    maxLength={500}
                  />
                  <div className='text-right text-xs text-gray-400'>
                    {description.length}/500
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

              {/* 투표 옵션 */}
              <div className='space-y-6 mb-8'>
                <div className='flex justify-between items-center'>
                  <h2 className='text-xl font-bold text-white'>투표 옵션</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type='button'
                          onClick={addOption}
                          className='bg-blue-600 hover:bg-blue-700'
                        >
                          <Plus className='mr-2 h-4 w-4' />
                          옵션 추가
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>최대 10개까지 옵션을 추가할 수 있습니다.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className='space-y-4'>
                  {options.map((option, index) => (
                    <div
                      key={option.id}
                      className='flex items-center gap-3 bg-[#151b33] p-4 rounded-lg border border-gray-700'
                    >
                      <div
                        className='w-6 h-6 rounded-full flex-shrink-0'
                        style={{ backgroundColor: option.color }}
                      />

                      <div className='flex-grow'>
                        <Input
                          placeholder={`옵션 ${index + 1}`}
                          value={option.text}
                          onChange={(e) =>
                            handleOptionTextChange(option.id, e.target.value)
                          }
                          className='bg-[#151b33] border-gray-700 text-white'
                          maxLength={100}
                        />
                      </div>

                      <div className='flex items-center gap-2'>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              type='button'
                              variant='outline'
                              size='icon'
                              className='h-8 w-8 border-gray-700'
                            >
                              <Palette className='h-4 w-4 text-gray-400' />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className='w-64 bg-[#1e2642] border-gray-700 p-3'>
                            <div className='grid grid-cols-5 gap-2'>
                              {colorPalette.map((color) => (
                                <button
                                  key={color}
                                  type='button'
                                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                                    option.color === color
                                      ? "ring-2 ring-white"
                                      : ""
                                  }`}
                                  style={{ backgroundColor: color }}
                                  onClick={() =>
                                    handleOptionColorChange(option.id, color)
                                  }
                                />
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>

                        <div className='flex flex-col'>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-6 w-6 text-gray-400 hover:text-white'
                            onClick={() => moveOptionUp(index)}
                            disabled={index === 0}
                          >
                            <ChevronUp className='h-4 w-4' />
                          </Button>
                          <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            className='h-6 w-6 text-gray-400 hover:text-white'
                            onClick={() => moveOptionDown(index)}
                            disabled={index === options.length - 1}
                          >
                            <ChevronDown className='h-4 w-4' />
                          </Button>
                        </div>

                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='h-8 w-8 text-gray-400 hover:text-red-500'
                          onClick={() => removeOption(option.id)}
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className='bg-gray-700 my-8' />

              {/* 투표 설정 */}
              <div className='space-y-6 mb-8'>
                <h2 className='text-xl font-bold text-white'>투표 설정</h2>

                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='endDate' className='text-white'>
                        마감일 <span className='text-red-500'>*</span>
                      </Label>
                      <div className='flex items-center gap-2'>
                        <Calendar className='h-5 w-5 text-gray-400' />
                        <Input
                          id='endDate'
                          type='date'
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className='bg-[#151b33] border-gray-700 text-white'
                          min={formatDate(new Date())}
                        />
                      </div>
                    </div>

                    <div className='space-y-2'>
                      <Label htmlFor='endTime' className='text-white'>
                        마감 시간 <span className='text-red-500'>*</span>
                      </Label>
                      <div className='flex items-center gap-2'>
                        <Clock className='h-5 w-5 text-gray-400' />
                        <Input
                          id='endTime'
                          type='time'
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className='bg-[#151b33] border-gray-700 text-white'
                        />
                      </div>
                    </div>
                  </div>

                  <Accordion type='single' collapsible className='w-full'>
                    <AccordionItem
                      value='advanced-settings'
                      className='border-gray-700'
                    >
                      <AccordionTrigger className='text-white hover:text-blue-400'>
                        고급 설정
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className='space-y-4 pt-2'>
                          <div className='flex items-center justify-between'>
                            <div>
                              <Label
                                htmlFor='multiple-choice'
                                className='text-white'
                              >
                                복수 선택 허용
                              </Label>
                              <p className='text-sm text-gray-400'>
                                참여자가 여러 옵션을 선택할 수 있습니다.
                              </p>
                            </div>
                            <Switch
                              id='multiple-choice'
                              checked={isMultipleChoice}
                              onCheckedChange={setIsMultipleChoice}
                            />
                          </div>

                          {isMultipleChoice && (
                            <div className='space-y-2 pl-4 border-l-2 border-gray-700'>
                              <Label
                                htmlFor='max-selections'
                                className='text-white'
                              >
                                최대 선택 가능 수
                              </Label>
                              <Select
                                value={maxSelections.toString()}
                                onValueChange={(value) =>
                                  setMaxSelections(Number.parseInt(value))
                                }
                              >
                                <SelectTrigger className='bg-[#151b33] border-gray-700 text-white w-24'>
                                  <SelectValue placeholder='선택' />
                                </SelectTrigger>
                                <SelectContent className='bg-[#1e2642] border-gray-700 text-white'>
                                  {Array.from(
                                    { length: Math.min(options.length, 5) },
                                    (_, i) => i + 1
                                  ).map((num) => (
                                    <SelectItem
                                      key={num}
                                      value={num.toString()}
                                    >
                                      {num}개
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <Separator className='bg-gray-700' />

                          <div className='flex items-center justify-between'>
                            <div>
                              <Label htmlFor='anonymous' className='text-white'>
                                익명 투표
                              </Label>
                              <p className='text-sm text-gray-400'>
                                투표 참여자의 정보가 공개되지 않습니다.
                              </p>
                            </div>
                            <Switch
                              id='anonymous'
                              checked={isAnonymous}
                              onCheckedChange={setIsAnonymous}
                            />
                          </div>

                          <Separator className='bg-gray-700' />

                          <div className='flex items-center justify-between'>
                            <div>
                              <Label
                                htmlFor='show-results'
                                className='text-white'
                              >
                                결과 공개
                              </Label>
                              <p className='text-sm text-gray-400'>
                                투표 참여 후 결과를 볼 수 있습니다.
                              </p>
                            </div>
                            <Switch
                              id='show-results'
                              checked={showResults}
                              onCheckedChange={setShowResults}
                            />
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>

              {/* 제출 버튼 */}
              <div className='flex justify-end gap-4 mt-8'>
                <Button
                  type='button'
                  variant='outline'
                  className='border-gray-700 text-gray-300 hover:text-white'
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className='mr-2 h-4 w-4' />
                  {showPreview ? "미리보기 닫기" : "미리보기"}
                </Button>

                <Button
                  type='submit'
                  className='bg-blue-600 hover:bg-blue-700'
                  disabled={isSubmitting}
                >
                  <Save className='mr-2 h-4 w-4' />
                  {isSubmitting ? "생성 중..." : "투표 생성하기"}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* 미리보기 섹션 */}
        {showPreview && (
          <div className='w-full lg:w-1/3'>
            <div className='sticky top-6'>
              <div className='bg-[#1e2642] rounded-lg p-6 mb-6'>
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-xl font-bold text-white'>미리보기</h2>
                  <Badge className='bg-blue-600'>미리보기</Badge>
                </div>

                <Card className='bg-[#151b33] border-gray-700'>
                  <CardHeader className='pb-2'>
                    <div className='flex justify-between items-start'>
                      <div className='flex flex-wrap gap-2'>
                        <Badge className='bg-blue-600 hover:bg-blue-700'>
                          {category || "카테고리"}
                        </Badge>
                        <Badge className='bg-green-600 hover:bg-green-700'>
                          진행 중
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className='text-xl text-white mt-2'>
                      {title || "투표 제목"}
                    </CardTitle>
                    {description && (
                      <CardDescription className='text-gray-300 mt-1'>
                        {description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className='mt-3 space-y-3'>
                      {options
                        .filter((option) => option.text)
                        .map((option) => (
                          <div key={option.id} className='space-y-1'>
                            <div className='flex justify-between text-sm'>
                              <div className='flex items-center'>
                                <div
                                  className='w-3 h-3 rounded-full mr-2'
                                  style={{ backgroundColor: option.color }}
                                />
                                <span className='text-white'>
                                  {option.text}
                                </span>
                              </div>
                              <span className='text-gray-400'>0%</span>
                            </div>
                            <div className='w-full bg-[#1a2035] rounded-full h-2.5'>
                              <div
                                className='h-2.5 rounded-full w-0'
                                style={{ backgroundColor: option.color }}
                              />
                            </div>
                          </div>
                        ))}

                      {options.filter((option) => option.text).length === 0 && (
                        <div className='text-center py-4 text-gray-400'>
                          <AlertCircle className='h-8 w-8 mx-auto mb-2' />
                          <p>옵션을 추가해주세요</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className='border-t border-gray-700 pt-3 flex justify-between'>
                    <div className='text-sm text-gray-400'>
                      <span className='text-green-400'>
                        {endDate && endTime
                          ? `${endDate} ${endTime}까지`
                          : "마감일 미설정"}
                      </span>
                    </div>
                    <div className='text-sm text-gray-400'>총 0명 참여</div>
                  </CardFooter>
                </Card>

                <div className='mt-6 text-center'>
                  <p className='text-sm text-gray-400'>
                    이 미리보기는 실제 투표의 모습과 다를 수 있습니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteCreatePage;
