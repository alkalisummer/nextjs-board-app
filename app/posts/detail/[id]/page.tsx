'use client';

import fetchPost from '../../../api/route';
import '../../../../styles/Post.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const PostDetailPage = ({ params }: any) => {
  const [post, setPost] = useState<{ [key: string]: any }>({});
  const [dateFormat, setDateFormat] = useState('');
  const router = useRouter();

  const getPost = async () => {
    const post = await fetchPost(params.id);
    const dateFormat = new Date(post.updated).toLocaleString('ko-kr', { hour12: false, timeStyle: 'short', dateStyle: 'long' });
    setPost(post);
    setDateFormat(dateFormat);
  };

  useEffect(() => {
    getPost();
  }, [params.id]);

  const handleDelete = async () => {
    const recordId = params.id;
    const request = await fetch(`http://127.0.0.1:8090/api/collections/posts/records/${params.id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recordId,
      }),
    }).then(() => {
      setPost({});
      setDateFormat('');
      router.refresh();
      router.push('/');
    });
  };
  return (
    <div className='post_div'>
      <div className='post_title_created'>
        <span className='post_title'>{post.title}</span>
        <div className='post_created'>
          <span className='mg-r-10'>{dateFormat}</span>|
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
      <p className='post_content'>{post.content}</p>
    </div>
  );
};

export default PostDetailPage;
