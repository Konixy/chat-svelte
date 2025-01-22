import type {
	ConversationParticipant as PrismaConversationParticipant,
	Conversation as PrismaConversation,
	Message as PrismaMessage,
	User
} from '@prisma/client';

export type Conversation = Omit<PrismaConversation, 'latestMessageId'> & {
	participants: ConversationParticipant[];
	latestMessage?: Message;
};

export type ConversationParticipant = Omit<
	PrismaConversationParticipant,
	'userId' | 'latestSeenMessageId'
> & {
	user: User;
	latestSeenMessage: Message | null;
};

export type Message = Omit<PrismaMessage, 'senderId'> & {
	sender: User;
};
