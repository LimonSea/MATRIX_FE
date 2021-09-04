import React, { useRef, useState } from 'react';
import { Button, message } from 'antd';
import { useRequest } from 'umi';
import moment from 'moment';
// import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType, EditableProTable } from '@ant-design/pro-table';
import ProForm, { ModalForm, ProFormDatePicker } from '@ant-design/pro-form';
import type { ProFormInstance } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';

import { queryTypes, queryExamPapers, buildExamPaper } from '@/services/api';

type DataSourceType = {
  type: number;
  count: number;
};

const ExamList = () => {
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<any>({});
  const actionRef = useRef<ActionType>(); // table 的 ref
  const modalFormRef = useRef<ProFormInstance>(); // 新建 modal 的 ref
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  // 查询类型 map
  useRequest(queryTypes, {
    onSuccess: (data = []) => {
      const newTypes = {};
      data.forEach(item => {
        newTypes[item.code] = {
          text: item.name,
        }
      });
      setTypes(newTypes);
    }
  });
  const buildExamPaperRequest = useRequest(buildExamPaper, {
    manual: true,
    onSuccess: (data) => {
      message.success('添加成功');
      handleCreateModalVisible(false);
      actionRef.current?.reloadAndRest?.();
      modalFormRef.current?.resetFields();
    }
  })

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
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: (_, record: any) => {
        return moment(record.createTime).format('YYYY-MM-DD HH:mm:ss');
      }
    },
    {
      title: '试卷文档',
      dataIndex: 'questionUrl',
      render: (dom: string) => {
        return <a href={dom} target="_blank" download>下载</a>
      }
    },
    {
      title: '试卷&答案文档',
      dataIndex: 'answerUrl',
      render: (dom: string) => {
        return <a href={dom} target="_blank" download>下载</a>
      }
    }
  ];

  const editColumns: ProColumns<DataSourceType>[] = [
    {
      title: '类型',
      dataIndex: 'type',
      valueEnum: types,
    },
    {
      title: '数量',
      dataIndex: 'count',
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
        rowKey="key"
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
        width="800px"
        layout="horizontal"
        formRef={modalFormRef}
        visible={createModalVisible}
        onVisibleChange={handleCreateModalVisible}
        modalProps={{
          confirmLoading: buildExamPaperRequest.loading
        }}
        onFinish={async (value: API.BuildExamPaperParams) => {
          const { conditions = [] } = value;
          const allFill = conditions.some(item => item.type && item.count);
          if (allFill) {
            buildExamPaperRequest.run(value);
          } else {
            message.error('请填写完整的试卷类型及数量');
          }
        }}
      >
        <ProFormDatePicker
          name="date"
          label="此日期之后的试题不会出现"
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
        >
          <EditableProTable<DataSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={editColumns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'bottom',
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
  )
}

export default ExamList;
