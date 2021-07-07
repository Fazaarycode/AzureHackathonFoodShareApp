import React from 'react';
const { forwardRef, useImperativeHandle } = React;

const ScanNearestCollector = forwardRef((props, ref) => {

    // The component instance will be extended
    // with whatever you return from the callback passed
    // as the second argument
    useImperativeHandle(ref, () => ({
      scanNearestCollectorToTheProducer() {
        console.log(props, 'FROM HOC')
      }
  
    }));
  
    return <></>;
  });

export default ScanNearestCollector;