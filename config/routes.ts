export default [
  {
    path: '/user',
    layout: false,
    routes: [
      { path: '/user', routes: [{ name: '登录', path: '/user/login', component: './user/Login' }] },
      { component: './404' },
    ],
  },
  { path: '/questionList', name: '题目列表', icon: 'border', component: './QuestionList' },
  { path: '/examList', name: '试卷列表', icon: 'build', component: './ExamList' },
  { path: '/', redirect: '/questionList' },
  { component: './404' },
];
