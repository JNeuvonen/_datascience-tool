import React, { useRef } from "react";

interface Props {
  triggerElement: JSX.Element;
  onFilesSelected: (files: FileList) => void;
}

export const FileSelector = ({ triggerElement, onFilesSelected }: Props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTriggerClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      onFilesSelected(event.target.files);
    }
  };

  const trigger = React.cloneElement(triggerElement, {
    onClick: handleTriggerClick,
  });

  return (
    <div>
      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleChange}
        style={{ display: "none" }}
      />
      {trigger}
    </div>
  );
};
