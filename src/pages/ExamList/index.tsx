import React, { useRef, useState } from 'react';
import { Button, message, Modal } from 'antd';
import { useRequest } from 'umi';
import moment from 'moment';
// import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, EditableProTable } from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormDatePicker, ProFormText } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';

import { queryTypes, queryExamPapers, buildExamPaper } from '@/services/api';

type DataSourceType = {
  subjectType: number;
  questionType: number;
  knowledgeType: number;
  score: number;
  count: number;
};

const ExamList = () => {
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<any>({}); // 包含：科目类型，题目类型，知识点类型 数组
  const actionRef = useRef<ActionType>(); // table 的 ref
  const modalFormRef = useRef<ProFormInstance>(); // 新建 modal 的 ref
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  // 查询类型 map
  useRequest(queryTypes, {
    onSuccess: (data = {}) => {
      setTypes(data || {});
    },
  });

  const buildExamPaperRequest = useRequest(buildExamPaper, {
    manual: true,
    onSuccess: () => {
      message.success('添加成功');
      handleCreateModalVisible(false);
      actionRef.current?.reloadAndRest?.();
      modalFormRef.current?.resetFields();
    },
  });

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
      title: '标题',
      dataIndex: 'title',
      search: false,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (_, record: any) => {
        return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: '试卷文档',
      dataIndex: 'questionUrl',
      render: (dom: string) => {
        return (
          <a href={dom} target="_blank" download>
            下载
          </a>
        );
      },
    },
    {
      title: '试卷&答案文档',
      dataIndex: 'answerUrl',
      render: (dom: string) => {
        return (
          <a href={dom} target="_blank" download>
            下载
          </a>
        );
      },
    },
  ];

  const editColumns: ProColumns<DataSourceType>[] = [
    {
      title: '科目类型',
      dataIndex: 'subjectType',
      valueEnum: () => {
        const valueEnum = {};
        (types?.subjectTypeList || []).forEach((item) => {
          valueEnum[item] = { text: item };
        });
        return valueEnum;
      },
    },
    {
      title: '题目类型',
      dataIndex: 'questionType',
      valueEnum: () => {
        const valueEnum = {};
        (types?.questionTypeList || []).forEach((item) => {
          valueEnum[item] = { text: item };
        });
        return valueEnum;
      },
    },
    {
      title: '知识点类型',
      dataIndex: 'knowledgeType',
      valueEnum: () => {
        const valueEnum = {};
        (types?.knowledgeTypeList || []).forEach((item) => {
          valueEnum[item] = { text: item };
        });
        return valueEnum;
      },
    },
    {
      title: '数量',
      dataIndex: 'count',
      valueType: 'digit',
    },
    {
      title: '单个题目分数',
      dataIndex: 'score',
      valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
    },
  ];

  return (
    <>
      <ProTable<API.UpdateQuestionsParams>
        headerTitle={'试卷列表'}
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
            <PlusOutlined /> 随机组卷
          </Button>,
        ]}
        request={queryExamPapers}
        columns={columns}
      />
      <ModalForm
        title={'随机组卷'}
        width="1200px"
        layout="horizontal"
        formRef={modalFormRef}
        visible={createModalVisible}
        onVisibleChange={handleCreateModalVisible}
        modalProps={{
          confirmLoading: buildExamPaperRequest.loading,
        }}
        onFinish={async (value: API.BuildExamPaperParams) => {
          const { conditions = [] } = value;
          const allFill = conditions.some(
            (item) =>
              item.subjectType &&
              item.questionType &&
              item.knowledgeType &&
              item.count &&
              item.score,
          );
          if (allFill) {
            let totalScore = 0;
            conditions.forEach((item) => {
              totalScore += item.count * item.score;
            });
            if (totalScore !== 100) {
              Modal.confirm({
                title: `当前总分为${totalScore}， 不是100分，是否继续组卷？`,
                icon: <ExclamationCircleOutlined />,
                onOk() {
                  buildExamPaperRequest.run(value);
                },
              });
            } else {
              buildExamPaperRequest.run(value);
            }
          } else {
            message.error('请填写完整的试卷类型、数量及分数');
          }
        }}
      >
        <ProFormText
          label="试卷标题"
          name="title"
          rules={[
            {
              required: true,
              message: '试卷标题为必填项',
            },
          ]}
        />
        <ProFormDatePicker
          name="date"
          label="选择此日期之前的试题"
          rules={[
            {
              required: true,
              message: '题目日期为必填项',
            },
          ]}
        />
        <ProForm.Item
          label="试题类型及数量"
          name="conditions"
          trigger="onValuesChange"
          rules={[
            {
              required: true,
              message: '试题类型及数量为必填项',
            },
          ]}
        >
          <EditableProTable<DataSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={editColumns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'bottom',
              creatorButtonText: '新增一行',
              record: () => ({
                id: Date.now(),
              }),
            }}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete];
              },
            }}
          />
        </ProForm.Item>
      </ModalForm>
    </>
  );
};

export default ExamList;
