export type Comment = {
  id: string;
  slug: string;
  locale: string;
  author: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected';
  parentId?: string;
  userAgent?: string;
  ipHash?: string;
};

export type CommentStore = {
  comments: Comment[];
};