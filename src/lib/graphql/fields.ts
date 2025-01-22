export const UserFields = `
  id
  username
  name
  image
  createdAt
  updatedAt
`;

export const MessageFields = `
  id
  sender {
    ${UserFields}
  }
  body
  conversationId
  createdAt
  updatedAt
`;

export const ConversationFields = `
  id
  name
  participants {
    id
    user {
      ${UserFields}
    }
    lastSeenMessageId
  }
  latestMessage {
    ${MessageFields}
  }
  updatedAt
`;
