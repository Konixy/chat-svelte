import type {
	ConversationParticipant as PrismaConversationParticipant,
	Conversation as PrismaConversation,
	Message as PrismaMessage
} from '@prisma/client';
import type { GraphQLError } from 'graphql';

export type Conversation = Omit<PrismaConversation, 'latestMessageId'> & {
	participants: ConversationParticipant[];
	latestMessage?: Message;
};

export type ConversationParticipant = Omit<PrismaConversationParticipant, 'userId'> & {
	user: User;
};

export type Message = Omit<PrismaMessage, 'senderId'> & {
	sender: User;
};

export type MessageWithLoading = Message & {
	loading?: boolean;
};

export interface GraphQLResponse<N extends keyof any, R = {}> {
	data?: {
		[key in N]: R;
	};
	errors?: GraphQLError[];
}

export type User = {
	id: string;
	email: string;
	emailVerified?: boolean;
	name: string;
	username?: string | null;
	createdAt: Date;
	updatedAt: Date;
	image?: string | null | undefined;
};
