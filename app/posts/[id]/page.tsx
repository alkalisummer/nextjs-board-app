async function getPost(postId: string) {
  const res = await fetch(`http://127.0.0.1:8090/api/collections/posts/records/${postId}`, { next: { revalidate: 10 } });
  const data = res.json();
  return data;
}

const PostDetailPage = async ({ params }: any) => {
  console.log(params);
  const post = await getPost(params.id);
  console.log(post);
  debugger;
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
