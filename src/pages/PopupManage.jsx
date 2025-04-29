import React, { useState, useEffect } from 'react';
import { 
    Card, 
    Button, 
    Table, 
    Modal, 
    Form, 
    Input, 
    DatePicker, 
    Select, 
    Switch,
    Space,
    message,
    Upload,
    Radio,
    Divider
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import locale from 'antd/es/date-picker/locale/ko_KR';
import styles from '../css/PopupManage.module.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

const PopupManage = () => {
    const [popups, setPopups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPopup, setEditingPopup] = useState(null);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [mobileFileList, setMobileFileList] = useState([]);

    // 로컬 스토리지에서 팝업 데이터 로드
    useEffect(() => {
        const savedPopups = localStorage.getItem('popups');
        if (savedPopups) {
            setPopups(JSON.parse(savedPopups));
        }
    }, []);

    // 팝업 데이터 저장
    const savePopups = (newPopups) => {
        localStorage.setItem('popups', JSON.stringify(newPopups));
        setPopups(newPopups);
    };

    // 이미지 업로드 전 처리
    const beforeUpload = (file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error('이미지 파일만 업로드 가능합니다!');
            return false;
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('이미지 크기는 2MB 이하여야 합니다!');
            return false;
        }
        return false;
    };

    // 이미지 업로드 처리
    const handleUpload = (info, isMobile = false) => {
        const { file } = info;
        const targetFileList = isMobile ? setMobileFileList : setFileList;
        
        if (file.status === 'uploading') {
            targetFileList([file]);
            return;
        }
        if (file.status === 'done') {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => {
                const fieldName = isMobile ? 'mobileImageUrl' : 'imageUrl';
                form.setFieldsValue({ [fieldName]: reader.result });
                targetFileList([{
                    uid: file.uid,
                    name: file.name,
                    status: 'done',
                    url: reader.result,
                }]);
            };
        }
    };

    // 팝업 추가/수정
    const handleSubmit = (values) => {
        const newPopup = {
            id: editingPopup ? editingPopup.id : Date.now(),
            title: values.title,
            displayType: values.displayType || 'popup',
            displayStatus: values.displayStatus || 'show',
            startDate: values.dateRange[0].format('YYYY-MM-DD HH:mm'),
            endDate: values.dateRange[1].format('YYYY-MM-DD HH:mm'),
            displayEnvironment: values.displayEnvironment || ['desktop', 'mobile'],
            imageUrl: values.imageUrl,
            mobileImageUrl: values.mobileImageUrl,
            linkUrl: values.linkUrl,
            closeOption: values.closeOption || ['today']
        };

        if (editingPopup) {
            const updatedPopups = popups.map(p => 
                p.id === editingPopup.id ? newPopup : p
            );
            savePopups(updatedPopups);
            message.success('팝업이 수정되었습니다.');
        } else {
            savePopups([...popups, newPopup]);
            message.success('새 팝업이 추가되었습니다.');
        }

        setIsModalOpen(false);
        form.resetFields();
        setEditingPopup(null);
        setFileList([]);
        setMobileFileList([]);
    };

    // 팝업 삭제
    const handleDelete = (id) => {
        Modal.confirm({
            title: '팝업 삭제',
            content: '이 팝업을 삭제하시겠습니까?',
            onOk: () => {
                const updatedPopups = popups.filter(p => p.id !== id);
                savePopups(updatedPopups);
                message.success('팝업이 삭제되었습니다.');
            }
        });
    };

    // 팝업 수정 모달 열기
    const handleEdit = (popup) => {
        setEditingPopup(popup);
        form.setFieldsValue({
            ...popup,
            dateRange: [dayjs(popup.startDate), dayjs(popup.endDate)]
        });
        if (popup.imageUrl) {
            setFileList([{
                uid: '-1',
                name: '데스크탑 이미지',
                status: 'done',
                url: popup.imageUrl,
            }]);
        }
        if (popup.mobileImageUrl) {
            setMobileFileList([{
                uid: '-2',
                name: '모바일 이미지',
                status: 'done',
                url: popup.mobileImageUrl,
            }]);
        }
        setIsModalOpen(true);
    };

    const columns = [
        {
            title: '제목',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '노출 기간',
            key: 'dateRange',
            render: (_, record) => `${record.startDate} ~ ${record.endDate}`,
        },
        {
            title: '상태',
            dataIndex: 'displayStatus',
            key: 'displayStatus',
            render: (status) => (
                <Switch checked={status === 'show'} disabled />
            ),
        },
        {
            title: '유형',
            dataIndex: 'displayType',
            key: 'displayType',
        },
        {
            title: '관리',
            key: 'action',
            render: (_, record) => (
                <Space>
                    <Button 
                        icon={<EditOutlined />} 
                        onClick={() => handleEdit(record)}
                    />
                    <Button 
                        icon={<DeleteOutlined />} 
                        danger 
                        onClick={() => handleDelete(record.id)}
                    />
                </Space>
            ),
        },
    ];

    return (
        <div className={styles.container}>
            <Card title="팝업/배너 등록">
                <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setEditingPopup(null);
                        form.resetFields();
                        setFileList([]);
                        setMobileFileList([]);
                        setIsModalOpen(true);
                    }}
                    style={{ marginBottom: 16 }}
                >
                    팝업/배너 등록
                </Button>

                <Table 
                    columns={columns} 
                    dataSource={popups}
                    rowKey="id"
                />

                <Modal
                    title={editingPopup ? "팝업/배너 수정" : "팝업/배너 등록"}
                    open={isModalOpen}
                    onCancel={() => {
                        setIsModalOpen(false);
                        form.resetFields();
                        setEditingPopup(null);
                        setFileList([]);
                        setMobileFileList([]);
                    }}
                    width={1000}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleSubmit}
                        initialValues={{
                            displayType: 'popup',
                            displayStatus: 'show',
                            displayEnvironment: ['desktop', 'mobile'],
                            closeOption: ['today']
                        }}
                    >
                        <Form.Item
                            name="displayType"
                            label="노출 형태"
                        >
                            <Radio.Group>
                                <Radio value="popup">팝업</Radio>
                                <Radio value="banner">배너</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="title"
                            label="제목"
                            rules={[{ required: true, message: '제목을 입력해주세요' }]}
                        >
                            <Input placeholder="관리를 위한 이름을 입력합니다." />
                        </Form.Item>

                        <Form.Item
                            name="displayStatus"
                            label="노출 상태"
                        >
                            <Radio.Group>
                                <Radio value="show">노출함</Radio>
                                <Radio value="hide">노출안함</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item
                            name="dateRange"
                            label="기간"
                            rules={[{ required: true, message: '노출 기간을 선택해주세요' }]}
                        >
                            <RangePicker 
                                locale={locale}
                                showTime={{ format: 'HH:mm' }}
                                format="YYYY-MM-DD HH:mm"
                            />
                        </Form.Item>

                        <Form.Item
                            name="displayEnvironment"
                            label="노출 환경"
                        >
                            <Radio.Group>
                                <Radio value={['desktop', 'mobile']}>전체</Radio>
                                <Radio value={['desktop']}>데스크탑</Radio>
                                <Radio value={['mobile']}>모바일</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Divider>이미지</Divider>

                        <Form.Item
                            name="imageUrl"
                            label="데스크탑 이미지"
                            extra="권장 해상도: 600 x 600px, 최소 해상도: 350 x 350px, 최대 해상도: 1000 x 650px"
                        >
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={beforeUpload}
                                onChange={(info) => handleUpload(info, false)}
                                fileList={fileList}
                                onRemove={() => {
                                    form.setFieldsValue({ imageUrl: undefined });
                                    setFileList([]);
                                }}
                            >
                                {fileList.length === 0 && <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>이미지 업로드</div>
                                </div>}
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="mobileImageUrl"
                            label="모바일 이미지"
                            extra="권장 해상도: 350 x 350px"
                        >
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={beforeUpload}
                                onChange={(info) => handleUpload(info, true)}
                                fileList={mobileFileList}
                                onRemove={() => {
                                    form.setFieldsValue({ mobileImageUrl: undefined });
                                    setMobileFileList([]);
                                }}
                            >
                                {mobileFileList.length === 0 && <div>
                                    <PlusOutlined />
                                    <div style={{ marginTop: 8 }}>이미지 업로드</div>
                                </div>}
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="linkUrl"
                            label="URL"
                        >
                            <Input placeholder="http://" />
                        </Form.Item>

                        <Form.Item
                            name="closeOption"
                            label="팝업 하단 닫기 설정"
                        >
                            <Radio.Group>
                                <Radio value={['today']}>오늘 하루 다시 보지 않기</Radio>
                                <Radio value={['close']}>닫기</Radio>
                            </Radio.Group>
                        </Form.Item>

                        <Form.Item>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    등록
                                </Button>
                                <Button onClick={() => {
                                    setIsModalOpen(false);
                                    form.resetFields();
                                    setEditingPopup(null);
                                    setFileList([]);
                                    setMobileFileList([]);
                                }}>
                                    취소
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </Card>
        </div>
    );
};

export default PopupManage; 