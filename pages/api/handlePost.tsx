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
  let post;
  let postId;
  let result: { totalItems: number; items: any[]; postId: string } = {
    totalItems: 0,
    items: [],
    postId: '',
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
      sql = 'SELECT * FROM POST ORDER BY AMNT_DTTM DESC';
      break;
    case 'read':
      postId = params.postId;
      sql = `SELECT * FROM POST WHERE POST_ID = ${postId}`;
      break;
    case 'insert':
      post = params.post;
      sql = `INSERT INTO POST ( POST_TITLE, POST_CNTN, RGSN_DTTM, AMNT_DTTM ) VALUES ( '${post.post_title}', '${post.post_cntn}', '${post.rgsn_dttm}', '${post.amnt_dttm}')`;
      break;
    case 'update':
      post = params.post;
      sql = `UPDATE POST SET POST_TITLE = '${post.post_title}', POST_CNTN = '${post.post_cntn}', AMNT_DTTM='${post.amnt_dttm}' WHERE POST_ID='${post.post_id}'`;
      break;
    case 'delete':
      postId = params.postId;
      sql = `DELETE FROM POST WHERE POST_ID = ${postId}`;
      break;
  }

  await connection.query(sql, (err: any, data: any, fields: any) => {
    if (err) {
      console.log(err);
    } else {
      if (!data.length) {
        result.postId = data.insertId;
      } else {
        let rowArr = [];
        for (let row of data) {
          rowArr.push(row);
        }
        result.totalItems = rowArr.length;
        result.items = rowArr;
      }

      return response.status(200).json(result);
    }
  });
  connection.end();
}
