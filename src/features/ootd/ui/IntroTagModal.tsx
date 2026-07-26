import { Modal, Button } from '@/shared/components';
import type { TaggedItem } from '@/features/ootd/model/types';
import TagPin from './TagPin';

export interface IntroTagModalProps {
  open: boolean;
  onConfirm: () => void;
  imageUrl: string;
  previewTags?: TaggedItem[];
}

const IntroTagModal = ({ open, onConfirm, imageUrl, previewTags = [] }: IntroTagModalProps) => {
  return (
    <Modal open={open}>
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl">
          <img src={imageUrl} alt="" className="size-full object-cover object-top" />
          {previewTags.map((tag) => (
            <TagPin key={tag.id} item={tag} />
          ))}
        </div>

        <div>
          <h2 className="text-title-3 text-text-primary font-semibold">사진 속 태그 보기</h2>
          <p className="text-body-2 text-text-secondary mt-2 whitespace-pre-line">
            {'사진을 한 번 터치하면 태그가 숨겨지고,\n다시 터치하면 태그가 다시 표시돼요.'}
          </p>
        </div>
        <Button className="!w-full" onClick={onConfirm}>
          확인했어요!
        </Button>
      </div>
    </Modal>
  );
};

export default IntroTagModal;
