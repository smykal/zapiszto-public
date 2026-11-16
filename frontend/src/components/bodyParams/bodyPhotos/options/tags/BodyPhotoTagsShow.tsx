import React from 'react';
import { TagDto } from '../../../../../types/types';
import BodyPhotoTag from './BodyPhotoTag';

interface BodyPhotoTagsShowProps {
  tags: TagDto[];
  onDelete: (tagId: string) => void;
}

const BodyPhotoTagsShow: React.FC<BodyPhotoTagsShowProps> = ({ tags, onDelete }) => {
  return (
    <div style={{ color: "black" }}>
      {tags.length === 0 ? (
        <></>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: '.4rem' }}>
          {tags.map(tag => (
            <BodyPhotoTag
              key={tag.tagId}
              tagId={tag.tagId}
              name={tag.name}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BodyPhotoTagsShow;
