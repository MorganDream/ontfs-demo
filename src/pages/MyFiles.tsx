import React, { useEffect, useState, useMemo } from "react";
import { Container, Grid, Typography, List, TableContainer, Paper, Table, TableBody, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useStyles } from "../hooks/style";
import { client, FileHashList, FileInfo, Space } from '@ont-dev/ontology-dapi';
import { DetailedFileListItem } from "./detailedFileListItem";
import { KeyValueInfoItem } from "../components/tableRow";

const defaultFilesInfo: FileInfo[] = [{
  fileHash: 'defaultfileHash1',
  fileOwner: 'Owner1',
  fileDesc: 'Demo',
  fileBlockCount: 1,
  realFileSize: 100,
  copyNumber: 2,
  payAmount: 100,
  restAmount: 20,
  firstPdp: false,
  timeStart: new Date(),
  timeExpired: new Date(),
  beginHeight: 1,
  expiredHeight: 10,
  pdpParam: 'abcdef',
  validFlag: false,
  storageType: 1
}, {
  fileHash: 'defaultfileHash2',
  fileOwner: 'Owner2',
  fileDesc: 'Demo',
  fileBlockCount: 1,
  realFileSize: 100,
  copyNumber: 2,
  payAmount: 100,
  restAmount: 20,
  firstPdp: false,
  timeStart: new Date(),
  timeExpired: new Date(),
  beginHeight: 1,
  expiredHeight: 10,
  pdpParam: 'abcdef',
  validFlag: false,
  storageType: 1
}]

function fileHashListToFileHashes (fileHashList: FileHashList): string[] {
    return fileHashList.filesH.map(fileHash => fileHash.fHash);
}


export const MyFilesPage = React.memo(() => {
    const classes = useStyles();
    const [filesInfo, setFilesInfo] = useState<FileInfo[]>(defaultFilesInfo);
    const [exception, setException] = useState<string | undefined>(undefined);

    const [spaceInfo, setSpaceInfo] = useState<Space | undefined>(undefined);
    const [open, setOpen] = useState<boolean>(false);
    const [spaceToBeCreated, setSpaceToBeCreated] = useState<{
      volume: number;
      copyNumber: number;
      timeStart: Date;
      timeExpired: Date;
  }>({
      volume: 10000,
      copyNumber: 1,
      timeStart: new Date(),
      timeExpired: new Date('2020-12-12')
    });
    const { volume, copyNumber, timeStart, timeExpired } = spaceToBeCreated;

    async function updateSpaceInfo() {
      return await client.api.fs!.space.get();
    }

    async function updateFileList() {
      const fileHashList = await client.api.fs!.getFileList();
      const fileList = await Promise.all(fileHashListToFileHashes(fileHashList).map(fileHash => client.api.fs!.getFileInfo({fileHash})))
      return Promise.all(fileList.map(async (fileInfo) => {
        return {
          ...fileInfo,
          ...{
            fileHash: await client.api.utils.hexToStr(fileInfo.fileHash)
          }
        }
      }))
    }

    function onCreateSpace() {
      setOpen(true);
    }

    function handleClose() {
      setOpen(false);
    }

    function createSpace() {
      client.api.fs!.space.create({
        ...spaceToBeCreated,
        ...{
          volume: Number(spaceToBeCreated.volume),
          gasPrice: 500,
          gasLimit: 40000
        }
      }).then(() => setOpen(false))
    }

    function onChange(propName: string) {
      return function(event: any) {
        setSpaceToBeCreated({
          ...spaceToBeCreated,
          ...{
            [propName]: event.target.value
          }
        })
      }
    }

    useEffect(() => {
        try {
          updateSpaceInfo().then(space => {
            setSpaceInfo(space);
          })
          .then(_ => updateFileList())
          .then((fileInfos) => {
            setFilesInfo(fileInfos.map(fileInfo => {
              return {
                ...fileInfo,
                ...{
                  timeStart: new Date(fileInfo.timeStart),
                  timeExpired: new Date(fileInfo.timeExpired)
                }
              }
            }));
            setException(undefined);
          }).catch(e => setException(JSON.stringify(e)));
        } catch(e) {
          setException(JSON.stringify(e))
        };
    }, [])

    const renderSpaceInfo = useMemo(() => 
      {
        return (
          spaceInfo === undefined? 
            <Button variant="contained" color="primary" onClick={onCreateSpace}>Create Space Now</Button>:
            <TableContainer component={Paper}>
                <Table size="small" aria-label="File Info">
                    <TableBody>
                        <React.Fragment>
                        {
                          Object.entries(spaceInfo).map(([prop, value]) => KeyValueInfoItem(prop, value))
                        }
                        </React.Fragment>
                    </TableBody>
                </Table>
            </TableContainer>
        )
      }, [spaceInfo])

    return (
        <Container maxWidth="sm">
            <Grid item>
              <Typography variant="h6" className={classes.title}>
                Your Space
              </Typography>
              <div className={classes.demo}>
                { renderSpaceInfo }
              </div>
            </Grid>
            <Grid item>
              <Typography variant="h6" className={classes.title}>
                Files that you have uploaded.
              </Typography>
              <div className={classes.demo}>
                <List dense={false}>
                {
                    exception? 
                    <Alert severity="error">{`Exception while getting files: ${exception}`}</Alert> :
                    filesInfo.map(fileInfo =>
                      <DetailedFileListItem fileInfo={fileInfo} key={fileInfo.fileHash}></DetailedFileListItem>)
                }
                </List>
              </div>
            </Grid>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle id="form-dialog-title">Create Space</DialogTitle>
              <DialogContent style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
              }}>
                <TextField
                  id="volume"
                  label="Volume(kb)"
                  type="number"
                  value={volume}
                  onChange={onChange('volume')}
                />
                <TextField
                  id="copyNumber"
                  label="Copy Number"
                  type="number"
                  value={copyNumber}
                  onChange={onChange('copyNumber')}
                />
                <TextField
                  id="timeStart"
                  label="Start Time"
                  type="datetime-local"
                  value={timeStart}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={onChange('timeStart')}
                />
                <TextField
                  id="timeExpired"
                  label="Expire Time"
                  type="datetime-local"
                  value={timeExpired}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={onChange('timeExpired')}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={createSpace} color="primary">
                  Create
                </Button>
              </DialogActions>
            </Dialog>
        </Container>
    )
})