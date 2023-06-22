'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import fetchPost from '@/app/api/route';

const EditPost = ({ params }: any) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [recordId, setRecordId] = useState(params.id);
  const router = useRouter();

  const getPost = async () => {
    const post = await fetchPost(params.id);
    setTitle(post.title);
    setContent(post.content);
  };

  useEffect(() => {
    getPost();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.replaceAll(' ', '').length === 0) {
      alert('제목을 입력하세요.');
      return;
    } else if (content.replaceAll(' ', '').length === 0) {
      alert('내용을 입력하세요.');
      return;
    }

    await fetch(`http://127.0.0.1:8090/api/collections/posts/records/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        recordId,
      }),
    });
    setTitle('');
    setContent('');
    setRecordId('');
    router.refresh();
    router.push(`/posts/detail/${params.id}`);
  };

  return (
    <form
      className='post_div'
      onSubmit={handleSubmit}>
      <div className='post_title_created'>
        <input
          type='text'
          className='post_title_input'
          value={title}
          placeholder='제목을 입력하세요'
          maxLength={300}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <textarea
        value={content}
        className='post_content_textarea'
        placeholder='내용을 입력하세요.'
        maxLength={3000}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className='post_btn_div'>
        <button
          className='post_cancel_btn'
          onClick={() => router.push(`/posts/detail/${params.id}`)}
          type='button'>
          취소
        </button>
        <button
          className='post_submit_btn'
          type='submit'>
          수정
        </button>
      </div>
    </form>
  );
};

export default EditPost;
