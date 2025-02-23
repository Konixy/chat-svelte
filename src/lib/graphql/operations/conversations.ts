import gql from 'graphql-tag';
import { ConversationFields } from '../fields';

const ConversationOperations = {
	Query: {
		conversations: gql`
      query Conversations {
        conversations {
          ${ConversationFields}
        }
      }
    `
	},
	Mutations: {
		createConversation: gql`
			mutation CreateConversation($participantsIds: [String]!) {
				createConversation(participantsIds: $participantsIds) {
					conversationId
				}
			}
		`,
		markConversationAsRead: gql`
			mutation MarkConversationAsRead($conversationId: String!) {
				markConversationAsRead(conversationId: $conversationId)
			}
		`,
		leaveConversation: gql`
			mutation LeaveConversation($conversationId: String!) {
				leaveConversation(conversationId: $conversationId)
			}
		`,
		deleteConversation: gql`
			mutation DeleteConversation($conversationId: String!) {
				deleteConversation(conversationId: $conversationId)
			}
		`,
		addParticipants: gql`
			mutation AddParticipants($conversationId: String!, $userIds: [String]!) {
				addParticipants(conversationId: $conversationId, userIds: $userIds)
			}
		`
	},
	Subscriptions: {
		conversationUpdated: gql`
      subscription ConversationUpdated {
        conversationUpdated {
					oldConversation {
          	${ConversationFields}
					}
					newConversation {
						${ConversationFields}
					}
        }
      }
    `,
		conversationDeleted: gql`
			subscription ConversationDeleted {
				conversationDeleted {
					id
				}
			}
		`,
		conversationParticipantDeleted: gql`
      subscription ConversationParticipantDeleted {
        conversationParticipantDeleted {
          participantId
          oldConversation {
            ${ConversationFields}
          }
          newConversation {
            ${ConversationFields}
          }
        }
      }
    `
	}
};

export default ConversationOperations;
