import React, {useState, useEffect} from 'react';
import styles from './FileInput.module.scss';
import CancelIcon from "@material-ui/icons/Cancel";
import {Button} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import InsertDriveFileRoundedIcon from "@material-ui/icons/InsertDriveFileRounded";
import Typography from "@material-ui/core/Typography";

interface IProps {
    title: string;
    file: File | undefined;
    type: "image" | "pdf";
    onChange: (file: File | undefined) => void;
    defaultSrc: string;
}

const InputFile: React.FC<IProps> = props => {
    const {title, type, onChange, file} = props;
    const [src, setSrc] = useState<string>("");

    function handleChange(e) {
        const files = e.target.files;
        onChange(files[0]);
        if (type === "image") {
            setSrc(URL.createObjectURL(files[0]));
        }
    }

    useEffect(() => {
        setSrc(props.defaultSrc ? props.defaultSrc : "")
    }, [props.defaultSrc])

    return <div className={styles.UploadField}>
        <Typography variant={"subtitle1"}>
            {title}
        </Typography>
        {((src !== "" && type === "image") || src.includes("https://")) && renderImage()}
        {file && type === "pdf" && renderPdf()}

        {((!file && !props.defaultSrc) || src === "") && <Button
            variant="outlined"
            component="label"
            color={"primary"}
            classes={{label: styles.UploadBtnLabel}}
            className={styles.UploadPicBtn}
        >
            <AddCircleOutlineIcon className={styles.AddFileIcon}/>
            Add {type === "image" ? "image" : "pdf"}
            <input
                accept={type === "image" ? "image/*" : "application/pdf"}
                onChange={handleChange}
                type="file"
                style={{display: "none"}}
            />
        </Button>}
    </div>

    function renderImage() {
        return <div className={styles.PicBox}>
            <CancelIcon
                className={styles.CancelIcon}
                onClick={() => {
                    setSrc("")
                    onChange(undefined);
                }}
            />
            <label className={`${styles.PicWrapper} ${styles.ChangeHover}`}>
                <img className={styles.PicItem} src={src} alt={'img'}/>
                <input
                    accept={type === "image" ? "image/*" : "application/pdf"}
                    onChange={handleChange}
                    type="file"
                    style={{display: "none"}}
                />
            </label>
        </div>
    }

    function renderPdf() {
        return <div className={styles.PicBox}>
            <CancelIcon
                className={styles.CancelIcon}
                onClick={() => onChange(undefined)}
            />
            <label className={`${styles.UploadPDFWrapper} ${styles.ChangeHover}`}>
                <InsertDriveFileRoundedIcon
                    style={{width: '75px', height: '75px'}}
                />
                <div>
                    {file && file.name}
                </div>
                <input
                    accept={type === "image" ? "image/*" : "application/pdf"}
                    onChange={handleChange}
                    type="file"
                    style={{display: "none"}}
                />
            </label>
        </div>
    }
}

export default InputFile;