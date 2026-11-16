import React, { useEffect, useState } from "react";
import BodyPhotoTagsShow from "./BodyPhotoTagsShow";
import BodyPhotoTagsAdd from "./BodyPhotoTagsAdd";
import BodyPhotosTagsService from "../../../../../services/bodyParams/bodyPhotosTagsService";
import Spinner from "../../../../../common/Spinner";
import { TagDto } from "../../../../../types/types";
import Modal from "../../../../../constants/Modal";
import { withTranslation } from "react-i18next";

interface BodyPhotoTagsProps {
    photoId: string;
    t: any;
}

const BodyPhotoTags: React.FC<BodyPhotoTagsProps> = ({ t, photoId }) => {
    const [tags, setTags] = useState<TagDto[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    useEffect(() => {
        const fetchTags = async () => {
            try {
                setLoading(true);
                const response = await BodyPhotosTagsService.getBodyPhotoTags(photoId);
                const tagsMap = response.data.photoTags || {};

                const tagsArray: TagDto[] = Object.entries(tagsMap).map(
                    ([tagId, name]) => ({
                        tagId,
                        name
                    })
                );
                setTags(tagsArray);

            } catch (error) {
                console.error("Failed to fetch tags", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTags();
    }, [photoId]);

    const deleteTag = async (tagId: string) => {
        try {
            await BodyPhotosTagsService.deleteBodyPhotoTag(photoId, tagId);
            setTags(prev => prev.filter(tag => tag.tagId !== tagId));
        } catch (error) {
            console.error("Failed to delete tag", error);
        }
    };

    const saveTags = async (selectedTags: { id: string; name: string }[]) => {
        try {
            const payload: TagDto[] = selectedTags.map(tag => ({
                tagId: tag.id,
                name: tag.name
            }));

            await BodyPhotosTagsService.addBodyPhotoTags(photoId, payload);

            // po zapisie – odśwież listę
            const response = await BodyPhotosTagsService.getBodyPhotoTags(photoId);

            const tagsMap: Record<string, string> = response.data.photoTags || {};

            const tagsArray: TagDto[] = Object.entries(tagsMap).map(
                ([tagId, name]) => ({
                    tagId,
                    name
                })
            );

            setTags(tagsArray);

        } catch (error) {
            console.error("Failed to save tags", error);
        }
    };

    if (loading) {
        return <Spinner />;
    }

    return (
        <div>
            <BodyPhotoTagsShow tags={tags} onDelete={deleteTag} />
            <button onClick={() => setIsModalOpen(true)}>{t("buttons.add_tags")}</button>
            <Modal
                show={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t("buttons.add_tags")}
            >
                <BodyPhotoTagsAdd
                    onTagsSelected={(selectedTags) => {
                        saveTags(selectedTags);
                        setIsModalOpen(false) }
                    }
                    photoId={photoId}
                />
            </Modal>
        </div>
    );
};

export default withTranslation("global")(BodyPhotoTags);
