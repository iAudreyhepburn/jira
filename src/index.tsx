import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { DevTools, loadServer } from 'jira-dev-tool';
// import {loadDevTools,DevTools} from 'jira-dev-tool';
// 在jira-dev-tool后边引入，有相同样式，要覆盖上边的 
import 'antd/dist/antd.less';
import { AppProviders } from 'context';

loadServer(()=>ReactDOM.render(
  <React.StrictMode>
    <AppProviders>
      <DevTools/>
      <App />
    </AppProviders>
  </React.StrictMode>,
  document.getElementById('root')
))

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
