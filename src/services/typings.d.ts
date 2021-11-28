// @ts-ignore
/* eslint-disable */

declare namespace API {
  type LoginParams = {
    account: string;
    password: string;
  };
  type UpdateQuestionsParams = {
    id?: number;
    date: Date;
    type: number;
    title: string;
    content?: string;
    answer: string;
    questionImg?: any;
    answerImg?: any;
  };

  type BuildExamPaperParams = {
    date: Date;
    conditions: {
      subjectType: number;
      questionType: number;
      knowledgeType: number;
      count: number;
      score: number;
    }[];
  };

  type LoginResult = {
    status?: string;
    type?: string;
  };
  type UserInfo = {
    id: number;
    name: string;
    token: string;
  };
}
