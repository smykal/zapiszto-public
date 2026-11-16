import React, { useState } from 'react';
import { useGetComments } from '../../services/comments/CommentsTanstackService';
import Modal from '../../constants/Modal';
import { CommentDto } from '../../types/types';
import { useTranslation } from "react-i18next";
import AddComment from './AddComment';
import Spinner from '../../common/Spinner';
import IUser from '../../types/user.type';
import AuthService from '../../services/auth.service';

interface ShowCommentsProps {
  origin: string;
  originId: string;
}

const ShowComments: React.FC<ShowCommentsProps> = ({ origin, originId }) => {
  const { t } = useTranslation("global");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: comments, isLoading, error } = useGetComments(origin, originId);
  const currentUser: IUser | undefined = AuthService.getCurrentUser();

  const handleShowComments = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleShowComments}>{t("comments.show_comments")}</button>
      <Modal show={isModalOpen} onClose={handleCloseModal} title={t("comments.comments")}>
        {isLoading && <><Spinner /></>}
        {error && <p>{t("comments.error_loading_comments")}</p>}
        {comments && comments.length > 0 ? (
          <ul>
            {comments.map((comment: CommentDto) => (
              comment.author === currentUser?.username ? 
              <li key={comment.id} style={{ textAlign: 'right' }}>
                <strong>{comment.author}</strong> {comment.content}
              </li>
              : 
              <li key={comment.id} style={{textAlign: 'left'}} >
                <strong>{comment.author}</strong> {comment.content}
              </li>
            ))}
          </ul>
        ) : (
          <p>{t("comments.no_comments_yet")}</p>
        )}
        <AddComment origin={origin} originId={originId} />
      </Modal>
    </div>
  );
};

export default ShowComments;