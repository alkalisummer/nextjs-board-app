'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await fetch('http://127.0.0.1:8090/api/collections/posts/records', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
      }),
    });
    setTitle('');
    setContent('');
    router.refresh();
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        type='text'
        className='post_title_input'
        placeholder='제목을 입력하세요'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className='post_content_textarea'
        placeholder='내용을 입력하세요'
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type='submit'>완료</button>
    </form>
  );
};

export default CreatePost;
