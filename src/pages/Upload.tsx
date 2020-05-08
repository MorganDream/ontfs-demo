import React, { useState } from "react";
import { Container, Button, Typography, List, Dialog, DialogTitle, DialogContent,
  TextField, DialogActions, Checkbox, FormControlLabel, StepLabel, Stepper } from "@material-ui/core";
import { useStyles } from "../hooks/style";
import { FileUploadOption, DetailedFileUploadItem } from "./detailedFileUploadItem";
import { fileToArrayBuffer } from "../utils";
import Step from '@material-ui/core/Step';
const { TaskEntity } = require('ontfs-js-sdk');
const { newTaskUpload } = TaskEntity;

function getSteps() {
  return ['Analyze File Info', 'Get Pdp Hash Data', 'Invoke Contract Store Files',
          'PreTransfer Processing', 'Transfer Files', 'Wait for Pdp Record', 'Done'];
}

interface Props { }

export const UploadPage = React.memo(({}: Props) => {
    const classes = useStyles();
    const [fileUploadOptions, setFileUploadOptions] = useState<FileUploadOption[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const fileInputEle = React.createRef<any>();
    const [] = useState<Array<number | undefined>>([]);
    const [newFileUploadOption, setNewFileUploadOption] = useState<Partial<FileUploadOption>>({});
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadStep, setUploadStep] = useState<number>(0);
    const {
      fileDesc = 'test',
      storageType = 1,
      copyNum = 1,
      firstPdp = false,
      timeExpired = new Date('2020-12-12'),
      encPassword = ''
    } = newFileUploadOption;

    async function onUpload() {
      setIsUploading(true);
      for (let i = 0; i < fileUploadOptions.length; i ++) {
        const {
          file, fileDesc, storageType, copyNum, firstPdp, timeExpired, encPassword
        } = fileUploadOptions[i];
        const taskId = Math.random();
        const fileContent = await fileToArrayBuffer(file);
        const uploadTask = newTaskUpload(taskId, {
          filePath: '',
          fileContent,
          fileDesc,
          fileSize: file!.size,
          storageType: Number(storageType),
          copyNum: Number(copyNum),
          firstPdp: Boolean(firstPdp),
          timeExpired: Math.floor(timeExpired.getTime() / 1000),
          encPassword,
          stepCallback: updateStep
        });
        await uploadTask.start();
      }
    }

    function updateStep(step: number) {
      setUploadStep(step);
      if (step === 7 || step === 8) {
        setTimeout(function() {
          setIsUploading(false);
          setUploadStep(0);
        }, 3000)
      }
    }

    function onOpen() {
        setOpen(true);
    }

    function handleClose() {
        setOpen(false);
    }

    function handleAddFile() {
        const files: File[] = fileInputEle.current.files;
        if (files.length === 0) {
            throw new Error('You have not select a file yet.');
        }
        setFileUploadOptions([...fileUploadOptions, {
          ...{
            file: files[0],
            fileDesc: 'test',
            storageType: 1,
            copyNum: 1,
            firstPdp: false,
            timeStart: new Date(),
            timeExpired: new Date('2020-12-12'),
            encPassword: ''
          },
          ...newFileUploadOption
        }]);
        setOpen(false);
    }

    function onChange(propName: string) {
      return function(event: any) {
        setNewFileUploadOption({
          ...newFileUploadOption,
          ...{
            [propName]: propName === 'timeExpired'? new Date(event.target.value) : event.target.value
          }
        })
      }
    }

    function onFisrtPdpdChange(event: any) {
      setNewFileUploadOption({
        ...newFileUploadOption,
        ...{
          firstPdp: event.target.checked
        }
      })
    }

    return (
        <Container maxWidth="sm" className={classes.flexColumn}>
            <Typography variant="h6" className={classes.title}>
                Files that you want to upload.
            </Typography>
            <div>
              <List dense={false}>
              {
                  fileUploadOptions.map((option) =>
                    <DetailedFileUploadItem fileUploadOption={option}></DetailedFileUploadItem>)
              }
              </List>
              <Button variant="contained" color="primary" onClick={onOpen} size='small'>
                Add File
              </Button>
            </div>
            {
              isUploading? 
              <Stepper activeStep={uploadStep}>
                {getSteps().map((label) => {
                  return (
                    <Step key={label}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>:
              <Button variant="contained" color="primary" onClick={onUpload} size='small'>
               Upload
              </Button>
            }
            
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
              <DialogTitle>添加上传文件</DialogTitle>
              <DialogContent style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between'
              }}>
                <input
                  autoFocus
                  id="file"
                  type="file"
                  required
                  ref={fileInputEle}
                />
                <TextField
                  id="fileDesc"
                  label="File Description"
                  type="text"
                  value={fileDesc}
                  onChange={onChange('fileDesc')}
                />
                <TextField
                  id="storageType"
                  label="Storage Type"
                  type="number"
                  value={storageType}
                  onChange={onChange('storageType')}
                />
                <TextField
                  id="copyNum"
                  label="Copy Number"
                  type="number"
                  value={copyNum}
                  onChange={onChange('copyNum')}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="firstPdp"
                      checked={firstPdp}
                      onChange={onFisrtPdpdChange}
                      inputProps={{ 'aria-label': 'primary checkbox' }}
                      color="primary"
                    />
                  }
                  label="First Pdp"
                />
                <TextField
                  id="timeExpired"
                  label="Expire Time"
                  type="datetime-local"
                  value={timeExpired.toISOString().substring(0, 16)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={onChange('timeExpired')}
                />
                <TextField
                  id="encPassword"
                  label="Encryption Password"
                  type="password"
                  value={encPassword}
                  onChange={onChange('encPassword')}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleAddFile} color="primary">
                  Add
                </Button>
              </DialogActions>
            </Dialog>
        </Container>
    )
})