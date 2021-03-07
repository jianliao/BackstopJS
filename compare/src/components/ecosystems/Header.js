import React from 'react';
import styled from 'styled-components';
import Topbar from '../organisms/Topbar';
import Toolbar from '../organisms/Toolbar';
import { colors } from '../../styles';

const HeaderWrapper = styled.section`
  width: 100%;
  margin: 0 auto;
  padding: 15px 0;
  z-index: 999;
  box-sizing: border-box;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  background-color: ${colors.bodyColor}
`;

export default class Header extends React.Component {
  render () {
    return (
      <HeaderWrapper className="header">
        <Topbar />
        <Toolbar />
      </HeaderWrapper>
    );
  }
}
