import React, { useState } from "react";
import { useGetDictTagsForBodyPhoto } from "../../../../../services/dict/DictTagsTanstackService";
import { DictTagsDto } from "../../../../../types/types";

interface BodyPhotoTagsAddProps {
    onTagsSelected: (tags: { id: string; name: string }[]) => void;
    photoId: string;
}

const BodyPhotoTagsAdd: React.FC<BodyPhotoTagsAddProps> = ({
    onTagsSelected,
    photoId,
}) => {
    const {
        data: tags = [],
        isLoading,
        isError,
    } = useGetDictTagsForBodyPhoto(photoId);

    const [selectedTags, setSelectedTags] = useState<
        { id: string; name: string }[]
    >([]);

    const handleTagToggle = (tag: DictTagsDto) => {
        setSelectedTags((prevSelected) => {
            const isSelected = prevSelected.some((t) => t.id === tag.id);

            if (isSelected) {
                return prevSelected.filter((t) => t.id !== tag.id);
            }

            return [...prevSelected, { id: tag.id, name: tag.name }];
        });
    };

    const handleSave = () => {
        onTagsSelected(selectedTags);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading tags.</div>;
    }

    return (
        <div>
            <ul>
                {tags.map((tag: DictTagsDto) => (
                    <li key={tag.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedTags.some((t) => t.id === tag.id)}
                                onChange={() => handleTagToggle(tag)}
                            />
                            {tag.name}
                        </label>
                    </li>
                ))}
            </ul>

            <button onClick={handleSave}>
                Save Tags
            </button>
        </div>
    );
};

export default BodyPhotoTagsAdd;