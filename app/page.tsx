'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/Home.css';

const HomePage = () => {
  const [currentNum, setCurrentNum] = useState(1);
  const [posts, setPosts] = useState({ totalItems: 0, items: [] });

  useEffect(() => {
    getPost({ type: 'list' }).then((res) => {
      debugger;
      setPosts(res.data.result);
    });
  }, []);

  const getPost = async (param: any) => {
    return await axios.get('/api/handlePost', { params: param });
  };

  const getTotalPostsArr = () => {
    const totalPostCnt = posts.totalItems;
    const totalPageNum = totalPostCnt % 6 > 0 ? totalPostCnt / 6 + 1 : totalPostCnt / 6;
    let arr = [];

    for (let i = 1; i <= totalPageNum; i++) {
      arr.push(i);
    }

    return arr;
  };

  const handlePagination = async (pageNum: any) => {
    const selectNum = pageNum ?? null;
    if (selectNum) {
      await getPost({ type: 'read', pageNum: selectNum }).then((res) => {
        setPosts(res.data);
        setCurrentNum(parseInt(selectNum));
      });
    }
  };

  const totalPostsArr = getTotalPostsArr();

  return (
    <div className='home_div'>
      <div className='home_header_div'>
        <span className='home_header_title'>Simple Board</span>
      </div>
      <div className='home_post'>
        <div className='home_header'>
          <span className='home_post_cnt'>{`전체 글(${posts.items.length})`}</span>
          <Link href={'/posts/create'}>
            <button className='create_btn'></button>
          </Link>
        </div>
        {posts.items?.map((post: any) => {
          return (
            <PostItem
              key={post.post_id}
              post={post}
            />
          );
        })}
      </div>
      {
        <div className='home_page_nav'>
          <span
            className='home_page_nav_prev'
            onClick={(e) => handlePagination(currentNum - 1)}>
            <span className='home_page_nav_arr'>&lt;</span> &nbsp;&nbsp;Prev
          </span>
          {totalPostsArr.map((obj: number, idx: number) => {
            return (
              <span
                key={idx}
                className={`home_page_num ${currentNum === idx + 1 ? 'home_page_slct_num' : ''}`}
                onClick={(e) => handlePagination(e.currentTarget.textContent)}>
                {obj}
              </span>
            );
          })}
          <span
            className='home_page_nav_next'
            onClick={(e) => handlePagination(currentNum + 1)}>
            Next&nbsp;&nbsp; <span className='home_page_nav_arr'>&gt;</span>
          </span>
        </div>
      }
    </div>
  );
};

const PostItem = ({ post }: any) => {
  const { post_id, post_title, post_cntn, amnt_dttm } = post || {};
  return (
    <div className='home_post_title_content'>
      <Link href={`/posts/detail/${post_id}`}>
        <div>
          <span className='home_post_title'>{post_title}</span>
          <p className='home_post_content'>{post_cntn ? post_cntn : '작성된 내용이 없습니다.'}</p>
        </div>
      </Link>
      <span className='home_post_created'>{amnt_dttm}</span>
    </div>
  );
};

export default HomePage;
