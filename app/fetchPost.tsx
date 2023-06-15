import React from 'react';

const fetchPost = async (postId: string) => {
  const res = await fetch(`http://127.0.0.1:8090/api/collections/posts/records/${postId}`, { cache: 'no-store' });
  const data = res.json();

  if (!res.ok) {
    // 가장 가까이에 있는 error.js가 activated
    throw new Error('Failed to fetch data');
  }
  return data;
};

export default fetchPost;
