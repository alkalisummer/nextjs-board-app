async function getPost(postId: string) {
  const res = await fetch(`http://127.0.0.1:8090/api/collections/posts/records/${postId}`, { next: { revalidate: 10 } });
  const data = res.json();

  if (!res.ok) {
    // 가장 가까이에 있는 error.js가 activated
    throw new Error('Failed to fetch data');
  }
  return data;
}

const PostDetailPage = async ({ params }: any) => {
  const post = await getPost(params.id);
  return (
    <div>
      <h1>posts/{post.id}</h1>
      <div>
        <h3>{post.title}</h3>
        <pre>{post.content}</pre>
        <p>{post.created}</p>
      </div>
    </div>
  );
};

export default PostDetailPage;
