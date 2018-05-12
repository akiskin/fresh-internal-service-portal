import React from 'react';


const GlobalsContext = React.createContext();

export function withGlobals(Component) {
  return function WithGlobalsComponent(props) {
    return (
      <GlobalsContext.Consumer>
        {requests => <Component {...props} requests={requests} />}
      </GlobalsContext.Consumer>
    );
  };
}

export default GlobalsContext