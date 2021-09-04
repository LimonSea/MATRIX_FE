import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { useRequest, Link, history, useModel } from 'umi';
import Footer from '@/components/Footer';

import { login } from '@/services/api';
import styles from './index.less';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({}); // 登录失败状态
  const [type, setType] = useState<string>('account'); // tab 切换
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const currentUser = await initialState?.fetchUserInfo?.();

    if (currentUser) {
      await setInitialState((s: any) => ({ ...s, currentUser }));
    }
  };

  // 登录
  const {
    loading: loginLoading,
    run: loginRun,
  } = useRequest(login, {
    manual: true,
    onSuccess: async (res) => {
      if (res?.token) {
        // 存储 token
        localStorage.setItem('token', res.token);

        message.success('登录成功');
        await fetchUserInfo();

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || '/questionList');
      } else {
        setUserLoginState({status: 'error'});
      }
    },
  });


  // const handleSubmit = async (values: API.LoginParams) => {
  //   loginRun(values);
  //   try {
  //     // 登录
  //     const msg = await login({ ...values, type });

  //     if (msg.status === 'ok') {
  //       const defaultLoginSuccessMessage = '登录成功！';
  //       message.success(defaultLoginSuccessMessage);
  //       await fetchUserInfo();
  //       /** 此方法会跳转到 redirect 参数所在的位置 */

  //       if (!history) return;
  //       const { query } = history.location;
  //       const { redirect } = query as {
  //         redirect: string;
  //       };
  //       history.push(redirect || '/');
  //       return;
  //     } // 如果失败去设置用户错误信息

  //     setUserLoginState(msg);
  //   } catch (error) {
  //     const defaultLoginFailureMessage = '登录失败，请重试！';
  //     message.error(defaultLoginFailureMessage);
  //   }
  // };

  const { status } = userLoginState;
  return (
    <div className={styles.container}>
      {/* header空白 */}
      <div className={styles.lang}></div>
      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.header}>
            <Link to="/">
              <img alt="logo" className={styles.logo} src="/logo.svg" />
              <span className={styles.title}>MATRIX</span>
            </Link>
          </div>
          <div className={styles.desc}>出题系统</div>
        </div>

        <div className={styles.main}>
          <ProForm
            initialValues={{
              autoLogin: true,
            }}
            submitter={{
              searchConfig: {
                submitText: '登录',
              },
              render: (_, dom) => dom.pop(),
              submitButtonProps: {
                loading: loginLoading,
                size: 'large',
                style: {
                  width: '100%',
                },
              },
            }}
            onFinish={async (values) => {
              loginRun(values as API.LoginParams);
            }}
          >
            <Tabs activeKey={type} onChange={setType}>
              <Tabs.TabPane key="account" tab={'账户密码登录'} />
            </Tabs>

            {status === 'error' && (
              <LoginMessage content={'错误的用户名和密码(admin/ant.design)'} />
            )}
            {type === 'account' && (
              <>
                <ProFormText
                  name="account"
                  fieldProps={{
                    size: 'large',
                    prefix: <UserOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={'用户名: admin or user'}
                  rules={[
                    {
                      required: true,
                      message: '用户名是必填项！',
                    },
                  ]}
                />
                <ProFormText.Password
                  name="password"
                  fieldProps={{
                    size: 'large',
                    prefix: <LockOutlined className={styles.prefixIcon} />,
                  }}
                  placeholder={'密码: ant.design'}
                  rules={[
                    {
                      required: true,
                      message: '密码是必填项！',
                    },
                  ]}
                />
              </>
            )}

            {/* <div
              style={{
                marginBottom: 24,
                overflow: 'hidden',
              }}
              >
              <a
                style={{
                  float: 'right',
                }}
              >
                <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
              </a>
            </div> */}
          </ProForm>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
