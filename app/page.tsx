import Link from 'next/link';
import React from 'react';
import '../styles/Home.css';

async function getPost() {
  const res = await fetch('http://127.0.0.1:8090/api/collections/posts/records', { cache: 'no-store' });
  const data = await res.json();
  return data?.items as any[];
}

const HomePage = async () => {
  const posts = await getPost();

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
    </div>
  );
};

const PostItem = ({ post }: any) => {
  const { id, title, content, created } = post || {};
  const dateFormat = created.substr(0, 16);
  debugger;
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
