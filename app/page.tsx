import Link from 'next/link';
import React from 'react';
import '../styles/Home.css';

async function getPost(pageNum: string) {
  const baseUrl = 'http://127.0.0.1:8090/api/collections/posts/records';
  const params = {
    page: pageNum,
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
}

const HomePage = async () => {
  const res = await getPost('1');
  const posts = res.items as any[];

  const getTotalPostsArr = () => {
    const totalPostCnt = res.totalItems;
    const totalPageNum = totalPostCnt / 3 + 1;
    let arr = [];

    for (let i = 1; i <= totalPageNum; i++) {
      arr.push(i);
    }

    return arr;
  };
  const totalPostsArr = getTotalPostsArr();

  return (
    <div className='home_post'>
      <div className='home_header'>
        <span className='home_post_cnt'>{`전체 글(${posts.length})`}</span>
      </div>
      {posts?.map((post) => {
        return (
          <PostItem
            key={post.id}
            post={post}
          />
        );
      })}
      <div className='home_page_nav'>
        <span className='home_page_nav_prev'>〈 Prev</span>
        {totalPostsArr.map((obj: number, idx: number) => {
          return <span key={idx}>{obj}</span>;
        })}
        <span className='home_page_nav_next'>Next 〉</span>
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
