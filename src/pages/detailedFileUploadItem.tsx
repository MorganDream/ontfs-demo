import React, { useState, useMemo } from "react";
import { FileListItem } from "./fileListItem";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Collapse, TableContainer, Paper, Table, TableBody } from "@material-ui/core";
import { KeyValueInfoItem } from "../components/tableRow";

export interface FileUploadOption {
    file: File;
    fileDesc: string;
    storageType: number;
    copyNum: number;
    firstPdp: boolean;
    timeExpired: Date;
    encPassword: string;
}

export interface Props {
    fileUploadOption: FileUploadOption;
}

export const DetailedFileUploadItem = React.memo(({fileUploadOption: {
    file,
    fileDesc,
    storageType,
    copyNum,
    firstPdp,
    timeExpired,
    encPassword
}}: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    function onClick() {
        setOpen(!open)
    }

    const renderFileName = useMemo(() => KeyValueInfoItem('File Name', file.name), [file]);
    const renderFileDesc = useMemo(() => KeyValueInfoItem('File Description', fileDesc), [fileDesc]);
    const renderStorageType = useMemo(() => KeyValueInfoItem('Storage Type', storageType), [storageType]);
    const renderCopyNum = useMemo(() => KeyValueInfoItem('Copy Number', copyNum), [copyNum]);
    const renderFirstPdp = useMemo(() => KeyValueInfoItem('First Pdp', firstPdp? 'true' : 'false'), [firstPdp]);
    const renderTimeExpired = useMemo(() => KeyValueInfoItem('Expire Time', timeExpired.toDateString()), [timeExpired]);
    const renderEncPassword = useMemo(() => KeyValueInfoItem('Encryption Password', encPassword), [encPassword]);

    return (
        <div>
            <FileListItem fileTag={file.name} onClick={onClick}>
                {
                    open? <ExpandLess /> : <ExpandMore />
                }
            </FileListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <TableContainer component={Paper} style={{width: '80%', marginLeft: '20%'}}>
              <Table size="small" aria-label="File Info">
                <TableBody>
                    { renderFileName }
                    { renderFileDesc }
                    { renderCopyNum }
                    { renderFirstPdp }
                    { renderTimeExpired }
                    { renderEncPassword }
                    { renderStorageType }
                </TableBody>
              </Table>
            </TableContainer>
            </Collapse>
        </div>
    )
})