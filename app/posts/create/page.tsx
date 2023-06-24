'use client';

import { useRouter } from 'next/navigation';
import timeToString from '@/app/utils/commonUtils';
import React, { useState } from 'react';
import axios from 'axios';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (title.replaceAll(' ', '').length === 0) {
      alert('제목을 입력하세요.');
      return;
    } else if (content.replaceAll(' ', '').length === 0) {
      alert('내용을 입력하세요.');
      return;
    }

    const currentTime = timeToString(new Date());

    const postData = {
      type: 'insert',
      post: {
        post_title: title,
        post_cntn: content,
        rgsn_dttm: currentTime,
        amnt_dttm: currentTime,
      },
    };
    const request = await axios
      .post('/api/handlePost', { postData })
      .then((response) => response.data)
      .then(function (res) {
        setTitle('');
        setContent('');
        router.refresh();
        router.push(`/posts/detail/${res.postId}`);
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
          maxLength={300}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <textarea
        className='post_content_textarea'
        placeholder='내용을 입력하세요'
        value={content}
        maxLength={3000}
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
