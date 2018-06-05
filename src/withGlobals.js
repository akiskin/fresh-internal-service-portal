import React from 'react';


const GlobalsContext = React.createContext();

export function withGlobals(Component) {
  return function WithGlobalsComponent(props) {
    return (
      <GlobalsContext.Consumer>
        {value => <Component {...props} requests={value.requests} dict={value.dict} />}
      </GlobalsContext.Consumer>
    );
  };
}

export default GlobalsContext