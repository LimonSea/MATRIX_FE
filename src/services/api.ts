// 所有的接口，后续如果很多的时候可以拆开
/* eslint-disable */
import request from './request';

/** 获取当前的用户 GET /getCurrentUser */
export async function getCurrentUser() {
  return request('/getCurrentUser');
}

/** 登录 POST /login */
export async function login(data: API.LoginParams) {
  return request('/login', { method: 'POST', data });
}

/** 查询类目 GET /queryTypes */
export async function queryTypes() {
  return request('/queryTypes');
}

/** 查询题目列表 GET /queryQuestions */
export async function queryQuestions() {
  return request('/queryQuestions');
}

/** 题目修改/创建 POST /updateQuestions */
export async function updateQuestions(data: API.UpdateQuestionsParams) {
  return request('/updateQuestions', { method: 'POST', data });
}

/** 上传图片 GET /uploadfile */
export async function uploadfile(file: any) {
  return request('/uploadfile', { method: 'POST', file });
}

/** 组卷 POST /buildExamPaper */
export async function buildExamPaper(data: API.BuildExamPaperParams) {
  return request('/buildExamPaper', { method: 'POST', data });
}

/** 查询已生成的卷子列表 GET /queryExamPapers */
export async function queryExamPapers() {
  return request('/queryExamPapers');
}

