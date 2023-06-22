import { NextRequest, NextResponse } from 'next/server';

const conn = {
  // mysql 접속 설정
  host: process.env.CLOUD_MYSQL_HOST,
  port: process.env.CLOUD_MYSQL_PORT,
  user: process.env.CLOUD_MYSQL_USER,
  password: process.env.CLOUD_MYSQL_PASSWORD,
  database: process.env.CLOUD_MYSQL_DATABASE_NM,
};

export async function GET(request: NextRequest) {
  const mysql = require('mysql');
  let connection;
  let sql = '';
  let res: { page: number; perPage: number; totalItems: number; items: [] } = {
    page: 0,
    perPage: 0,
    totalItems: 0,
    items: [],
  };

  connection = await mysql.createConnection(conn);
  await connection.connect();

  connection.end();
  console.log('탔다!!!');

  return NextResponse.json({ message: 'Hello World' }, { status: 200 });
}
