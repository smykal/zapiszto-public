import React, { useState } from 'react';
import { useCreateComment } from '../../services/comments/CommentsTanstackService';

interface AddCommentProps {
  origin: string;
  originId: string;
}

const AddComment: React.FC<AddCommentProps> = ({ origin, originId }) => {
  const [content, setContent] = useState('');
  const createCommentMutation = useCreateComment();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() === '') {
      return;
    }

    console.log('Submitting comment with:', { content, origin: origin, originId: originId });
    createCommentMutation.mutate({ content, origin: origin, originId: originId });
    setContent(''); // Clear the input field after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
      />
      <button type="submit" disabled={createCommentMutation.status === 'pending'}>
        {createCommentMutation.status === 'pending' ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default AddComment;