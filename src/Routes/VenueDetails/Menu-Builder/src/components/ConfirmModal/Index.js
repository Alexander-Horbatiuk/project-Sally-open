import React from 'react';
import ReactDOM from 'react-dom';
import './style.css'

export default function ConfirmModal ({
    title="Are you sure?",
    info,
    confirmButton="No",
    cancelButton="Yes",
    callback
}) {
    return ReactDOM.createPortal(
        <div className="confirm-modal">
            <div className="modal-content">
                <h1>{title}</h1>
                <p>{info}</p>
                <div className="flex-row flex-justify-center"> 
                    <button className="btn-cancel" onClick={(ev) => callback(ev,false)}>{cancelButton}</button>
                    <button className="btn-confirm" onClick={(ev) => callback(ev, true)}>
                        
                        <span>
                            <svg width="17px" viewBox="0 0 16 16" marginRight="15px" class="bi bi-trash" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"></path>
                            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"></path>
                            </svg>
                        </span>
                        
                        {confirmButton}
                    </button>
                </div>
            </div>
        </div>,
        document.getElementById('root')
    );
}