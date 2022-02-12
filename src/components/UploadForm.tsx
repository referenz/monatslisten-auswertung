import React, { forwardRef, MutableRefObject, SyntheticEvent, DragEvent } from 'react';
import { Form } from 'react-bootstrap';
import './UploadForm.css';
import GlobalState from '../types/GlobalState';
import FileBufferObj from '../types/FileBufferObj';

interface UploadFormProps extends React.ComponentPropsWithoutRef<'form'> {
    globalState: GlobalState;
    setGlobalState: (state: GlobalState) => void;
    className: string;
    file: string;
    datei_neu?: MutableRefObject<FileBufferObj>;
    datei_alt?: MutableRefObject<FileBufferObj>;
}

const UploadForm = forwardRef<HTMLFormElement, UploadFormProps>((props: UploadFormProps, ref) => {
    function dragover(e: SyntheticEvent) {
        e.preventDefault();
        (e.target as HTMLLabelElement).classList.add('dragover');
    }

    function dragleave(e: SyntheticEvent) {
        (e.target as HTMLLabelElement).classList.remove('dragover');
    }

    function drop(e: DragEvent) {
        e.preventDefault();
        (e.target as HTMLLabelElement).innerText = e.dataTransfer.files[0].name;
        submitFile(e.dataTransfer.files[0]);
    }

    function fs_input(e: SyntheticEvent) {
        (e.target as HTMLInputElement).parentElement.classList.add('dragover');
        (e.target as HTMLInputElement).parentElement.innerText = (e.target as HTMLInputElement).files[0].name;

        submitFile((e.target as HTMLInputElement).files[0]);
    }

    async function submitFile(file: File) {
        if (props.globalState === 'INIT') {
            props.datei_neu.current = {
                name: file.name,
                buffer: await file.arrayBuffer(),
            };
            props.setGlobalState('ONE_FILE');
        }
        if (props.globalState === 'ONE_FILE') {
            props.datei_alt.current = {
                name: file.name,
                buffer: await file.arrayBuffer(),
            };
            props.setGlobalState('TWO_FILES');
        }
    }

    return (
        <Form className="dropform showtoggle noshow-invisible" ref={ref}>
            <Form.Group controlId={props.file} className={props.className}>
                <Form.Label
                    className="dropzone"
                    onDragOver={(e) => dragover(e)}
                    onDragLeave={(e) => dragleave(e)}
                    onDrop={(e) => drop(e)}
                >
                    {props.file === 'datei_neu' && (
                        <>
                            Aktuellen Monatsbericht auf dieses Feld ziehen <br /> oder hier klicken
                        </>
                    )}
                    {props.file === 'datei_alt' && (
                        <>
                            Alten Monatsbericht zum Vergleichen auf dieses Feld ziehen <br /> oder hier klicken
                        </>
                    )}
                    <Form.Control type="file" onChange={(e) => fs_input(e)} />
                </Form.Label>
            </Form.Group>
        </Form>
    );
});

export default UploadForm;
