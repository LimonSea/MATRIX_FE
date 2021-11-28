import React, { useRef, useState, useEffect } from 'react';
import { Button, Descriptions, message, Modal } from 'antd';
import { useRequest } from 'umi';
import moment from 'moment';
// import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
} from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';

import { queryTypes, queryQuestions, updateQuestions } from '@/services/api';
import { prefix } from '@/services/request';

const QuestionList = () => {
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [detailModalVisible, handleDetailModalVisible] = useState<boolean>(false);
  const [detail, setDetail] = useState<any>(null);
  const [types, setTypes] = useState<any>({}); // 包含：科目类型，题目类型，知识点类型 数组
  const [searchValue, setSearchValue] = useState<any>(''); // 用户输入搜索的值
  const actionRef = useRef<ActionType>(); // table 的 ref
  const modalFormRef = useRef<ProFormInstance>(); // 新建 modal 的 ref

  // 查询类型 map
  const getTypesRequest = useRequest(queryTypes, {
    manual: true,
    onSuccess: (data = {}) => {
      setTypes(data || {});
    },
  });
  const editRequest = useRequest(updateQuestions, {
    manual: true,
    onSuccess: () => {
      message.success('添加成功');
      handleCreateModalVisible(false);
      actionRef.current?.reloadAndRest?.();
      modalFormRef.current?.resetFields();
    },
  });

  useEffect(() => {
    getTypesRequest.run();
  }, [createModalVisible]);

  const columns: ProColumns<API.UpdateQuestionsParams>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      search: false,
      render: (dom, entity, index) => {
        return index + 1;
      },
    },
    {
      title: '科目类型',
      dataIndex: 'subjectType',
      valueEnum: types?.subjectTypeList || [],
    },
    {
      title: '题目类型',
      dataIndex: 'questionType',
      valueEnum: types?.questionTypeList || [],
    },
    {
      title: '知识点类型',
      dataIndex: 'knowledgeType',
      valueEnum: types?.knowledgeTypeList || [],
    },
    {
      title: '标题',
      dataIndex: 'title',
    },
    {
      title: '年份',
      dataIndex: 'date',
      render: (dom: string) => {
        return moment(dom).format('YYYY-MM-DD');
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 200,
      render: (_, record) => [
        <Button
          type="link"
          onClick={() => {
            setDetail(record);
            handleDetailModalVisible(true);
          }}
        >
          详情
        </Button>,
        <Button type="link">删除</Button>,
      ],
    },
  ];

  return (
    <>
      <ProTable<API.UpdateQuestionsParams>
        headerTitle={'题目列表'}
        actionRef={actionRef}
        rowKey="id"
        search={false}
        pagination={false}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={queryQuestions}
        columns={columns}
      />
      <Modal
        title="题目详情"
        visible={detailModalVisible}
        width={1000}
        footer={null}
        onCancel={() => {
          setDetail(null);
          handleDetailModalVisible(false);
        }}
      >
        {detail && (
          <Descriptions bordered>
            <Descriptions.Item label="科目类型">{detail.subjectType}</Descriptions.Item>
            <Descriptions.Item label="题目类型">{detail.questionType}</Descriptions.Item>
            <Descriptions.Item label="知识点类型">{detail.knowledgeType}</Descriptions.Item>
            <Descriptions.Item label="题目年份" span={2}>
              {moment(detail.date).format('YYYY-MM-DD')}
            </Descriptions.Item>
            <Descriptions.Item label="题目标题" span={3}>
              {detail.title}
            </Descriptions.Item>
            <Descriptions.Item label="题目内容" span={3} style={{ whiteSpace: 'pre-wrap' }}>
              {detail.content || '-'}
            </Descriptions.Item>
            {detail.questionImg && (
              <Descriptions.Item label="题目图片" span={3}>
                <img src={detail.questionImg} />
              </Descriptions.Item>
            )}
            <Descriptions.Item label="答案" span={3}>
              {detail.answer}
            </Descriptions.Item>
            {detail.answerImg && (
              <Descriptions.Item label="答案图片" span={3}>
                <img src={detail.answerImg} />
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
      <ModalForm
        title={'创建题目'}
        width="800px"
        layout="horizontal"
        formRef={modalFormRef}
        visible={createModalVisible}
        onVisibleChange={handleCreateModalVisible}
        modalProps={{
          destroyOnClose: true,
          confirmLoading: editRequest.loading,
        }}
        onFinish={async (value: API.UpdateQuestionsParams) => {
          const newParams = {
            content: '',
            ...value,
          };
          if (value?.questionImg) {
            newParams.questionImg = value?.questionImg?.[0]?.response?.data;
          }
          if (value?.answerImg) {
            newParams.answerImg = value?.answerImg?.[0]?.response?.data;
          }
          editRequest.run(newParams);
        }}
      >
        <ProFormSelect
          name="subjectType"
          label="科目类型"
          width="sm"
          rules={[
            {
              required: true,
              message: '科目类型为必选项',
            },
          ]}
          request={async (v) => {
            const newTypes = (types?.subjectTypeList || []).map((name) => ({
              label: name,
              value: name,
            }));
            if (v.searchValue) {
              newTypes.push({
                label: v.searchValue,
                value: v.searchValue,
              });
            }
            return newTypes;
          }}
          params={{ searchValue }}
          fieldProps={{
            showSearch: true,
            onSearch: (value) => {
              setSearchValue(value);
            },
            onChange: () => {
              setSearchValue('');
            },
          }}
        />
        <ProFormSelect
          name="questionType"
          label="题目类型"
          width="sm"
          rules={[
            {
              required: true,
              message: '题目类型为必选项',
            },
          ]}
          request={async (v) => {
            const newTypes = (types?.questionTypeList || []).map((name) => ({
              label: name,
              value: name,
            }));
            if (v.searchValue) {
              newTypes.push({
                label: v.searchValue,
                value: v.searchValue,
              });
            }
            return newTypes;
          }}
          params={{ searchValue }}
          fieldProps={{
            showSearch: true,
            onSearch: (value) => {
              setSearchValue(value);
            },
            onChange: () => {
              setSearchValue('');
            },
          }}
        />
        <ProFormSelect
          name="knowledgeType"
          label="知识点类型"
          width="sm"
          rules={[
            {
              required: true,
              message: '知识点类型为必选项',
            },
          ]}
          request={async (v) => {
            const newTypes = (types?.knowledgeTypeList || []).map((name) => ({
              label: name,
              value: name,
            }));
            if (v.searchValue) {
              newTypes.push({
                label: v.searchValue,
                value: v.searchValue,
              });
            }
            return newTypes;
          }}
          params={{ searchValue }}
          fieldProps={{
            showSearch: true,
            onSearch: (value) => {
              setSearchValue(value);
            },
            onChange: () => {
              setSearchValue('');
            },
          }}
        />
        <ProFormDatePicker
          name="date"
          label="题目年份"
          rules={[
            {
              required: true,
              message: '题目年份为必填项',
            },
          ]}
        />
        <ProFormText
          label="标题"
          name="title"
          rules={[
            {
              required: true,
              message: '标题为必填项',
            },
          ]}
        />
        <ProFormTextArea label="内容" name="content" />
        <ProFormUploadButton
          extra="支持扩展名：.jpg .png"
          label="题目图片"
          name="questionImg"
          title="上传图片"
          action={`${prefix}/uploadfile`}
          max={1}
        />
        <ProFormTextArea
          label="答案"
          name="answer"
          rules={[
            {
              required: true,
              message: '答案为必填项',
            },
          ]}
        />
        <ProFormUploadButton
          extra="支持扩展名：.jpg .png"
          label="答案图片"
          name="answerImg"
          title="上传图片"
          action={`${prefix}/uploadfile`}
          max={1}
        />
      </ModalForm>
    </>
  );
};

export default QuestionList;
