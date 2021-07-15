import React, {useState} from 'react';
import styles from './FileInput.module.scss';
import CancelIcon from "@material-ui/icons/Cancel";
import {Button} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import Typography from "@material-ui/core/Typography";

interface IProps {
    title: String;
    files: Array<File>;
    onChange: (files: Array<File>) => void
}

const InputMultiImage: React.FC<IProps> = props => {
    const {title, files, onChange} = props;
    const [srcs, setSrcs] = useState<Array<string>>([]);

    const handleUploadPictures = (e) => {
        const newFiles = e.target.files as Array<File>;

        const newSrcs = Array.from(newFiles).map(elem => URL.createObjectURL(elem));

        onChange([...files, ...newFiles]);
        setSrcs([...srcs, ...newSrcs]);
    }
    const onCancelImg = (src: string, file: File) => {
        setSrcs(srcs.filter(pic => pic !== src));
        onChange(files.filter(item => item !== file));
    }

    return <div className={styles.UploadField}>
        <Typography variant={"subtitle1"}>
            {title}
        </Typography>
        <figure className={styles.UploadPicCase}>
            {srcs.map(renderImage)}
            <Button
                variant="outlined"
                component="label"
                classes={{label: styles.UploadBtnLabel}}
                color={"primary"}
                className={styles.UploadPicBtn}
            > <AddCircleOutlineIcon className={styles.AddFileIcon}/>
                Add Images
                <input
                    accept="image/*"
                    multiple
                    onChange={handleUploadPictures}
                    type="file"
                    style={{display: "none"}}
                />
            </Button>
        </figure>
    </div>;

    function renderImage(src: string, index: number) {
        return <div className={styles.PicWrapper}>
            <CancelIcon
                className={styles.CancelIcon}
                onClick={() => onCancelImg(src, files[index])}
            />
            <img className={styles.PicItem} src={src} alt={'img'}/>
        </div>
    }
}

export default InputMultiImage;