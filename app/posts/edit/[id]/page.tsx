'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// 오라클 클라우드 api key
import API_KEY from '@/app/config';

//Toast UI 에디터
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { onUploadImage } from '@/app/utils/commonUtils';

//시간포맷변경
import timeToString from '@/app/utils/commonUtils';

const EditPost = ({ params }: any) => {
  const [title, setTitle] = useState('');
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const router = useRouter();
  // toast ui 관련
  const editorRef = useRef(null);

  //html data 추출
  const cheerio = require('cheerio');

  //반환 이미지 url
  const imgURL = API_KEY.CLOUD_BUCKET_URL;

  const param = {
    type: '',
    postId: params.id,
  };

  const getPost = async () => {
    param.type = 'read';
    await axios.get('/api/handlePost', { params: param }).then((res) => {
      setTitle(res.data.items[0].post_title);
      debugger;
      const editor = new Editor({
        el: editorRef.current!,
        previewStyle: 'vertical',
        height: '79%',
        initialEditType: 'wysiwyg',
        initialValue: Buffer.from(res.data.items[0].post_html_cntn).toString(),
        hooks: { addImageBlobHook: onUploadImage },
      });
    });
  };

  useEffect(() => {
    getPost();
  }, [params.id]);

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

    const currentTime = timeToString(new Date());

    const postData = {
      type: 'update',
      post: {
        post_id: params.id,
        post_title: title,
        post_cntn: plainText,
        post_html_cntn: htmlCntn,
        amnt_dttm: currentTime,
      },
    };

    await axios.post('/api/handlePost', { postData }).then(function () {
      setTitle('');
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
      <div
        id='editor'
        ref={editorRef}></div>
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
