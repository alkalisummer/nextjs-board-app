import { AnySrvRecord } from 'dns';
import { NextApiRequest, NextApiResponse } from 'next';

const conn = {
  // mysql 접속 설정
  host: process.env.CLOUD_MYSQL_HOST,
  port: process.env.CLOUD_MYSQL_PORT,
  user: process.env.CLOUD_MYSQL_USER,
  password: process.env.CLOUD_MYSQL_PASSWORD,
  database: process.env.CLOUD_MYSQL_DATABASE_NM,
};

export default async function handlePost(request: NextApiRequest, response: NextApiResponse) {
  const mysql = require('mysql');
  let params;
  let connection;
  let sql = '';
  let result: { totalItems: number; items: any[] } = {
    totalItems: 0,
    items: [],
  };
  if (request.method === 'GET') {
    params = request.query;
  } else if (request.method === 'POST') {
    params = request.body.postData;
  }
  console.log(params);
  connection = await mysql.createConnection(conn);
  await connection.connect();

  switch (params.type) {
    case 'list':
      sql = 'SELECT * FROM POST';
      break;
    case 'read':
      const postId = params.postId;
      sql = `SELECT * FROM POST WHERE POST_ID = ${postId}`;

      break;
    case 'insert':
      const post = params.post;
      sql = `INSERT INTO POST ( POST_ID, POST_TITLE, POST_CNTN, RGSN_DTTM, AMNT_DTTM ) VALUES ( '${post.post_id}', '${post.post_title}', '${post.post_cntn}', '${post.rgsn_dttm}', '${post.amnt_dttm}')`;
      break;
    case 'update':
      break;
    case 'delete':
      break;
  }

  await connection.query(sql, (err: any, data: any, fields: any) => {
    if (err) {
      console.log(err);
    } else {
      let rowArr = [];
      for (let row of data) {
        rowArr.push(row);
      }
      result.totalItems = rowArr.length;
      result.items = rowArr;

      return response.status(200).json(result);
    }
  });
  connection.end();
}
