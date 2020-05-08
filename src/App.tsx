import React, { useState } from 'react';
import './App.css';
import { AppBar, Tabs, Tab, Container } from '@material-ui/core';
import { useStyles } from './hooks/style';
import { TabPanel } from './components/tabPanel';
import { MyFilesPage } from './pages/MyFiles';
import { DownloadPage } from './pages/Download';
import { UploadPage } from './pages/Upload';
const { Config, TaskManage, SDK } = require('ontfs-js-sdk');

const startSDK = async () => {
  // init config
  const sdkCfg = { gasPrice: 500, gasLimit: 400000, pdpVersion: 1 }
  Config.DaemonConfig = { fsRepoRoot: "./test/Fs", fsFileRoot: "./test/Download", fsType: 0 }
  // init global task manager
  TaskManage.initTaskManage()
  // init global sdk
  const s = await SDK.initSdk(sdkCfg)
  SDK.setGlobalSdk(s)
  await s.start()
}

startSDK();

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const classes = useStyles();
  const [value, setValue] = useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container className={classes.root} maxWidth="lg">
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs">
          <Tab label="My Files" {...a11yProps(0)} />
          <Tab label="Upload" {...a11yProps(1)} />
          <Tab label="Download" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <MyFilesPage></MyFilesPage>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <UploadPage></UploadPage>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DownloadPage></DownloadPage>
      </TabPanel>
    </Container>
  );
}

export default App;
