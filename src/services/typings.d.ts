// @ts-ignore
/* eslint-disable */

declare namespace API {
  type LoginParams = {
    account: string,
    password: string
  }
  type UpdateQuestionsParams = {
    id?: number,
    date: Date,
    type: number,
    title: string,
    content?: string,
    answer: string,
    img?: any,
  }

  type BuildExamPaperParams = {
    date: Date,
    conditions: {
      type: number,
      count: number,
    }[]
  }


  type LoginResult = {
    status?: string;
    type?: string;
  };
  type UserInfo = {
    id: number,
    name: string,
    token: string,
  }
}
