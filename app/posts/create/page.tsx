'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

//Toast UI 에디터
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { onUploadImage } from '@/app/utils/commonUtils';

//시간포맷변경
import timeToString from '@/app/utils/commonUtils';

const CreatePost = () => {
  const [title, setTitle] = useState('');
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const [imgFileArr, setImgFileArr] = useState<string[]>([]);
  const router = useRouter();
  // toast ui 관련
  const editorRef = useRef(null);

  //html data 추출
  const cheerio = require('cheerio');

  useEffect(() => {
    const editor = new Editor({
      el: editorRef.current!,
      previewStyle: 'vertical',
      height: '79%',
      initialEditType: 'wysiwyg',
      initialValue: '내용을 입력하세요.',
      hooks: {
        addImageBlobHook: (imgFile, callBack) => {
          onUploadImage(imgFile).then((res) => {
            setImgFileArr((arr) => [...arr, res.imgName]);
            callBack(res.imgUrl, res.imgName); // 첫번째 인자 : return 받은 이미지 url, 두번째 인자: alt 속성
          });
        },
      },
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

    //현재 이미지 파일 이름 추출
    const imageTags = $('img');
    const currImageArr = imageTags.map((index: number, el: any) => $(el).attr('alt')).get();
    // 지워진 이미지
    let removedImg = [];

    // 현재 이미지에서 지워진 이미지 파일 이름 추출
    for (let originImg of imgFileArr) {
      if (currImageArr.indexOf(originImg) === -1) {
        removedImg.push(originImg);
      }
    }

    axios.post('/api/deleteImgFile', { removedImg });

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

  const hadleCancel = () => {
    // 이미지 제거
    if (imgFileArr.length > 0) {
      const removedImg = imgFileArr;
      axios.post('/api/deleteImgFile', { removedImg });
    }

    router.push(`/`);
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
      <div
        id='editor'
        ref={editorRef}></div>
      <div className='post_btn_div'>
        <button
          className='post_cancel_btn'
          onClick={hadleCancel}
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
