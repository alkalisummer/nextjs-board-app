'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import timeToString from '@/app/utils/commonUtils';

const EditPost = ({ params }: any) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const param = {
    type: '',
    postId: params.id,
  };

  const getPost = async () => {
    param.type = 'read';
    await axios.get('/api/handlePost', { params: param }).then((res) => {
      setTitle(res.data.items[0].post_title);
      setContent(res.data.items[0].post_cntn);
    });
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

    const currentTime = timeToString(new Date());

    const postData = {
      type: 'update',
      post: {
        post_id: params.id,
        post_title: title,
        post_cntn: content,
        amnt_dttm: currentTime,
      },
    };

    await axios.post('/api/handlePost', { postData }).then(function () {
      setTitle('');
      setContent('');
      router.refresh();
      router.push(`/posts/detail/${params.id}`);
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
