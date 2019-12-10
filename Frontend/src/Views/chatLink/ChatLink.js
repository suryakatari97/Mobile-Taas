import React, { Component } from 'react';
import {chatHost} from '../../config/settings';

class ChatLink extends Component {

    render() {
        const chatUserId = localStorage.chatUserId;
        const chatUserToken = localStorage.chatUserToken;
        const chatUrl = chatHost+"?userId=" + chatUserId + "&resumeToken=" + chatUserToken
        return (
            <a style={{textDecoration: "none"}} target="_blank" href={chatUrl}>Chat</a>
        )
    }
}

export default ChatLink;