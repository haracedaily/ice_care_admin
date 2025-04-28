import React, {useEffect, useRef} from 'react';
import {Input, Button, DatePicker, Form, Modal, Select} from "antd";
import {supabase} from "../js/supabase.js";
import dayjs from "dayjs";

const {Option} = Select;

const ReservationForm = ({ reservation, onSuccess }) => {
    const [form] = Form.useForm();
    const postcodeRef = useRef(null);
    const basicAddrRef = useRef(null);
    const detailAddrRef = useRef(null);

    
    useEffect(() => {
        if(reservation) {
            const addrParts = reservation.addr ? reservation.addr.split(',') : ['', '', ''];
            const postcode = addrParts[0]?.trim() || '';
            const basicAddr = addrParts.slice(1, -1).join(',').trim() || '';
            const detailAddr = addrParts[addrParts.length - 1]?.trim() || '';

            form.setFields([
                { name: 'name', value: reservation.name },
                { name: 'tel', value: reservation.tel },
                { name: 'email', value: reservation.email },
                { name: 'postcode', value: postcode },
                { name: 'basicAddr', value: basicAddr },
                { name: 'detailAddr', value: detailAddr },
                { name: 'date', value: reservation.date ? dayjs(reservation.date) : null },
                { name: 'time', value: reservation.time },
                { name: 'model', value: reservation.model },
                { name: 'capacity', value: reservation.capacity },
                { name: 'service', value: reservation.service || null },
                { name: 'cycle', value: reservation.cycle || null },
                { name: 'add', value: reservation.add || null },
                { name: 'remark', value: reservation.remark || null },
                { name: 'deposit', value: reservation.deposit ? `${reservation.deposit / 10000}만 원` : '' },
                { name: 'state', value: reservation.state || 0 },
            ]);
            console.log('초기 폼 값 설정:', form.getFieldsValue(['postcode', 'basicAddr', 'detailAddr']));

        }else{
            form.resetFields();
        }
    },[reservation, form]);

    useEffect(() => {
        const values = form.getFieldsValue(['postcode', 'basicAddr', 'detailAddr']);
        console.log('DOM 값 확인 : ',{
            postcode: postcodeRef.current?.input?.value || '없음',
            basicAddr: basicAddrRef.current?.input?.value || '없음',
            detailAddr: detailAddrRef.current?.input?.value || '없음',
        })
    }, [form]);

    const depositMap = {
        '20~50kg': "2만 원",
        '50~100kg': "3만 원",
        '100kg 이상': "4만 원",
    }

    const onFinish = async (values) => {
        try {
            const addr = [values.postcode, values.basicAddr, values.detailAddr]
                .filter((v) => v).join(', ').replace(/\s*,\s*/g, ',');
            const data = {
                name: values.name,
                tel: values.tel,
                email: values.email,
                addr: addr,
                date: values.date ? values.date.format('YYYY-MM-DD') : null,
                time: values.time,
                model: values.model,
                capacity: values.capacity,
                service: values.service || null,
                cycle: values.cycle || null,
                add: values.add || null,
                remark: values.remark || null,
                deposit: depositMap[values.capacity] || null,
                state: values.state || 0,
            };
            if (!values.postcode || !values.basicAddr) {
                Modal.error({
                    title: '오류',
                    content: '우편번호와 주소를 입력해주세요.',
                });
                return;
            }
            if (!data.name || !data.tel || !data.email || !data.addr || !data.date || !data.time || !data.model || !data.capacity) {
                Modal.error({
                    title: '오류',
                    content: '모든 필수 항목을 입력해주세요.',
                });
                return;
            }

            console.log('Supabase에 전송할 데이터:', data);
            if (reservation) {
                const {error} = await supabase
                    .from('ice_res')
                    .update(data)
                    .eq('res_no', reservation.res_no);
                if (error) throw error;
            } else {
                const {error} = await supabase.from('ice_res').insert([data]);
                if (error) throw error;
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
            console.error('Error submitting reservation:', error);
            Modal.error({
                title: '오류 발생',
                content: `예약 ${reservation ? '수정' : '등록'} 중 오류가 발생했습니다: ${error.message}`,
            });
        }

    };

    const handleCapacityChange = (value) => {
        form.setFieldsValue({deposit: depositMap[value] || '0'});
    };

    // 주소 검색 (카카오 우편번호 API)
    const searchAddress = () => {
        if (!window.daum || !window.daum.Postcode) {
            Modal.error({
                title: '오류',
                content: '카카오 우편번호 API를 로드하지 못했습니다. index.html에 API 스크립트가 포함되어 있는지 확인해주세요.',
            });
            return;
        }

        new window.daum.Postcode({
            oncomplete: (data) => {
                console.log('주소 검색 결과:', data);
                try {
                    // Ant Design 5.x에서 권장하는 setFields 사용
                    form.setFields([
                        { name: 'postcode', value: data.zonecode },
                        { name: 'basicAddr', value: data.address },
                        { name: 'detailAddr', value: '' },
                    ]);
                    console.log('폼에 설정된 값:', form.getFieldsValue(['postcode', 'basicAddr', 'detailAddr']));
                    // 폼 검증
                    form.validateFields(['postcode', 'basicAddr']).catch((err) => {
                        console.error('폼 검증 오류:', err);
                    });
                    // 상세주소 포커스 이동
                    if (detailAddrRef.current) {
                        detailAddrRef.current.focus();
                    } else {
                        console.warn('detailAddr 입력란 ref를 찾을 수 없습니다.');
                    }
                } catch (error) {
                    console.error('폼 업데이트 오류:', error);
                    Modal.error({
                        title: '오류',
                        content: '주소 입력 중 오류가 발생했습니다. 다시 시도해주세요.',
                    });
                }
                console.log(data.zonecode)
            },
        }).open();
    };

    return (
        <Form form={form}
              layout="vertical"
              onFinish={onFinish}
              initialValues={{
                  time: '오전 10시 ~ 오후 1시',
                  capacity: '20~50kg',
                  service: '청소',
                  cycle: '이번 한 번만',
                  add: '선택 안함',
                  state: '선택',
                  deposit: '2만 원',
                  postcode: '',
                  basicAddr: '',
                  detailAddr: '',
              }}
              style={{ padding: '0 8px' }}
        >
            <Form.Item
                label="이름"
                name="name"
                rules={[{ required: true, message: '이름을 입력해주세요!' }]}>
                <Input size="middle"></Input>
            </Form.Item>

            <Form.Item
                label="연락처"
                name="tel"
                rules={[
                    { required: true, message: '연락처를 입력해주세요!' },
                    {
                        pattern: /^\d{3}-\d{3,4}-\d{4}$/,
                        message: '유효한 전화번호 형식이 아닙니다. 예: 010-1234-5678',
                    },
                ]}>
                <Input size="middle"></Input>
            </Form.Item>

            <Form.Item
                label="email"
                name="eamil"
                rules={[
                    { required: true, message: '이메일을 입력해주세요!' },
                    {
                        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: '유효한 이메일 형식이 아닙니다. 예: example@domain.com',
                    },
                ]}>
                <Input size="middle"></Input>
            </Form.Item>

            <Form.Item
                label="우편번호"
                name="postcode"
                rules={[{ required: true, message: '우편번호를 입력해주세요!' }]}
            >
                <div style={{ display: 'flex', gap: '8px' }}>
                    <Input
                        ref={postcodeRef} //
                        style={{ width: '100px', color: 'black', background: 'white', border: '1px solid #d9d9d9' }}
                        disabled
                        size="middle"
                    />
                    <Button onClick={searchAddress} size="middle">
                        검색
                    </Button>
                </div>
            </Form.Item>

            <Form.Item
                label="주소"
                name="basicAddr"
                rules={[{ required: true, message: '주소를 입력해주세요!' }]}
            >
                <Input
                    ref={basicAddrRef}
                    style={{ color: 'black', background: 'white', border: '1px solid #d9d9d9' }}
                    disabled
                    size="middle"
                />
            </Form.Item>

            <Form.Item label="상세주소" name="detailAddr">
                <Input
                    ref={detailAddrRef}
                    placeholder="상세 주소를 입력하세요"
                    size="middle"
                />
            </Form.Item>

            <Form.Item
                label="예약 날짜"
                name="date"
                rules={[{ required: true, message: '예약 날짜를 선택해주세요!' }]}
            >
                <DatePicker style={{ width: '100%' }} size="middle" />
            </Form.Item>

            <Form.Item
                label="시간"
                name="time"
                rules={[{ required: true, message: '시간을 선택해주세요!' }]}
            >
                <Select size="middle" style={{ border: '1px solid #d9d9d9', borderRadius: 6}}>
                    <Option value="오전 10시 ~ 오후 1시">오전 10시 ~ 오후 1시</Option>
                    <Option value="오후 2시 ~ 오후 5시">오후 2시 ~ 오후 5시</Option>
                    <Option value="오후 4시 ~ 오후 7시">오후 4시 ~ 오후 7시</Option>
                    <Option value="오후 6시 ~ 오후 9시">오후 6시 ~ 오후 9시</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="모델"
                name="model"
                rules={[{ required: true, message: '모델명을 입력해주세요!' }]}
            >
                <Input size="middle" />
            </Form.Item>

            <Form.Item
                label="용량"
                name="capacity"
                rules={[{ required: true, message: '용량을 선택해주세요!' }]}
            >
                <Select onChange={handleCapacityChange} size="middle" style={{ border: '1px solid #d9d9d9', borderRadius: 6}}>
                    <Option value="20~50kg">20~50kg</Option>
                    <Option value="50~100kg">50~100kg</Option>
                    <Option value="100kg 이상">100kg 이상</Option>
                </Select>
            </Form.Item>

            <Form.Item label="선택 서비스" name="service">
                <Select size="middle">
                    <Option value="청소">청소</Option>
                    <Option value="수리">수리</Option>
                </Select>
            </Form.Item>

            <Form.Item label="서비스 주기" name="cycle">
                <Select size="middle">
                    <Option value="이번 한 번만">이번 한 번만</Option>
                    <Option value="한 달에 한 번">한 달에 한 번</Option>
                </Select>
            </Form.Item>

            <Form.Item label="추가 서비스 선택" name="add">
                <Select size="middle">
                    <Option value="심화 청소">심화 청소</Option>
                    <Option value="물탱크 청소">물탱크 청소</Option>
                    <Option value="필터 교체">필터 교체</Option>
                    <Option value="선택 안함">선택 안함</Option>
                </Select>
            </Form.Item>

            <Form.Item label="특별 요청사항" name="remark">
                <Input.TextArea
                    rows={3}
                    style={{ fontSize: '12px', resize: 'vertical', padding: '4px 8px' }}
                    placeholder="특별 요청사항을 입력하세요"
                />
            </Form.Item>

            <Form.Item
                label="예약금"
                name="deposit"
                rules={[{ required: true, message: '예약금을 확인해주세요' }]}
            >
                <Input disabled style={{ color: 'black', background: 'white', border: '1px solid #d9d9d9' }} size="middle" />
            </Form.Item>

            <Form.Item label="상태" name="state">
                <Select size="middle">
                    <Option value={1}>예약대기</Option>
                    <Option value={2}>배정대기</Option>
                    <Option value={3}>배정완료</Option>
                    <Option value={4}>처리중</Option>
                    <Option value={5}>처리완료</Option>
                    <Option value={9}>취소</Option>
                </Select>
            </Form.Item>

            <Form.Item>
                <Button type="primary" htmlType="submit" size="middle">
                    {reservation ? '수정' : '등록'}
                </Button>
            </Form.Item>

        </Form>
    )
}

export default ReservationForm;