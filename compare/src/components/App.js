import React from 'react';
import styled from 'styled-components';
import Header from './ecosystems/Header';
import List from './ecosystems/List';
import ScrubberModal from './ecosystems/ScrubberModal';

const Wrapper = styled.section`
  padding: 0 30px;
`;

export default class App extends React.Component {
  render () {
    return (
      <>
        <Header />
        <Wrapper>
          <List />
        </Wrapper>
        <ScrubberModal />
      </>
    );
  }
}
