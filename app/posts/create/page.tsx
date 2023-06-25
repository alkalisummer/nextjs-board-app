'use client';

import { useRouter } from 'next/navigation';
import timeToString from '@/app/utils/commonUtils';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const router = useRouter();
  const editorRef = useRef(null);
  const cheerio = require('cheerio');

  useEffect(() => {
    const editor = new Editor({
      el: editorRef.current!,
      previewStyle: 'vertical',
      height: '79%',
      initialEditType: 'wysiwyg',
      initialValue: '내용을 입력하세요.',
    });
    setEditorInstance(editor);
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //html 추출 및 제거
    const htmlCntn = editorInstance?.getHTML();
    const $ = cheerio.load(htmlCntn);
    const plainText = $.text();

    if (title.replaceAll(' ', '').length === 0) {
      alert('제목을 입력하세요.');
      return;
    } else if (plainText.replaceAll(' ', '').length === 0) {
      alert('내용을 입력하세요.');
      return;
    }

    const blob = new Blob([htmlCntn!], { type: 'text/html' });

    const currentTime = timeToString(new Date());

    const postData = {
      type: 'insert',
      post: {
        post_title: title,
        post_cntn: plainText,
        post_html_cntn: blob,
        rgsn_dttm: currentTime,
        amnt_dttm: currentTime,
      },
    };
    await axios
      .post('/api/handlePost', { postData })
      .then((response) => response.data)
      .then(function (res) {
        setTitle('');
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
      {/* <textarea
        className='post_content_textarea'
        placeholder='내용을 입력하세요'
        value={content}
        maxLength={3000}
        onChange={(e) => setContent(e.target.value)}
      /> */}
      <div
        id='editor'
        ref={editorRef}></div>
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
