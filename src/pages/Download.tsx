import React, { useState } from "react"
import { Container, TextField, Button, Stepper, Step, StepLabel } from "@material-ui/core"
import { useStyles } from "../hooks/style";
const { TaskEntity } = require('ontfs-js-sdk');
const { newTaskDownload } = TaskEntity;

function getSteps() {
    return ['Find File Servers', 'Read Pledge', 'Blocks Downloading', 'Done'];
}

interface Props {

}

export const DownloadPage = React.memo((props: Props) => {
    const [fileHash, setFileHash] = useState<string | undefined>(undefined);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [step, setStep] = useState<number>(0);
    const classes = useStyles();

    function onChange(event: any) {
        setFileHash(event.target.value);
    }

    async function onDownload() {
        setIsDownloading(true);
        const datas: Uint8Array[] = []
        const receiveBlock = (data: any, length: number, position: any) => {
            console.log('receive data', data ? data.length : 0)
            datas.push(new Uint8Array(data, position, data.length))
            const blob = new Blob(datas)
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileHash!;
            link.click();
        }
        const option = {
            fileHash,
            inOrder: true,
            maxPeerCnt: 1,
            decryptPwd: '',
            receiveBlock,
            stepCallback: updateStep
        }
        const taskId = Math.random();
        try {
            const taskDownload = await newTaskDownload(taskId, option);
            await taskDownload.start();
            // client.api.fs!.
            
        } catch(e) {
            console.log(e)
        }
    }

    function updateStep(step: number) {
        setStep(step);
        if (step === 7 || step === 8) {
          setTimeout(function() {
            setIsDownloading(false);
            setStep(0);
          }, 3000)
        }
    }

    return (
        <Container maxWidth="sm" className={classes.flexColumn}>
              <TextField id="outlined-basic" label="File Hash" variant="outlined" value={fileHash} onChange={onChange}/>
              {
                  isDownloading? 
                  <Stepper activeStep={step}>
                    {getSteps().map((label, index) => {
                      return (
                        <Step key={label}>
                          <StepLabel>{label}</StepLabel>
                        </Step>
                      );
                    })}
                  </Stepper>:
                  <Button variant="contained" color="primary" onClick={onDownload} size='small'>
                      Download
                  </Button>
              }
        </Container>
    )
})