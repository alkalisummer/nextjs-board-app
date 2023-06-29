'use client';

import React, { useEffect, useState } from 'react';
import '../../styles/chat.css';

const ChatGpt = () => {
  const [chatContent, setChatContent] = useState([]);
  const [userInput, setUserInput] = useState('');

  useEffect(() => {
    const footer: any = document.getElementsByClassName('right_footer')[0];
    const leftArea: any = document.getElementsByClassName('left_area')[0];
    footer.style.backgroundColor = '#343541';
    footer.style.borderColor = '#545562';
    leftArea.style.backgroundColor = '#202123';

    return () => {
      footer.style.backgroundColor = 'white';
      footer.style.borderColor = '#efefef';
      leftArea.style.backgroundColor = '#009bf2';
    };
  }, []);

  return (
    <div className='chat_div'>
      <div className='chat_content_div'></div>
      <div className='user_input_div'>
        <input
          type='text'
          className='user_input'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder='Send a message'
        />
      </div>
    </div>
  );
};

export default ChatGpt;
