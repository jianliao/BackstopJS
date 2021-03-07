import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { colors, fonts } from '../../styles';

const DetailsPanel = styled.div`
  background: transparent;
  display: ${props => (props.display ? 'block' : 'none')};
  padding: 10px;
  font-family: ${fonts.latoRegular};
  color: ${colors.secondaryText};
`;

const ErrorMsg = styled.p`
  word-wrap: break-word;
  font-family: monospace;
  background: rgb(251, 234, 234);
  padding: 2ex;
  color: brown;
  display: ${props => (props.display ? 'block' : 'none')};
`;

class ErrorMessages extends React.Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  render () {
    const backstopError = this.props.info.error;
    const engineError = this.props.info.engineErrorMsg;
    const display = !!engineError || !!backstopError;

    return (
      <DetailsPanel display={display ? 1 : 0}>
        <ErrorMsg display={engineError ? 1 : 0}>ENGINE ERROR: {engineError}</ErrorMsg>
        <ErrorMsg display={backstopError ? 1 : 0}>
          BACKSTOP ERROR: {backstopError}
        </ErrorMsg>
      </DetailsPanel>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.layoutSettings
  };
};

const ErrorMessagesContainer = connect(mapStateToProps)(ErrorMessages);

export default ErrorMessagesContainer;
