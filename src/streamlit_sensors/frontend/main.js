// The `Streamlit` object exists because our html file includes
// `streamlit-component-lib.js`.
// If you get an error about "Streamlit" not being defined, that
// means you're missing that file.

function sendValue(value) {
  Streamlit.setComponentValue(value)
}

/**
 * The component's render function. This will be called immediately after
 * the component is initially loaded, and then again every time the
 * component gets new data from Python.
 */
function onRender(event) {
  // Only run the render code the first time the component is loaded.
  if (!window.rendered) {
    // You most likely want to get the data passed in like this
    // const {input1, input2, input3} = event.detail.args
    const button = document.getElementById("button_id");
    button.addEventListener("click", updateButton);
    button.addEventListener("touchstart", updateButton);

    function updateButton() {

      // navigator.geolocation.getCurrentPosition((position) => {
      //   let latitude = position.coords.latitude;
      //   let longitude = position.coords.longitude;
      //   sendValue({latitude, longitude});
      // })
      
      requestDeviceOrientation()
      sendValue(handleOrientation(event))
        
      }

    window.rendered = true
  }
}

function handleOrientation(event) {
  let alpha = event.alpha
  let beta = event.beta
  let gamma = event.gamma

  console.log(alpha, beta, gamma)

  return {alpha, beta, gamma}
}



async function requestDeviceOrientation() {
  if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
    //iOS 13+ devices
    try {
      const permissionState = await DeviceOrientationEvent.requestPermission()
      if (permissionState === 'granted') {
        window.addEventListener('deviceorientation', handleOrientation)
      } else {
        alert('Permission was denied')
      }
    } catch (error) {
      alert(error)
    }
  } else if ('DeviceOrientationEvent' in window) {
    //non iOS 13+ devices
    console.log("not iOS");
    window.addEventListener('deviceorientation', handleOrientation)
  } else {
    //not supported
    alert('Not supported')
  }
}


// Render the component whenever python send a "render event"
Streamlit.events.addEventListener(Streamlit.RENDER_EVENT, onRender)
// Tell Streamlit that the component is ready to receive events
Streamlit.setComponentReady()
// Render with the correct height, if this is a fixed-height component
Streamlit.setFrameHeight(100)
