'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const request = await fetch('http://127.0.0.1:8090/api/collections/posts/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
      }),
    })
      .then((response) => response.json())
      .then(function (res) {
        debugger;
        setTitle('');
        setContent('');
        router.refresh();
        router.push(`/posts/detail/${res.id}`);
      });
  };
  return (
    <form
      className='post_div'
      onSubmit={handleSubmit}>
      <div className='post_title_created'>
        <input
          type='text'
          className='post_title_input'
          placeholder='제목을 입력하세요'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <textarea
        className='post_content_textarea'
        placeholder='내용을 입력하세요'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className='post_btn_div'>
        <button
          className='post_cancel_btn'
          onClick={() => router.push(`/`)}
          type='button'>
          취소
        </button>
        <button
          className='post_submit_btn'
          type='submit'>
          완료
        </button>
      </div>
    </form>
  );
};

export default CreatePost;
