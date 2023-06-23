'use client';

import '../../../../styles/Post.css';
import Link from 'next/link';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PostDetailPage = ({ params }: any) => {
  const [post, setPost] = useState<{ [key: string]: any }>({});
  const router = useRouter();

  const param = {
    type: '',
    postId: params.id,
  };

  const getPost = async () => {
    param.type = 'read';
    await axios.get('/api/handlePost', { params: param }).then((res) => setPost(res.data.result));
  };

  useEffect(() => {
    getPost();
  }, [params.id]);

  const handleDelete = async () => {
    param.type = 'delete';
    const request = await axios.post('/api/handlePost', { params: param }).then(() => {
      setPost({});
      router.refresh();
      router.push('/');
    });
  };
  return (
    <div className='post_div'>
      <div className='post_title_created'>
        <span className='post_title'>{post.post_title}</span>
        <div className='post_created'>
          <span className='mg-r-10'>{post.amnt_dttm}</span>|
          <Link href={`/posts/edit/${params.id}`}>
            <span className='mg-r-10 mg-l-10'>수정</span>
          </Link>
          |
          <span
            className='mg-l-10'
            onClick={() => handleDelete()}>
            삭제
          </span>
        </div>
      </div>
      <p className='post_content'>{post.post_cntn}</p>
    </div>
  );
};

export default PostDetailPage;
