import React, {useEffect} from 'react';
import {Breadcrumb, Button, Input, Select} from "antd";
import {debounce} from "@mui/material";
import {supabase} from "../js/supabaseClient.js";

const BoardManage = () => {
    const [searchText, setSearchText] = React.useState('');
    const [appliedSearchText, setAppliedSearchText] = React.useState('');
    const [filterCategory, setFilterCagegory] = React.useState('all');

    const categories = [
        {id: 'all', name: '전체'},
        {id: 2, name: '공지사항'},
        {id: 3, name: 'FAQ'},
    ]

    const fetchPosts = async () => {
        let query = supabase
            .from('board')
            .select('*, categories(name)', {count: 'exact'})
            .order('created_at', {ascending: false})

        if (searchText) {
            query = query.or(`title.ilike.%${searchText}%, writer.ilike.%${searchText}%`);
        }

        if (filterCategory !== 'all') {
            query = query.eq('category_id', filterCategory);
        }else {
            query = query.in('category_id', [1, 2]);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [filterCategory]);



    const debouncedSearchText = debounce(() => {
        setSearchText(value);
    }, 300);

    // 검색조회
    const handleSearch = () => {
        setAppliedSearchText(searchText);
    }

    // 검색어 초기화
    const handleReset = () => {
        setSearchText('');
        setAppliedSearchText('');
        setFilterCagegory('all');
    }

    return (
        <div className="content">
            <div className="header">
                <h1>게시판 관리</h1>
                <Breadcrumb
                    separator=">"
                    items={[
                        {title: 'Home',},
                        {title: '게시판관리', href: '',},
                    ]}
                />
            </div>

            <div style={{display: 'flex', gap: '10px'}}>
                <Input placeholder="제목 또는 작성자 검색"
                       value={searchText}
                       onChange={(e) => debouncedSearchText(e.target.value)}
                       onPressEnter={handleSearch}
                       style={{width: '300px'}}
                />
                <Select placeholder="카테고리 선택"
                        defaultValue="all"
                        value={filterCategory}
                        onChange={(value) => setFilterCagegory(value)}
                        style={{width: '150px'}}
                        allowClear={false}
                >
                    {categories.map((category) => (
                        <Option key={category.id} value={category.id}>
                            {category.name}
                        </Option>
                    ))}
                </Select>
                <Button type="primary" onClick={handleSearch}>조회</Button>
                <Button onClick={handleReset}>초기화</Button>
            </div>
        </div>
    );
}

export default BoardManage;