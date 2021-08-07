// @ts-ignore
/* eslint-disable */

declare namespace API {
  type LoginParams = {
    account: string,
    password: string
  }
  type updateQuestionsParams = {
    id?: number,
    type: number,
    title: string,
    content: string,
    answer: string,
    img?: string,
  }

  type buildExamPaperItemsParams = {
    type: number,
    count: number,
  }
  type buildExamPaperParams = buildExamPaperItemsParams[]


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
