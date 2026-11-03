export interface DiaryEntry {
  id: string;
  situation: string;
  thought: string;
  emotion: string;
  intensityBefore: number;
  alternativeThought: string;
  intensityAfter: number;
  createdAt: string;
}
