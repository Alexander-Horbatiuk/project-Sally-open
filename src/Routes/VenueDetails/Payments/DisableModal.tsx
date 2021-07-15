import React from 'react';
import Modal from '@material-ui/core/Modal';
import styles from './DisableModal.module.scss';
import Fade from '@material-ui/core/Fade';
import Backdrop from '@material-ui/core/Backdrop';
import Button from '@material-ui/core/Button';
import Loader from '../../../Components/Loader';
import firebase from '../../../firebase'
import Typography from "@material-ui/core/Typography";
import IVenue from "../../../types/IVenue";

interface IProps {
    venue?: IVenue;
    id: string;
    handleClose: () => void;
}

const ModalDisable: React.FC<IProps> = (props) => {
    const {id, handleClose, venue} = props
    const [loading, setLoading] = React.useState(false);

    const onSubmitDisable = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const deleteSub = firebase.functions().httpsCallable('deleteSubscription')
            await deleteSub({ venueId: id })
            
            handleClose();
        } catch (error) {

        } finally {
            setLoading(false);
        }
    }

    return (
        <Modal aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={styles.DisableModal}
            open={id !== ""}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{timeout: 500,}}
        >
            <Fade in={id !== ""}>
                <form className={styles.PaperDisable} onSubmit={onSubmitDisable}>
                    <h2 className={styles.ModalTitle}>Disable</h2>
                    <Typography className={styles.Text} variant={"body1"}>
                        Disable venue {venue?.name}? It will stay active till the end of this month.
                    </Typography>
                    <div className={styles.BoxBtnModal}>
                        <Button variant="outlined"
                                className={styles.BtnCancel}
                                onClick={handleClose!}
                                disabled={loading && true}
                        >
                            cancel
                        </Button>
                        <Button variant="contained"
                                value="btn"
                                type="submit"
                                color={"secondary"}
                                className={styles.BtnDisable}
                                disabled={loading && true}
                                style={{}}
                        >
                            disable
                        </Button>
                    </div>
                    {loading && <Loader/>}
                </form>
            </Fade>
        </Modal>
    )


}
export default ModalDisable;
