import React, {useEffect} from 'react';
import {Form, Modal, Select} from "antd";
import dayjs from "dayjs";
import {supabase} from "../js/supabase.js";

const {Option} = Select;

const ReservationForm = ({ reservation, onSuccess }) => {
    const [form] = Form.useForm();

    const depositMap = {
        '1': '2만 원', // 20~50kg
        '2': '3만 원', // 50~100kg
        '3': '4만 원', // 100kg 이상
    };
    
    useEffect(() => {
        if(reservation) {
            form.setFieldsValue({
                ...reservation,
                date: reservation.date ? dayjs(reservation.date) : null,
            });
        }else{
            form.resetFields();
        }
    },[reservation, form]);

    const onFinish = async (values) => {
        try{
            const data = {
                ...values,
                date: values.date ? values.date.format('YYYY-MM-DD') : null,
                deposit: depositMap[values.capacity] || '0',
            };
            if(reservation) {
                const{error} = await supabase.from('ice_res').update(data)
                    .eq('res_no',reservation.res_no);
                if(error) throw error;
            } else{
                const {errors} = await supabase.from('ice_res').insert([data]);
                if(error) throw error;
            }

            Modal.success({
                title: reservation ? '수정 완료' : '등록 완료',
                content: reservation
                    ? '예약 정보가 성공적으로 수정되었습니다.'
                    : '새 예약이 성공적으로 등록되었습니다.',
                onOk: () => {
                    onSuccess();
                    form.resetFields();
                },
            });
        } catch (error) {
            console.log('Error', error.message);
            Modal.error({
                title: '오류 발생',
                content: `예약 ${reservation ? '수정' : '등록'} 중 오류가 발생했습니다: ${error.message}`,
            });
        }
    };

    const handleCapacityChange = (value) => {
        form.setFieldsValue({deposit: depositMap[value] || '0'});
    };

    return (
        <Form form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                  time: '오전 10시 ~ 오후 1시',
                  capacity: '1',
                  service: '청소',
                  cycle: '이번 한 번만',
                  add: '선택 안함',
                  state: 0,
                  deposit: '2만 원', // 초기 용량 '1'에 해당하는 보증금
              }}>
            <Form.Item
                label="이름"
                name="name"
                rules={[{ required: true, message: '이름을 입력해주세요!' }]}>
                <Input></Input>
            </Form.Item>
            <Form.Item
                label="연락처"
                name="tel"
                rules={[{ required: true, message: '연락처를 입력해주세요!' }]}>
                <Input></Input>
            </Form.Item>
            <Form.Item
                label="email"
                name="eamil"
                rules={[{ required: true, message: '이메일을 입력해주세요!' }]}>
                <Input></Input>
            </Form.Item>
            <Form.Item
                label="주소"
                name="addr"
                rules={[{ required: true, message: '이름을 입력해주세요!' }]}>
                <Input></Input>
            </Form.Item>
            <Form.Item
                label="예약 날짜"
                name="date"
                rules={[{ required: true, message: '예약 날짜를 선택해주세요!' }]}
            >
                <DatePicker style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item label="시간" name="time">
                <Select>
                    <Option value="오전 10시 ~ 오후 1시">오전 10시 ~ 오후 1시</Option>
                    <Option value="오후 2시 ~ 오후 5시">오후 2시 ~ 오후 5시</Option>
                    <Option value="오후 4시 ~ 오후 7시">오후 4시 ~ 오후 7시</Option>
                    <Option value="오후 6시 ~ 오후 9시">오후 6시 ~ 오후 9시</Option>
                </Select>
            </Form.Item>

            <Form.Item label="모델" name="model">
                <Input />
            </Form.Item>

            <Form.Item
                label="용량"
                name="capacity"
                rules={[{ required: true, message: '용량을 선택해주세요!' }]}
            >
                <Select onChange={handleCapacityChange}>
                    <Option value="1">20~50kg</Option>
                    <Option value="2">50~100kg</Option>
                    <Option value="3">100kg 이상</Option>
                </Select>
            </Form.Item>

            <Form.Item label="서비스" name="service">
                <Select>
                    <Option value="청소">청소</Option>
                    <Option value="수리">수리</Option>
                </Select>
            </Form.Item>

            <Form.Item label="주기" name="cycle">
                <Select>
                    <Option value="이번 한 번만">이번 한 번만</Option>
                    <Option value="한 달에 한 번">한 달에 한 번</Option>
                </Select>
            </Form.Item>

            <Form.Item label="추가사항" name="add">
                <Select>
                    <Option value="심화 청소">심화 청소</Option>
                    <Option value="물탱크 청소">물탱크 청소</Option>
                    <Option value="필터 교체">필터 교체</Option>
                    <Option value="선택 안함">선택 안함</Option>
                </Select>
            </Form.Item>

            <Form.Item label="비고" name="remark">
                <Input.TextArea />
            </Form.Item>

            <Form.Item
                label="보증금"
                name="deposit"
                rules={[{ required: true, message: '보증금이 필요합니다!' }]}
            >
                <Input disabled style={{ color: 'black' }} />
            </Form.Item>

            <Form.Item label="상태" name="state">
                <Select>
                    <Option value={0}>예약대기</Option>
                    <Option value={1}>예약완료</Option>
                    <Option value={2}>기사배정중</Option>
                    <Option value={3}>기사배정완료</Option>
                    <Option value={4}>청소완료</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {reservation ? '수정' : '등록'}
                </Button>
            </Form.Item>

        </Form>
    )
}

export default ReservationForm;