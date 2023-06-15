import fetchPost from '@/app/fetchPost';
import '../../../../styles/Post.css';
import Link from 'next/link';

const PostDetailPage = async ({ params }: any) => {
  const post = await fetchPost(params.id);
  const dateFormat = new Date(post.updated).toLocaleString('ko-kr', { hour12: false, timeStyle: 'short', dateStyle: 'long' });
  return (
    <div className='post_div'>
      <div className='post_title_created'>
        <span className='post_title'>{post.title}</span>
        <div className='post_created'>
          <span className='mg-r-10'>{dateFormat}</span>|
          <Link href={`/posts/edit/${params.id}`}>
            <span className='mg-r-10 mg-l-10'>수정</span>
          </Link>
          |<span className='mg-l-10'>삭제</span>
        </div>
      </div>
      <p className='post_content'>{post.content}</p>
    </div>
  );
};

export default PostDetailPage;
