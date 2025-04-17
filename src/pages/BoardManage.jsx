import React, {useEffect, useState} from 'react';
import {Breadcrumb, Button, Form, Input, message, Select} from "antd";
import {PlusOutlined, SearchOutlined, RedoOutlined} from "@ant-design/icons";

import '../css/BoardManage.css';
import {supabase} from "../js/supabaseClient.js";

const {Option} = Select;

const categories = [
    {id: 'all', name: '전체'},
    {id: '1', name: '공지사항'},
    {id: '2', name: '자주묻는질문'},
];

const BoardManage = () => {
    const [posts, setPosts] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [form] = Form.useForm();
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(10);
    const [totalPosts, setTotalPosts] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const fetchPosts = async () => {
        let query = supabase
            .from('board')
            .select('*, categories(name)', {count: 'exact'})
            .order('created_at', {ascending: false}) // 내림차순 정렬, 가장 최근 데이터 먼저.
            .range((currentPage - 1) * pageSize, currentPage * pageSize - 1);

        if (searchText) {
            query = query.or(`title.ilike.%${searchText}%, author.ilike.%${searchText}%`);
        }

        if (filterCategory !== 'all') {
            query = query.eq('category_id', filterCategory);
        } else {
            query = query.in('category_id', [1, 2]);
        }

        const {data, error, count} = await query;
        if (error) {
            message.error('게시글을 불러오는 데 실패했습니다.');
            return;
        }

        setPosts(data);
        setTotalPosts(count);
    }

    useEffect(() => {
        fetchPosts();
    }, [currentPage, searchText, filterCategory]);

    const handleUpload = async (file) => {
        const fileExt = file.name.split('.').pop(); // 파일 확장자 추출
        const fileName = `${Date.now()}.${fileExt}`; // 현재 시간으로 파일 이름 생성
        const filePath = `board-images/${fileName}`; // supabase storage에 저장할 경로 지정

        const {error: uploadError} = await supabase.storage
            .from('board-images') // 저장할 버킷 이름은 board-images
            .upload(filePath, file); // 파일 업로드

        if (uploadError) {
            message.error("이미지 업로드에 실피했습니다.");
            return null;
        }

        const {data: urlData} = supabase.storage // 업로드한 파일의 URL을 가져옴
            .from('board-images')
            .getPublicUrl(filePath); // 공개 URL 가져오기

        return urlData.publicUrl;
    }

    const handleSave = async (values) => {
        const {title, content, author, password, category_id} = values; // 폼에서 입력한 값들
        let imageUrl = null; // 이미지 URL을 저장할 변수

        if (fileList.length > 0) {
            imageUrl = await handleUpload(fileList[0].originFileObj); // 이미지 업로드
            if (!imageUrl) return; // 업로드 실패 시 함수 종료
        }

        if (isEditMode) {
            const {error} = await supabase // 수정할 게시글의 ID를 사용하여 업데이트
                .from('board')
                .update({
                    title,
                    content,
                    category_id,
                    image_url: imageUrl || selectedPost.image_url, // 기존 이미지 URL 유지
                    updated_at: new Date(), // 수정일자 업데이트
                })
                .eq('id', selectedPost.id) // 게시글 ID로 필터링
                .eq('password', password); // 비밀번호 확인

            if (error) {
                message.error("비밀번호가 틀렸거나 수정에 실패샜습니다.");
                return;
            }
            message.success("게시글이 수정되었습니다.");
        } else {
            const {error} = await supabase
                .from('board')
                .insert([{title, content, author, password, category_id, image_url: imageUrl}]); // 게시글 등록

            if (error) {
                message.error("게시글 등록에 실패했습니다.");
                return;
            }
            message.error("게시글이 등록되었습니다.");
        }

        setIsModalOpen(false); // 모달 닫기
        setFileList([]); // 파일 리스트 초기화
        form.resetFields(); // 폼 초기화
        fetchPosts(); // 게시글 목록 새로고침
    }

    return (
        <div className="content">
            <div className="header">
                <h1>게시판 관리</h1>
                <Breadcrumb
                    separator=">"
                    items={[{title: 'Home',}, {title: '게시판관리', href: '',},]}
                />
            </div>

            <div className="filter-section">
                <Input
                    placeholder="제목 또는 작성자 검색"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    style={{width: '200px'}}
                />
                <Select
                    placeholder="카테고리 선택"
                    defaultValue="all"
                    value={filterCategory}
                    onChange={(value) => setFilterCategory(value)}
                    style={{width: '150px'}}
                    allowClear={false}
                >
                    {categories.map((category) => (
                        <Option key={category.id} value={category.id}>
                            {category.name}
                        </Option>
                    ))}
                </Select>
                <Button
                    icon={<SearchOutlined/>}
                    // onClick={handleSearch}
                >
                    조회
                </Button>
                <Button
                    icon={<RedoOutlined/>}
                    // onClick={handleReset}
                >
                    초기화
                </Button>
                <Button
                    type="primary"
                    icon={<PlusOutlined/>}
                    onClick={() => {
                        setIsEditMode(false);
                        setIsModalOpen(true);
                    }}
                    style={{background: '#1890ff', borderColor: '#1890ff'}}
                >
                    게시글 등록
                </Button>

            </div>
        </div>
    );
}

export default BoardManage;