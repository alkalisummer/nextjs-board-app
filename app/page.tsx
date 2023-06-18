'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import '../styles/Home.css';

const getPost = async (pageNum: number) => {
  const baseUrl = 'http://127.0.0.1:8090/api/collections/posts/records';
  const params = {
    page: pageNum.toString(),
    perPage: '3',
    sort: '-updated',
  };
  const queryString = new URLSearchParams(params).toString();
  const reqUrl = `${baseUrl}?${queryString}`;
  const res = await fetch(reqUrl, {
    method: 'GET',
    cache: 'no-cache',
  });
  const data = await res.json();
  return data ? data : {};
};

const HomePage = () => {
  const [currentNum, setCurrentNum] = useState(1);
  const [posts, setPosts] = useState({ page: 1, perPage: 3, totalItems: 0, items: [] });
  useEffect(() => {
    getPost(1).then((res) => setPosts(res));
  }, []);

  const getTotalPostsArr = () => {
    const totalPostCnt = posts.totalItems;
    const totalPageNum = totalPostCnt % 3 > 0 ? totalPostCnt / 3 + 1 : totalPostCnt / 3;
    let arr = [];

    for (let i = 1; i <= totalPageNum; i++) {
      arr.push(i);
    }

    return arr;
  };

  const handlePagination = async (e: React.MouseEvent<HTMLSpanElement>) => {
    const selectNum = e.currentTarget.textContent ?? null;
    if (selectNum) {
      await getPost(parseInt(selectNum)).then((res) => {
        setPosts(res);
        setCurrentNum(parseInt(selectNum));
      });
    }
  };

  const totalPostsArr = getTotalPostsArr();

  return (
    <div className='home_div'>
      <div className='home_post'>
        <div className='home_header'>
          <span className='home_post_cnt'>{`전체 글(${posts.items.length})`}</span>
        </div>
        {posts.items?.map((post: any) => {
          return (
            <PostItem
              key={post.id}
              post={post}
            />
          );
        })}
      </div>
      <div className='home_page_nav'>
        <span className='home_page_nav_prev'>
          <span className='home_page_nav_arr'>&lt;</span> &nbsp;&nbsp;Prev
        </span>
        {totalPostsArr.map((obj: number, idx: number) => {
          return (
            <span
              key={idx}
              className={`home_page_num ${currentNum === idx + 1 ? 'home_page_slct_num' : ''}`}
              onClick={(e) => handlePagination(e)}>
              {obj}
            </span>
          );
        })}
        <span className='home_page_nav_next'>
          Next&nbsp;&nbsp; <span className='home_page_nav_arr'>&gt;</span>
        </span>
      </div>
    </div>
  );
};

const PostItem = ({ post }: any) => {
  const { id, title, content, updated } = post || {};
  const dateFormat = new Date(updated).toLocaleString('ko-kr', { hour12: false, timeStyle: 'short', dateStyle: 'long' });
  return (
    <div className='home_post_title_content'>
      <Link href={`/posts/detail/${id}`}>
        <div>
          <span className='home_post_title'>{title}</span>
          <p className='home_post_content'>{content ? content : '작성된 내용이 없습니다.'}</p>
        </div>
      </Link>
      <span className='home_post_created'>{dateFormat}</span>
    </div>
  );
};

export default HomePage;
