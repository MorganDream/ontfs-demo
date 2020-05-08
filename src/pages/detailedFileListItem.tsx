import React, { useState, useMemo } from "react";
import { FileInfo } from "@ont-dev/ontology-dapi";
import { FileListItem } from "./fileListItem";
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Collapse, TableContainer, Paper, Table, TableBody } from "@material-ui/core";
import { KeyValueInfoItem } from "../components/tableRow";
import { ecllipse } from "../utils";


export interface Props {
    fileInfo: FileInfo;
    key?: any;
}

export const DetailedFileListItem = React.memo(({fileInfo: {
    fileHash,
    fileOwner,
    fileDesc,
    fileBlockCount,
    realFileSize,
    copyNumber,
    payAmount,
    restAmount,
    firstPdp,
    timeStart,
    timeExpired,
    beginHeight,
    expiredHeight,
    pdpParam,
    validFlag,
    storageType
}, key }: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    function onClick() {
        setOpen(!open)
    }

    const renderFileOwner = useMemo(() => KeyValueInfoItem('Owner', fileOwner), [fileOwner]);
    const renderFileDesc = useMemo(() => KeyValueInfoItem('Description', fileDesc), [fileDesc]);
    const renderFileBlockCount = useMemo(() => KeyValueInfoItem('Block Count', fileBlockCount), [fileBlockCount]);
    const renderRealFileSize = useMemo(() => KeyValueInfoItem('Size(kb)', realFileSize), [realFileSize]);
    const renderCopyNum = useMemo(() => KeyValueInfoItem('Copy Number', copyNumber), [copyNumber]);
    const renderPayAmount = useMemo(() => KeyValueInfoItem('Pay Amount', payAmount), [payAmount]);
    const renderRestAmount = useMemo(() => KeyValueInfoItem('Rest Amount', restAmount), [restAmount]);
    const renderFirstPdp = useMemo(() => KeyValueInfoItem('First Pdp', firstPdp? 'true' : 'false'), [firstPdp]);
    const renderTimeStart = useMemo(() => KeyValueInfoItem('Start Time', timeStart.toDateString()), [timeStart]);
    const renderTimeExpired = useMemo(() => KeyValueInfoItem('Expire Time', timeExpired.toDateString()), [timeExpired]);
    const renderBeginHeight = useMemo(() => KeyValueInfoItem('Begin Height', beginHeight), [beginHeight]);
    const renderExpiredHeight = useMemo(() => KeyValueInfoItem('Expire Height', expiredHeight), [expiredHeight]);
    const renderPdpParam = useMemo(() => KeyValueInfoItem('Pdp Param', ecllipse(pdpParam)), [pdpParam]);
    const renderValidFlag = useMemo(() => KeyValueInfoItem('Valid Flag', validFlag? 'true' : 'false'), [validFlag]);
    const renderStorageType = useMemo(() => KeyValueInfoItem('Storage Type', storageType), [storageType]);


    return (
        <div>
            <FileListItem fileTag={fileHash} onClick={onClick} key={key}>
                {
                    open? <ExpandLess /> : <ExpandMore />
                }
            </FileListItem>
            <Collapse in={open} timeout="auto" unmountOnExit>
            <TableContainer component={Paper} style={{width: '80%', marginLeft: '20%'}}>
              <Table size="small" aria-label="File Info">
                <TableBody>
                    { renderFileOwner }
                    { renderFileDesc }
                    { renderFileBlockCount }
                    { renderRealFileSize }
                    { renderCopyNum }
                    { renderPayAmount }
                    { renderRestAmount }
                    { renderFirstPdp }
                    { renderTimeStart }
                    { renderTimeExpired }
                    { renderBeginHeight }
                    { renderExpiredHeight }
                    { renderPdpParam }
                    { renderValidFlag }
                    { renderStorageType }
                </TableBody>
              </Table>
            </TableContainer>
            </Collapse>
        </div>
    )
})