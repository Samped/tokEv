import { useRef, useState } from "react";
import DeleteIcon from "../../../../public/delete.png";
import styled from "styled-components";
import Image from "next/image";

interface PictureUploadProps {
  name?: string;
  label?: string;
  width?: string;
}

interface FileData {
  name: string;
  size: string;
}

export const PictureUpload = ({ label, width }: PictureUploadProps) => {
  const [file, setFile] = useState<FileData | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const truncateDocName = (name: string): string => {
    return name.length > 35
      ? `${name.slice(0, 10)}...${name.slice(-14)}`
      : name;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files?.[0];
    if (newFile) {
      const parsedName = {
        name: truncateDocName(newFile.name),
        size: Number(newFile.size / 1024).toFixed(0),
      };
      setFile(parsedName);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  return (
    <Container $width={width}>
      {label && <Label>{label}</Label>}
      <>
        <UploadBox id="drag-area">
          <UploadTxt onClick={handleClick}>Browse File</UploadTxt>
          <DocTxtWrapper>
            <DocTxt>{file ? file.name : `No file chosen`}</DocTxt>
            {file && <SizeTxt>{`${file.size} KB`}</SizeTxt>}
          </DocTxtWrapper>
          <Input
            ref={inputRef}
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleFileSelect(e)
            }
            accept="image/pdf"
          />
          {file && (
            <Image
              src={DeleteIcon}
              onClick={() => removeFile()}
              alt={"delete icon"}
              width={16}
              height={16}
              className={"delete_icon"}
            />
          )}
        </UploadBox>
      </>
    </Container>
  );
};

const Container = styled.div<{ $width?: string }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  width: ${({ $width }) => ($width ? $width : `100%`)};
`;

const Label = styled.label`
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
`;

const UploadBox = styled.div`
  isolation: isolate;
  position: relative;
  display: inline-flex;
  gap: 14px;
  height: 44px;
  width: 100%;
  align-items: center;
  padding-right: 15px;
  flex-shrink: 0;
  border-radius: 8px;
  border: 1px solid #d0d5dd;
  box-shadow: 0px 1px 2px 0px #1018280d;
  background: var(--Shade-White, #fff);
  transition: all 0.25s ease;

  & .delete_icon {
    cursor: pointer;
  }

  & > svg {
    position: absolute;
    right: -10px;
    top: -10px;
    width: 20px;
    height: 20px;
    z-index: 2;
    cursor: pointer;
    fill: #f9fafb;
  }
`;

const UploadTxt = styled.p`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 500;
  line-height: 24px;
  border-right: 1px solid #d0d5dd;
  padding: 10px 12px 10px 14px;
  cursor: pointer;
`;

const DocTxt = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  color: #667085;
`;

const SizeTxt = styled(DocTxt)`
  color: #959ba8;
`;

const DocTxtWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding-right: 25px;
`;

const Input = styled.input`
  display: none;
`;
