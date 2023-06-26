'use client';

import { useRouter } from 'next/navigation';
import timeToString from '@/app/utils/commonUtils';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Editor from '@toast-ui/editor';
import API_KEY from '@/app/config';
import '@toast-ui/editor/dist/toastui-editor.css';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const router = useRouter();
  // toast ui 관련
  const editorRef = useRef(null);

  //html data 추출
  const cheerio = require('cheerio');

  //반환 이미지 url
  const imgURL = API_KEY.CLOUD_BUCKET_URL;

  useEffect(() => {
    const onUploadImage = async (imgFile: File | Blob, callBack: any) => {
      await axios({
        method: 'POST',
        url: '/api/readImgFile',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: imgFile,
      }).then((res) => {
        console.log('업로드 결과:');
        console.log(res);
        callBack(`${imgURL}/${imgFile.name}`, 'Image URL Error!!');
        return res;
      });
    };
    const editor = new Editor({
      el: editorRef.current!,
      previewStyle: 'vertical',
      height: '79%',
      initialEditType: 'wysiwyg',
      initialValue: '내용을 입력하세요.',
      hooks: { addImageBlobHook: onUploadImage },
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

    // 오라클 클라우드 객체 스토리지에 이미지 업로드
    // const getImageSrc = () => {
    //   const cloudSrcArr: string[] = []; // 오라클 클라우드에 이미지 업로드 후 반환받은 이미지 url
    //   let src;
    //   $('img').each((idx: number, el: HTMLElement) => {
    //     src = $(el).attr('src');
    //     axios.post('/api/readImgFile', { imgFile });

    //     debugger;
    //   });

    //   return cloudSrcArr;
    // };

    //const imageSrcArr = getImageSrc();

    const currentTime = timeToString(new Date());

    const postData = {
      type: 'insert',
      post: {
        post_title: title,
        post_cntn: plainText,
        post_html_cntn: htmlCntn,
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
