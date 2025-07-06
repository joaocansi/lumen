export interface Comment {
    id: string;
    content: string;
    createdAt: Date;
}

export type CommentWithProfile = Comment & {
    profile: {
        avatarUrl?: string;
        name: string;
        username: string;
    }
};