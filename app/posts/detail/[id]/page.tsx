'use client';

import '../../../../styles/Post.css';
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { timeFormat } from '@/app/utils/commonUtils';

const PostDetailPage = ({ params }: any) => {
  const [post, setPost] = useState({ post_title: '', post_cntn: '', post_html_cntn: { data: [] }, amnt_dttm: '' });
  const router = useRouter();

  const param = {
    type: '',
    postId: params.id,
  };

  const getPost = async () => {
    param.type = 'read';
    await axios.get('/api/handlePost', { params: param }).then((res) => {
      setPost(res.data.items[0]);
    });
  };

  useEffect(() => {
    getPost();
  }, [params.id]);

  const handleDelete = async () => {
    param.type = 'delete';
    await axios.get('/api/handlePost', { params: param }).then(() => {
      setPost({ post_title: '', post_cntn: '', post_html_cntn: { data: [] }, amnt_dttm: '' });
      router.refresh();
      router.push('/');
    });
  };
  return (
    <div className='post_div'>
      <div className='post_title_created'>
        <span className='post_title'>{post.post_title}</span>
        <div className='post_created'>
          <span className='mg-r-10 pointer'>{timeFormat(post.amnt_dttm)}</span>|
          <Link href={`/posts/edit/${params.id}`}>
            <span className='mg-r-10 mg-l-10'>수정</span>
          </Link>
          |
          <span
            className='mg-l-10 pointer'
            onClick={() => handleDelete()}>
            삭제
          </span>
        </div>
      </div>
      <p
        className='post_content'
        dangerouslySetInnerHTML={{ __html: Buffer.from(post.post_html_cntn.data).toString() }}></p>
    </div>
  );
};

export default PostDetailPage;
