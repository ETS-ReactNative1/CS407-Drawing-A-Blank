import React, {useRef, useState} from 'react';

function UserPath() {
  const [userPath, setUserPath] = useState();
  userPath = useRef();

  DrawUserPath = () => {};

  addPathPoint = () => {};

  return [DrawUserPath, addPathPoint];
}

// or make it a component
// then pass props
// control the props using...
