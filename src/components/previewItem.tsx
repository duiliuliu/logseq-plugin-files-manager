import React, { useRef, useState } from 'react';
import { DataType } from '../data/enums';
import { isMD } from '../utils/fileUtil';
import Frame from 'react-frame-component';
import { reanderMd } from '../utils/mdUtil';

// 定义 props 结构
interface PreviewFrameProps {
    src: string;
    dataType: DataType;
    height: number;
    width: number;
    extName?: string
}

/**
 * DocumentFrame 组件用于在 iframe 中显示 PDF 或 Markdown 文件。
 */
const PreviewFrame: React.FC<PreviewFrameProps> = ({ src, height, width, dataType, extName }) => {
    // 根据文件类型调整 src 属性
    const iframeSrc = `${src}#toolbar=0`;
    const frameRef = useRef<HTMLIFrameElement>(null);

    const [_content, setContent] = useState<string>('')
    const onLoad = (_e: any) => {
        if ((dataType === DataType.PAGE || dataType == DataType.JOURNAL || isMD(extName ?? ''))) {
            const doc = frameRef.current?.contentWindow?.document?.body
            if (doc) {
                setContent(doc.innerText)
                // createPortal(<div>testtest</div>, doc)
            }
        }
    }

    if (dataType === DataType.PAGE || dataType == DataType.JOURNAL || isMD(extName ?? '')) {
        return <div>
            <iframe
                style={{
                    width: width * 0.8,
                    height: height,
                    display: 'none'  // TODO 使用markdown解析展示
                }}
                src={iframeSrc}
                ref={frameRef}
                frameBorder='no'
            >
            </iframe>
            <Frame
                style={{ width: width * 0.8, height: height, border: '#e6e6e6 1px solid', }}
                frameBorder='no'
                src={iframeSrc}
                onLoad={onLoad}
            >
                {reanderMd(_content)}
            </Frame>
        </div>
    }

    return (
        <iframe
            style={{ width: width * 0.8, height: height, border: '#e6e6e6 1px solid', }}
            frameBorder='no'
            src={iframeSrc}
            ref={frameRef}
        />
    );
};

export default PreviewFrame;