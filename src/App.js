import logo from './logo.svg';
import './App.css';
import { useLayoutEffect, useEffect, useState, useRef } from 'react';
import cardicon from './cardicon.png';
import Layer from './components/layer/layer';
import TextWorkFlow from './workflows/textWorkflow';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";


const exportCanvas = async (filename) => {
  var c = document.getElementById("canvas1");
    var img = new Image();
    img.src = c.toDataURL('image/png',1.0)
    var link = document.createElement("a");
    link.href = img.src;
    link.download = filename;
    await link.click();
}

const getPreviewOfSlide = () => {
  var c = document.getElementById("canvas1");
  return c.toDataURL('image/png',1.0)
}

const createElement = (id,type,x1,y1,x2,y2,data) => {
  console.log(data);
  return {id,type,x1,y1,x2,y2,data}
}


const EditPanel = ({element, elements, elementsHandler}) => {

  const [fillStyle, setFillStyle] = useColor("hex", element?.element.data.style.fillStyle ? element?.element.data.style.fillStyle : '');
  const [strokeStyle, setStrokeStyle] = useColor("hex", element?.element.data.style.strokeStyle ? element?.element.data.style.strokeStyle : '');
  const [shadowColor, setShadowColor] = useColor("hex", element?.element.data.style.shadowColor ? element?.element.data.style.shadowColor : '');
  const [inFocusColorPicker,setInFocusColorPicker] = useState(null)

  const changeElementStyle = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const formDataObj = {};

    for (const [key, value] of formData.entries()) {
      formDataObj[key] = value;
    }


    const elementsCopy = [...elements];
    const index = elementsCopy.findIndex(obj => obj.id === element.element.id);
    let data = {style:formDataObj}
    if (element.element.type == "img") {
      data = {
        obj:element.element.data.obj,
        width:element.element.data.width,
        height:element.element.data.height,
        ar:element.element.data.ar,
        style:formDataObj
      }
    }
    if (element.element.type == "text") {
      data = {
        text:element.element.data.text,
        style:{...element.element.data.style,...formDataObj}
      }
    }
    elementsCopy[index] = createElement(element.element.id,element.element.type, element.element.x1, element.element.y1, element.element.x2, element.element.y2,data);
    elementsHandler(elementsCopy)
  }

  const openColorPicker = (type) => {
    if (type == "fillStyle") {
      setInFocusColorPicker("fillStyle")
    } else if(type == "strokeStyle"){
      setInFocusColorPicker("strokeStyle")
    } else if(type == "shadowColor"){
      setInFocusColorPicker("shadowColor")
    } else {
      setInFocusColorPicker(null)
    }
  }

  const changeFontSize =  (e) => {
    document.getElementById('font_size').value = e.target.value
  }


  if(element?.element.type == "rectangle"){
    
    return (
      <div className="edit_panel_container">
        <form onSubmit={changeElementStyle}>
          <div>
            <label>Color</label>
            <input type="text" name='fillStyle' value={fillStyle.hex} onFocus={() => openColorPicker("fillStyle")} />
            <div className='color_picker_container'>
            {
              inFocusColorPicker == "fillStyle" && <ColorPicker width={456} height={228} 
                     color={fillStyle} 
                     onChange={setFillStyle} hideHSV dark />
            }
              
            </div>
          </div>
          <div>
            <label>Border Color</label>
            <input type="text" name='strokeStyle' value={strokeStyle.hex} onFocus={() => openColorPicker("strokeStyle")} />
            <div className='color_picker_container'>
            {
              inFocusColorPicker == "strokeStyle" && <ColorPicker width={456} height={228} 
                     color={strokeStyle} 
                     onChange={setStrokeStyle} hideHSV dark />
            }
              
            </div>
          </div>
          <div>
            <label>Border Thickness</label>
            <input type="number" name='lineWidth' defaultValue={element?.element.data.style.lineWidth} onFocus={() => setInFocusColorPicker(null)} />
          </div>
          <div>
            <label>Shadow Color</label>
            <input type="text" name='shadowColor' value={shadowColor.hex} onFocus={() => openColorPicker("shadowColor")} />
            <div className='color_picker_container'>
            {
              inFocusColorPicker == "shadowColor" && <ColorPicker width={456} height={228} 
                     color={shadowColor} 
                     onChange={setShadowColor} hideHSV dark />
            }
              
            </div>
          </div>
          <div>
            <label>Shadow Blur</label>
            <input type="number" name='shadowBlur' defaultValue={element?.element.data.style.shadowBlur} onFocus={() => setInFocusColorPicker(null)} />
          </div>
          <div>
            <label>Shadow Offset X</label>
            <input type="number" name='shadowOffsetX' defaultValue={element?.element.data.style.shadowOffsetX} onFocus={() => setInFocusColorPicker(null)} />
          </div>
          <div>
            <label>Shadow Offset Y</label>
            <input type="number" name='shadowOffsetY' defaultValue={element?.element.data.style.shadowOffsetY} onFocus={() => setInFocusColorPicker(null)} />
          </div>
          <div>
            <label>Opacity</label>
            <input type="text" name='globalAlpha' defaultValue={element?.element.data.style.globalAlpha} onFocus={() => setInFocusColorPicker(null)} />
          </div>
          <button type='submit'>Apply</button>
        </form>
      </div>
    )
  } else if(element?.element.type == "line"){
    return (
      <div className="edit_panel_container">
        <form onSubmit={changeElementStyle}>
          <div>
            <label>Line Color</label>
            <input type="text" name='strokeStyle' value={strokeStyle.hex} onFocus={() => openColorPicker("strokeStyle")} />
            <div className='color_picker_container'>
            {
              inFocusColorPicker == "strokeStyle" && <ColorPicker width={456} height={228} 
                     color={strokeStyle} 
                     onChange={setStrokeStyle} hideHSV dark />
            }
              
            </div>
          </div>
          <div>
            <label>Line Width</label>
            <input type="number" name='lineWidth' defaultValue={element?.element.data.style.lineWidth} onFocus={() => setInFocusColorPicker(null)} />
          </div>
          <div>
            <label>Opacity</label>
            <input type="text" name='globalAlpha' defaultValue={element?.element.data.style.globalAlpha} onFocus={() => setInFocusColorPicker(null)} />
          </div>
          <button type='submit'>Apply</button>
        </form>
      </div>
    )
  } else if(element?.element.type == "img"){
    return (
      <div className="edit_panel_container">
        <form onSubmit={changeElementStyle}>
          <div>
            <label>Shadow Color</label>
            <input type="text" name='shadowColor' defaultValue={element?.element.data.style.shadowColor} />
          </div>
          <div>
            <label>Shadow Blur</label>
            <input type="number" name='shadowBlur' defaultValue={element?.element.data.style.shadowBlur} />
          </div>
          <div>
            <label>Shadow Offset X</label>
            <input type="number" name='shadowOffsetX' defaultValue={element?.element.data.style.shadowOffsetX} />
          </div>
          <div>
            <label>Shadow Offset Y</label>
            <input type="number" name='shadowOffsetY' defaultValue={element?.element.data.style.shadowOffsetY} />
          </div>
          <div>
            <label>Opacity</label>
            <input type="text" name='globalAlpha' defaultValue={element?.element.data.style.globalAlpha} />
          </div>
          <button type='submit'>Apply</button>
        </form>
      </div>
    )
  } else if(element?.element.type == "text"){
    return (
      <div className="edit_panel_container">
        <form onSubmit={changeElementStyle}>
          <div>
            <label>Color</label>
            <input type="text" name='color' defaultValue={element?.element.data.style.color} />
          </div>
          <div className='font_edit_container'>
            <label htmlFor="">Font</label>
            <div className='font_edit_ib'><input type="checkbox" name='fontItalic' defchecked={element?.element.data.style.fontItalic}/>Italic</div>
            <div className='font_edit_ib'><input type="checkbox" name='fontBold' defchecked={element?.element.data.style.fontBold}/>Bold</div>
          </div>
          <div>
            <label>Font Style</label>
            <select name="fontStyle" id="">
              <option value={element?.element.data.style.fontStyle} selected>{element?.element.data.style.fontStyle}</option>
              <option value="Verdana">Verdana</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="serif">serif</option>
              <option value="sans-serif">sans-serif</option>
            </select>
          </div>
          <div>
            <label>Font Size</label>
            <input type="text" name='fontSize' id="font_size" defaultValue={element?.element.data.style.fontSize} />
            <select onChange={changeFontSize} id="font_size_select">
              <option value={element?.element.data.style.fontSize} selected>{element?.element.data.style.fontSize}</option>
              <option value="8px">8</option>
              <option value="10px">10</option>
              <option value="12px">12</option>
              <option value="14px">14</option>
              <option value="16px">16</option>
            </select>
          </div>
          <div>
            <label>Shadow Color</label>
            <input type="text" name='shadowColor' defaultValue={element?.element.data.style.shadowColor} />
          </div>
          <div>
            <label>Shadow Blur</label>
            <input type="number" name='shadowBlur' defaultValue={element?.element.data.style.shadowBlur} />
          </div>
          <div>
            <label>Shadow Offset X</label>
            <input type="number" name='shadowOffsetX' defaultValue={element?.element.data.style.shadowOffsetX} />
          </div>
          <div>
            <label>Shadow Offset Y</label>
            <input type="number" name='shadowOffsetY' defaultValue={element?.element.data.style.shadowOffsetY} />
          </div>
          <button type='submit'>Apply</button>
        </form>
      </div>
    )
  }
  return (
    <>
    </>
  )
}


const Slideshow = ({slideshow,setSlideShow,elements,setElements, history,setHistory, activeSlide, setActiveSlide}) => {

  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const addNewSlide = () => {

    // const bgElement = document.getElementById('canvas_wrapper');
    let newSlide = {
      id:slideshow.length + 1,
      elements:[],
      history:[],
      background: {
        // backgroundImage: bgElement.styles.backgroundImage,
        // backgroundPosition: bgElement.styles.backgroundPosition,
        // backgroundRepeat: bgElement.styles.backgroundRepeat,
        // backgroundSize: bgElement.styles.backgroundSize
      },
      preview:null,
      duration:5000
    }
    setSlideShow((prev) => {
      let newSlideShowArr = [...prev,newSlide]

      return newSlideShowArr
    })

    setElements([])
    setHistory([])
    setActiveSlide(newSlide.id)
    // bgElement.style.backgroundImage = ``;
    // bgElement.style.backgroundPosition = '';
    // bgElement.style.backgroundRepeat = '';
    // bgElement.style.backgroundSize = '';
  }

  const openSlide = (ins) => {
    setElements(ins.elements)
    setHistory(ins.history)
    setActiveSlide(ins.id)
  }


  const deleteSlide = (ins) => {

    let slideshowCopy = [...slideshow]
    let slideToShow = -1

    for (let i = 0; i < slideshowCopy.length; i++) {
      if(slideshowCopy[i].id == ins.id) {
        if(i == 0 && slideshowCopy.length > 1) {
          slideToShow = 0
        } else if(i == 0 && slideshowCopy.length == 1) {
          slideToShow = -1
        } else {
          slideToShow = i
        }
        slideshowCopy.splice(i,1)
      }
    }

    for (let i = 1; i <= slideshowCopy.length; i++) {
      slideshowCopy[i-1].id = i
    }

    setSlideShow(slideshowCopy)

    if(slideToShow == -1) {
      setElements([{
        id:1,
        elements:[],
        history:[],
        background: {}
      }])
      setActiveSlide(1)
      setHistory([])
    } else {
      setElements(slideshowCopy[slideToShow-1].elements)
      setHistory(slideshowCopy[slideToShow-1].history)
      setActiveSlide(slideshowCopy[slideToShow-1].id)
    }

    
  }

  const captureFrame = (stream) => {
    const canvas = document.getElementById("canvas1")
    const track = stream.getVideoTracks()[0];
    const imageCapture = new ImageCapture(track);
    try {
      imageCapture.grabFrame().then((imageBitmap) => {
        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d');
  
        offscreenCanvas.width = canvas.width;
        offscreenCanvas.height = canvas.height;
        offscreenCtx.drawImage(imageBitmap, 0, 0);
  
        offscreenCanvas.toBlob((blob) => {
          chunksRef.current.push(blob);
        }, 'image/png');
      });
    } catch (error) {
      return
    }
    
  };

  const handleDataAvailable = (event) => {
    if (event.data && event.data.size > 0) {
      chunksRef.current.push(event.data);
    }
  };

  

  const Preview = async () => {
    const canvas = document.getElementById("canvas1")
    const ctx1 = canvas.getContext('2d')
    ctx1.clearRect(0,0,canvas.width,canvas.height)
    ctx1.fillStyle="#fff"
    ctx1.fillRect(0,0,canvas.width,canvas.height)

    const canvas1Stream = canvas.captureStream();
    mediaRecorderRef.current = new MediaRecorder(canvas1Stream);
    mediaRecorderRef.current.ondataavailable = handleDataAvailable;
    mediaRecorderRef.current.start();

    const animationInterval = setInterval(() => {
      console.log("Capturing Frame");
      captureFrame(canvas1Stream);
    }, 100);

    let d = 0
    for (let i = 0; i < slideshow.length; i++) {
      const slide = slideshow[i];
      console.log("hey");
      d = d + slide.duration
      await setTimeout(async () => {
        console.log("Inside Timeout");
         await setElements(slide.elements)
      },d)
    }

    d = d + 5000

    setTimeout(async () => {
      console.log(chunksRef.current);
      clearInterval(animationInterval);
      const combinedBlob = new Blob(chunksRef.current, { type: 'video/mp4' });
      const videoUrl = URL.createObjectURL(combinedBlob);
      var link = document.createElement("a");
      link.href = videoUrl;
      link.download = "abc.mp4";
      await link.click();
    },d)

    
    
  }


  console.log(slideshow);

  return (
    <div className="slideshow_container">
      {slideshow.map((ins) => {
        return (
          <>
          <div className="slide" onClick={() => openSlide(ins)}>
            <img src={ins.preview} alt="" />
          </div>
          <span>Duration: <input type="text" name="" id="" defaultValue={ins.duration} /></span>
          <br />
          <br />
          </>
        )
      })}
      <button onClick={addNewSlide}>Add Slide</button>
      <button onClick={Preview}>Preview</button>
    </div>
  )
}


function App() {
  const [elementType,setElementType] = useState(null)
  const [actionType,setActionType] = useState(null)
  const [elements,setElements] = useState([])
  const [history,setHistory] = useState([])
  const [drawing,setDrawing] = useState(false)
  const [selectedElement,setSelectedElement] = useState(null)
  const [resizeElement,setResizeElement] = useState(null)
  const [ctx,setctx] = useState(null)
  const [searchResult,setSearchResult] = useState([])
  const canvasRef = useRef()
  const textAreaRef = useRef();
  const [animationStartTime,setAnimationStartTime] = useState(null)
  const [animationTimeline, setAnimationTimeline] = useState([])
  const [animationFrame,setAnimationFrame] = useState([])

  const [slideshow, setSlideShow] = useState([{
    id:1,
    elements:[],
    history:[],
    background: {},
    preview:null,
    duration:0
  }])

  const [activeSlide, setActiveSlide] = useState(1)

  const setBackground = (img) => {
    const element = document.getElementById('canvas_wrapper');
    element.style.backgroundImage = `url('${img}')`;
    element.style.backgroundPosition = 'center';
    element.style.backgroundRepeat = 'no-repeat';
    element.style.backgroundSize = 'cover';
  }
  const setBackgroundPosition = (pos) => {
    const element = document.getElementById('canvas_wrapper');
    element.style.backgroundPosition = pos;
  }
  const setBackgroundSize = (pos) => {
    const element = document.getElementById('canvas_wrapper');
    element.style.backgroundSize = pos;
  }

  const searchUnsplashImages = async (e) => {
    e.preventDefault()
    console.log(e.target.search.value)
    let accessKey = 'dqSeyQ2g_HMdOVHAPGVKtCnS2YcgKejOAAlrJ2JXkJM'
    const url = `https://api.unsplash.com/search/photos?query=${e.target.search.value}&client_id=${accessKey}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data.results);
      setSearchResult(data.results)
    } catch (error) {
      console.error(error);
    }
  }

  const getDefaultStyleForText = (type) => {
    if (type == 1 || type == 4) {
      return {
        color:"black",
        fontStyle:"Arial",
        fontSize:"24px",
        fontBold: false,
        fontItalic: false,
        textAlign: "left",
        letterSpacing:0,
        lineHeight: 32,
        opacity:1,
        lineWidth:0,
        strokeStyle:"",
        shadowColor: "",
        shadowBlur: 0,
        shadowOffsetX:0,
        shadowOffsetY:0,
      }
    } else if(type == 2) {
      return {
        color:"black",
        fontStyle:"Arial",
        fontSize:"48px",
        fontBold: true,
        fontItalic: false,
        textAlign: "center",
        letterSpacing:0,
        lineHeight: 60,
        opacity:1,
        lineWidth:0,
        strokeStyle:"",
        shadowColor: "",
        shadowBlur: 0,
        shadowOffsetX:0,
        shadowOffsetY:0,
      }
    } else if(type == 3) {
      return {
        color:"black",
        fontStyle:"Arial",
        fontSize:"24px",
        fontBold: true,
        fontItalic: false,
        textAlign: "center",
        letterSpacing:0,
        lineHeight: 36,
        opacity:1,
        lineWidth:0,
        strokeStyle:"",
        shadowColor: "",
        shadowBlur: 0,
        shadowOffsetX:0,
        shadowOffsetY:0,
      }
    } 
  }

  const createHistory = () => {
    console.log("New set");
    console.log(elements);
    let new_arr = history
    new_arr.push(elements)
    setHistory(new_arr)
  }

  // const getDraggedCorner = (element,x,y) => {
  //
  // }
  //
  // const getBoundingBox = () => {
  //
  // }
  //
  // const getResizePoints = () => {
  //
  // }

  const getCoordinates = (element) => {
    switch (element.type) {
      case "img":
      case "rectangle":
        let minX = Math.min(element.x1,element.x2)
        let maxX = Math.max(element.x1,element.x2)
        let minY = Math.min(element.y1,element.y2)
        let maxY = Math.max(element.y1,element.y2)
        return {
          x1:element.x1,
          x2:element.x2,
          y1:element.y1,
          y2:element.y2
        };
        break;
      case "line":
        return {
          x1:element.x1,
          x2:element.x2,
          y1:element.y1,
          y2:element.y2
        }
        break;
      default:

    }
  }

  const isResizing = (x,y) => {
    for (var i = 0; i < elements.length; i++) {
      let element  = elements[i]
      let coordinates = getCoordinates(element)
      console.log(coordinates);
      switch (element.type) {
        case "line":
          if (x >= coordinates.x1 - 10 && x <= coordinates.x1 + 10 && y >= coordinates.y1 - 10 && y <= coordinates.y1 + 10) {
            return {
              element:element,
              point:"tl",
              initial:{
                x:x,
                y:y
              }
            }
          } else if (x >= coordinates.x2 - 10 && x <= coordinates.x2 + 10 && y >= coordinates.y2 - 10 && y <= coordinates.y2 + 10) {
            return {
              element:element,
              point:"tr",
              initial:{
                x:x,
                y:y
              }
            }
          }
          break;
        case "img":
        case "rectangle":
          if (x >= coordinates.x1 - 10 && x <= coordinates.x1 + 10 && y >= coordinates.y1 - 10 && y <= coordinates.y1 + 10) {
            return {
              element:element,
              point:"tl",
              initial:{
                x:x,
                y:y
              }
            }
          } else if (x >= coordinates.x2 - 10 && x <= coordinates.x2 + 10 && y >= coordinates.y1 - 10 && y <= coordinates.y1 + 10) {
            return {
              element:element,
              point:"tr",
              initial:{
                x:x,
                y:y
              }
            }
          } else if (x >= coordinates.x1 - 10 && x <= coordinates.x1 + 10 && y >= coordinates.y2 - 10 && y <= coordinates.y2 + 10) {
            return {
              element:element,
              point:"bl",
              initial:{
                x:x,
                y:y
              }
            }
          } else if (x >= coordinates.x2 - 10 && x <= coordinates.x2 + 10 && y >= coordinates.y2 - 10 && y <= coordinates.y2 + 10) {
            return {
              element:element,
              point:"br",
              initial:{
                x:x,
                y:y
              }
            }
          }
          break;

        default:
          continue

      }
    }
    return {
      element:null
    }
  }

  const distance = (a, b) => Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));

  const updateResizeElemet = (element,diff,from) => {
    const {id, x1, y1, x2, y2, type,data} = element
    const elementsCopy = [...elements];
    const index = elementsCopy.findIndex(obj => obj.id === id);
    let newX1 = x1
    let newY1 = y1
    let newX2 = x2
    let newY2 = y2
    switch (type) {
      case "line":
        if (from == "tl") {
          newX1 += diff.x
          newY1 += diff.y
        } else if (from == "tr") {
          newX2 += diff.x
          newY2 += diff.y
        }
        elementsCopy[index] = createElement(id,type, newX1, newY1, newX2, newY2,data);
        break;
      case "rectangle":
        if (from == "tl") {
          newX1 += diff.x
          newY1 += diff.y
        } else if (from == "tr") {
          newX2 += diff.x
          newY1 += diff.y
        }
        else if (from == "bl") {
          newX1 += diff.x
          newY2 += diff.y
        } else if (from == "br") {
          newX2 += diff.x
          newY2 += diff.y
        }
        elementsCopy[index] = createElement(id,type, newX1, newY1, newX2, newY2,data);
        break;
      case "img":
        console.log("here")
        if (from == "tl") {
          element.data.width -= diff.x/50
          element.data.height = element.data.width * element.data.ar
          newX1 = x2 - element.data.width
          newY1 = y2 - element.data.height
        } else if (from == "tr") {
          element.data.width += diff.x/50
          element.data.height = element.data.width * element.data.ar
          newY1 = y2 - element.data.height
          newX2 = element.data.width + newX1
          newY2 = element.data.height + newY1
        }
        else if (from == "bl") {
          element.data.width -= diff.x/50
          element.data.height = element.data.width * element.data.ar
          newX1 = x2 - element.data.width
          newX2 = element.data.width + newX1
          newY2 = element.data.height + newY1
        } else if (from == "br") {
          element.data.width += diff.x/50
          element.data.height = element.data.width * element.data.ar
          newX2 = element.data.width + newX1
          newY2 = element.data.height + newY1
        }
        elementsCopy[index] = createElement(id,type, newX1, newY1, newX2, newY2,element.data);
        break;
      // case "pencil":
      //   elementsCopy[id].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
      //   break;
      // case "text":
      //   const textWidth = document
      //     .getElementById("canvas")
      //     .getContext("2d")
      //     .measureText(options.text).width;
      //   const textHeight = 24;
      //   elementsCopy[id] = {
      //     ...createElement(id, x1, y1, x1 + textWidth, y1 + textHeight, type),
      //     text: options.text,
      //   };
      //   break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    console.log(elementsCopy);
    setElements(elementsCopy);
  }

  const updateMovingElement = (element,drag,aspect="add") => {
    const {id, x1, y1, x2, y2, type, data} = element
    const elementsCopy = [...elements];
    const index = elementsCopy.findIndex(obj => obj.id === id);
    let newX1 = 0
    let newY1 = 0
    let newX2 = 0
    let newY2 = 0
    console.log(elementsCopy);
    switch (type) {
      case "line":
      case "rectangle":
        newX1 = x1 + drag.x
        newY1 = y1 + drag.y
        newX2 = newX1 + x2-x1
        newY2 = newY1 + y2-y1
        elementsCopy[index] = createElement(id,type, newX1, newY1, newX2, newY2,data );
        break;
      case "img":
        console.log("here")
        newX1 = x1 + drag.x
        newY1 = y1 + drag.y
        newX2 = x2 + drag.x
        newY2 = y2 + drag.y
        elementsCopy[index] = createElement(id,type, newX1, newY1, newX2, newY2,element.data);
        break;
      case "pencil":
        elementsCopy[index].points = [...elementsCopy[id].points, { x: x2, y: y2 }];
        break;
      case "text":
        const textWidth = document
          .getElementById("canvas1")
          .getContext("2d")
          .measureText(element.data.text).width;
        const textHeight = element.data.style.lineHeight;
        elementsCopy[index] = {
          ...createElement(id,type, x1+drag.x, y1+drag.y, x1+drag.x + textWidth, y1+drag.y + textHeight,element.data)
        };
        break;
      default:
        throw new Error(`Type not recognised: ${type}`);
    }
    if (aspect == "add") {
      console.log(elementsCopy);
      setElements(elementsCopy); 
    }
  };

  const updateTextElement = (id, x1, y1, x2, y2, type,options) => {
    const elementsCopy = [...elements];
    const index = elementsCopy.findIndex(obj => obj.id === id);
    const textWidth = document
      .getElementById("canvas1")
      .getContext("2d")
      .measureText(options.text).width;
    const textHeight = options.style.lineHeight;
    console.log(textHeight);
    elementsCopy[index] = {
      ...createElement(id, type,x1, y1, x1 + textWidth, y1 + textHeight,{text: options.text, style:options.style})
    };
    setElements(elementsCopy);
    createHistory()
  };

  const onChangeInputImageHandler = (e) =>{
    let fileInput = document.getElementById("upload_image_input");
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function() {
      var img = new Image();
      img.src = reader.result;
      console.log(img);
      img.onload = function(){
        // Get the original width and height of the image
        const originalWidth = img.width;
        const originalHeight = img.height;

        // Calculate the new width and height of the image, keeping the aspect ratio
        let newWidth = originalWidth;
        let newHeight = originalHeight;

        if (newWidth > 300) {
          newWidth = 300;
          newHeight = (newWidth / originalWidth) * originalHeight;
        }

        let defaultStyle = {
          strokeStyle:"",
          lineWidth:0,
          shadowColor: "",
          shadowBlur: 0,
          shadowOffsetX:0,
          shadowOffsetY:0,
          globalAlpha:1
        }

        let ele = createElement(elements.length,"img",60,60,newWidth+60,newHeight+60,{obj:img,width:newWidth,height:newHeight,ar:originalHeight/originalWidth,style:defaultStyle})
        setElements((prev) => {
          return [...prev,ele]
        })
        let new_ele_arr = [...elements, ele]
        let new_arr = history
        new_arr.push(new_ele_arr)
        setHistory(new_arr)
      }
    }
  }


  const drawElement = (type,x1,y1,x2,y2,data) => {
    
    if (type == "line") {
      //Creating a line
      for (const property in data.style) {
        ctx[property] = data.style[property]
      }
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath()
    } else if (type == "rectangle") {
      // Creating a rectangle
      for (const property in data.style) {
        ctx[property] = data.style[property]
      }
      if (data.style.lineWidth > 0) {
        ctx.strokeRect(x1,y1,x2-x1,y2-y1)
      }
      ctx.fillRect(x1,y1,x2-x1,y2-y1)
    }else if (type == "stroke-line") {
      // Creating a select line
      ctx.beginPath();
      ctx.strokeStyle="#ACCEF7"
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.closePath()
    } else if (type == "stroke-rectangle") {
      // Creating a stroke rectangle
      ctx.strokeStyle="#ACCEF7"
      ctx.strokeRect(x1,y1,x2-x1,y2-y1)
    } else if (type == "circle") {
      //Creating a circle
      let radius = Math.sqrt(Math.pow(x2-x1,2) + Math.pow(y2-y1,2))
      ctx.beginPath();
      ctx.strokeStyle="#000"
      ctx.arc(x1, y1, radius,0, Math.PI * 2, true);
      ctx.stroke()
      ctx.closePath()
    } else if (type == "img") {
      for (const property in data.style) {
        ctx[property] = data.style[property]
      }
      ctx.drawImage(data.obj, x1, y1,data.width,data.height);
      if (data.style.lineWidth > 0) {
        ctx.strokeRect(x1, y1,data.width,data.height)
      }
    } else if (type == "text") {
      console.log("here");
      ctx.textBaseline = "top";
      for (const property in data.style) {
        ctx[property] = data.style[property]
      }
      if (data?.text) {
        console.log(type,x1,y1,x2,y2,data);
        ctx.direction = "ltr";
        ctx.fillStyle=data.style.color
        console.log(data.style.fontBold);
        ctx.font = `${data.style.fontItalic ? "italic " : ''}${data.style.fontBold ? "bold " : ''}${data.style.fontSize} ${data.style.fontStyle}`
        ctx.textAlign= data.style.textAlign
        ctx.letterSpacing=data.style.letterSpacing
        ctx.lineHeight= data.style.lineHeight
        ctx.globalAlpha = 1
        ctx.fillText(data.text,x1,y1);
      }

    }
  }


  const getElementAtPosition = (x,y) => {
    let isElement = false
    let boundingBox = null
    for (var i = 0; i < elements.length; i++) {
      let element = elements[elements.length - i - 1]
      if (element.type == "rectangle" || element.type == "img") {
        let minX = Math.min(element.x1,element.x2)
        let maxX = Math.max(element.x1,element.x2)
        let minY = Math.min(element.y1,element.y2)
        let maxY = Math.max(element.y1,element.y2)
        isElement= x >= minX && x<=maxX && y>= minY && y<=maxY
        boundingBox = {
          type:"stroke-rectangle",
          x1:minX,
          x2:maxX,
          y1:minY,
          y2:maxY
        }

      } else if (element.type == "line") {
        const a = { x: element.x1, y: element.y1 };
        const b = { x: element.x2, y: element.y2 };
        const c = { x, y };
        let offset = distance(a, b) - (distance(a, c) + distance(b, c))
        isElement = Math.abs(offset) < 1
        boundingBox = {
          type:"stroke-line",
          x1:element.x1,
          x2:element.x2,
          y1:element.y1,
          y2:element.y2
        }
      } else if (element.type == "circle") {
        continue
      } else if (element.type == "text") {
        console.log("Checking Text")
        let minX = Math.min(element.x1,element.x2)
        let maxX = Math.max(element.x1,element.x2)
        let minY = Math.min(element.y1,element.y2)
        let maxY = Math.max(element.y1,element.y2)
        console.log(element);
        console.log(element.x1,element.y1,element.x2,element.y2);
        console.log(minX,maxX,minX,maxY);
        console.log(x,y);
        isElement= x >= minX && x <=maxX && y >= minY && y <=maxY
        console.log(isElement);
      }
      if(isElement) {
        return {
          isElement: isElement,
          boundingBox:boundingBox,
          element:element
        }
      }
    }
    return {
      isElement: isElement,
      boundingBox:boundingBox,
    }
  }

  const handleMouseDown = (e) => {
    const {clientX,clientY} = e
    if (actionType === "writing") return;
    if (elementType == "text") {
      let ele = createElement(
        elements.length,
        elementType,
        clientX - canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
        clientX,
        clientY,
        {
          text:'',
          style:getDefaultStyleForText(1)
        },
      )
      setElements((prev) => {
        return [...prev,ele]
      })
      setSelectedElement({
        element:{...ele}
      });
      setActionType("writing");
    } else if (elementType == "img") {
      return
    } else if (elementType == "select") {
      let isResize = isResizing(clientX -  canvasRef.current.offsetLeft,clientY - canvasRef.current.offsetTop)
      console.log(clientX -  canvasRef.current.offsetLeft,clientY - canvasRef.current.offsetTop)
      if (isResize.element) {
        setActionType("resize")
        setResizeElement(isResize)
        if (isResize.element.type == "line") {
          document.body.style.cursor = 'default';
        } else if (isResize.point == "tr") {
          document.body.style.cursor = 'ne-resize';
        } else if (isResize.point == "tl") {
          document.body.style.cursor = 'nw-resize';
        } else if (isResize.point == "bl") {
          document.body.style.cursor = 'sw-resize';
        } else if (isResize.point == "br") {
          document.body.style.cursor = 'se-resize';
        }
        return
      }
      setActionType("moving")
      const {isElement,boundingBox,element} = getElementAtPosition(
        clientX -  canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
      )
      console.log(elements);
      console.log(isElement);
      if (isElement) {
        document.body.style.cursor = 'move';
        let offsetX = clientX -  canvasRef.current.offsetLeft
        let offsetY = clientY - canvasRef.current.offsetTop
        setSelectedElement({
          element:{...element,offsetX,offsetY},
          boundingBox:boundingBox
        })
        console.log(selectedElement);
      } else {
        setSelectedElement(null)
      }
    } else {
      setSelectedElement(null)
      setDrawing(true)
      let ele = createElement(
        elements.length,
        elementType,
        clientX -  canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
        clientX -  canvasRef.current.offsetLeft,
        clientY - canvasRef.current.offsetTop,
        {
          style:{
            fillStyle:"#F5F5F5",
            strokeStyle:"#000",
            lineWidth:0,
            shadowColor: "",
            shadowBlur: 0,
            shadowOffsetX:0,
            shadowOffsetY:0,
            globalAlpha:1
          }
        },
      )
      setElements((prev) => {
        return [...prev,ele]
      })
    }
  }

  const handleMouseUp = (e) => {
    if (selectedElement) {
      console.log(selectedElement);
      console.log("Text Mouse Up");
      if (selectedElement.type === "text") {
        setActionType("writing");
        return;
      }
    }
    if(elementType == "select" && selectedElement && actionType == "moving") {
      createHistory()
    }
    if (elementType == "select" && resizeElement && actionType == "resize") {
      createHistory()
    }
    if (drawing) {
      createHistory()
    }
    if (actionType === "writing") return;
    setDrawing(false)
    setActionType(null)
    document.body.style.cursor = 'default';
  }

  const handleMouseMove = (e) => {
    const {clientX,clientY} = e
    if(elementType == "select" && selectedElement && actionType == "moving") {
      const {id,x1,y1,x2,y2,type,offsetX,offsetY} = selectedElement.element
      //Offset X and Y is basically the inital X and Y
      let drag = {
        x:clientX - canvasRef.current.offsetLeft - offsetX,
        y:clientY - canvasRef.current.offsetTop - offsetY
      }
      updateMovingElement(selectedElement.element,drag)
    } else if (elementType == "select" && resizeElement && actionType == "resize") {
      console.log("resizing ", resizeElement);
      let xDiff = clientX - canvasRef.current.offsetLeft - resizeElement.initial.x
      let yDiff = clientY - canvasRef.current.offsetTop - resizeElement.initial.y
      updateResizeElemet(resizeElement.element,{x:xDiff,y:yDiff},resizeElement.point)
    } else if(!drawing) {
      return
    } else {
      let {id,type,x1,y1,x2,y2,data} = elements[elements.length -1]
      let ele = createElement(id,type,x1,y1,clientX - canvasRef.current.offsetLeft,clientY - canvasRef.current.offsetTop,data)

      let eleCopy = [...elements]
      eleCopy[elements.length -1] = ele
      setElements(eleCopy)
    }

  }

  const handleBlur = event => {
    const { id, x1, y1, type , data } = selectedElement.element;
    console.log(x1,y1)
    setActionType(null);
    setSelectedElement(null);
    updateTextElement(id, x1, y1, null, null, type, { text: textAreaRef.current.value, style:data.style });
    setElementType('select')
  };

  const undo = () => {
    console.log("History");
    console.log(history);
    let last = []
    if (history.length > 0) {
      last = history.pop()
    }
    setElements(last)
  }

  const deleteSelected = () => {
    if (selectedElement) {
      let idToDelete = selectedElement.element.id
      let new_arr = elements.filter(item => item.id !== idToDelete);
      setElements(new_arr)
    }
  }

  const handleKeyPress = (event) => {
    console.log(event);
    if (event.keyCode === 90 && event.ctrlKey) {
      // Handle control Z keydown event
      undo();
    } else if (event.keyCode === 46) {
      // Handle delete keydown event
      deleteSelected();
    }
  }

  const generateFrame = (currentTime,start) => {
    animationTimeline.push({
      element:elements[0],
      to:{
        x1:0,
        y1:0
      },
      duration:2000,
      delay:0
    })
    const elementsCopy = [...elements];
    for (let i = 0; i < animationTimeline.length; i++) {
      const element = animationTimeline[i].element;
      let progress = (currentTime - start)/animationTimeline[i].duration
      if (progress <= 1) {
        console.log("Progress",progress);
        element.x1 = (element.x1 - animationTimeline[i].to.x1)*progress
        element.y1 = (element.y1 - animationTimeline[i].to.y1)*progress
        const index = elementsCopy.findIndex(obj => obj.id === element.id);
        elementsCopy[index] = element
        setAnimationFrame(elementsCopy)
      }
    }
  }

  const animate = (start) => {
    let currentTime = new Date()
    generateFrame(currentTime,start)
    requestAnimationFrame(animate(start));
  }

  const StartAnimation = () => {
    let start = new Date()
    requestAnimationFrame(animate(start));
  }


  const updateSlide = (activeSlide) => {
    let slideshowCopy = [...slideshow]
    for (let i = 0; i < slideshowCopy.length; i++) {
      const slide = slideshowCopy[i];
      if(slide.id == activeSlide) {
        slideshowCopy[i].elements = elements
        slideshowCopy[i].history = history
        slideshowCopy[i].preview = getPreviewOfSlide(elements)
        setSlideShow(slideshowCopy)
        break
      }
    }
  }

  const exportSlideshow = async () => {
    for (let i = 0; i < slideshow.length; i++) {
      const slide = slideshow[i];
      await setElements(slide.elements)
      await exportCanvas(`slide_${i+1}.png`)
    }
  }

  const Preview = () => {
    console.log("hey");
  }

  useEffect(() => {
    console.log(elements);
    const canvas = document.getElementById("canvas1")
    const ctx1 = canvas.getContext('2d')
    setctx(ctx1)
    ctx1.clearRect(0,0,canvas.width,canvas.height)
    ctx1.fillStyle="#fff"
    ctx1.fillRect(0,0,canvas.width,canvas.height)
    elements.forEach(element => {
      drawElement(element.type, element.x1,element.y1,element.x2,element.y2,element.data)
    });
    // if (selectedElement) {
    //   drawElement(selectedElement.boundingBox.type, selectedElement.boundingBox.x1,selectedElement.boundingBox.y1,selectedElement.boundingBox.x2,selectedElement.boundingBox.y2,{})
    // }
  }, [elements])

  // useEffect(() => {
  //   console.log(elements);
  //   const canvas = document.getElementById("canvas1")
  //   const ctx1 = canvas.getContext('2d')
  //   setctx(ctx1)
  //   ctx1.clearRect(0,0,canvas.width,canvas.height)
  //   animationFrame.forEach(element => {
  //     drawElement(element.type, element.x1,element.y1,element.x2,element.y2,element.data)
  //   });
  //   // if (selectedElement) {
  //   //   drawElement(selectedElement.boundingBox.type, selectedElement.boundingBox.x1,selectedElement.boundingBox.y1,selectedElement.boundingBox.x2,selectedElement.boundingBox.y2,{})
  //   // }
  // }, [animationFrame])


  return (
    <div className="App">
      <div className='canvas_wrapper' id="canvas_wrapper">
      <canvas
        id='canvas1'
        width="700"
        height="700"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        tabIndex={0}
        onKeyDown={handleKeyPress}
        ref={canvasRef}
      >
        This is main Canvas
      </canvas>
      </div>
      
      {elementType == 'background'? (
        <>
          <div className='tool_settings'>
            <h4>Choose background</h4>
            <form action="" onSubmit={searchUnsplashImages}>
              <div className='form_cntainer'>
                <input type="text" name="search" placeholder='Search Background' required/>
                <button type='submit'>Search</button>
              </div>
              <span>Or</span>
              <label htmlFor="choose_bgimg">Choose Image</label>
              <input type="file" id="choose_bgimg" />
            </form>
            <div className='tool_settings_gallery'>
              {
                searchResult.map((ins) => {
                  return (
                    <div className='tool_settings_gallery_img' onClick={() => setBackground(ins.urls.regular)}>
                      <img src={ins.urls.small} alt="" />
                    </div>
                  )
                })
              }
              
            </div>
            <div className='tool_properties'>
              <h4>Position</h4>
              <span onClick={() => setBackgroundPosition('top left')}>Top left</span>
              <span onClick={() => setBackgroundPosition('top right')}>Top Right</span>
              <span onClick={() => setBackgroundPosition('bottom left')}>Bottom left</span>
              <span onClick={() => setBackgroundPosition('bottom right')}>Bottom Right</span>
              <span onClick={() => setBackgroundPosition('center')}>Center</span>
              <br />
              <h4>Size</h4>
              <span onClick={() => setBackgroundSize('auto')}>Auto</span>
              <span onClick={() => setBackgroundSize('cover')}>Cover</span>
              <span onClick={() => setBackgroundSize('contain')}>Contain</span>
            </div>
          </div>
        </>
      ):null}
      {actionType === "writing" ? (
        <textarea
          ref={textAreaRef}
          onBlur={handleBlur}
          style={{
            position: "fixed",
            top: selectedElement.element.y1 + canvasRef.current.offsetTop,
            left: selectedElement.element.x1 + canvasRef.current.offsetLeft,
            font: "24px sans-serif",
            margin: 0,
            padding: 0,
            outline: 0,
            resize: "auto",
            overflow: "hidden",
            whiteSpace: "pre",
            background: "transparent",
            width:"auto",
            height:"auto"
          }}
        />
      ) : null}
      <div className="toolbar">
        <div className="toolbar_card" onClick={() => setElementType('text')}>
          <img src={cardicon} />
          <span>Text</span>
        </div>
        <div className="toolbar_card" onClick={() => setElementType('img')}>
          <img src={cardicon} />
          <label for="upload_image_input">Image</label>
          <input type="file" id="upload_image_input" onChange={onChangeInputImageHandler} />
        </div>
        <div className="toolbar_card" onClick={() => setElementType('line')}>
          <img src={cardicon} />
          <span>Line</span>
        </div>
        <div className="toolbar_card" onClick={() => setElementType('rectangle')}>
          <img src={cardicon} />
          <span>Rectangle</span>
        </div>
        <div className="toolbar_card" onClick={() => setElementType('circle')}>
          <img src={cardicon} />
          <span>Circle</span>
        </div>
        <div className="toolbar_card" onClick={() => setElementType('select')}>
          <img src={cardicon} />
          <span>Select</span>
        </div>
        <div className="toolbar_card" onClick={() => setElementType('background')}>
          <img src={cardicon} />
          <span>Background</span>
        </div>
        <div className="toolbar_card" onClick={() => {
          updateSlide(activeSlide)
          setSelectedElement(null)
          setElementType('slideshow')
        }}>
          <img src={cardicon} />
          <span>Slideshow</span>
        </div>
      </div>
      <div className='export_options'>
        <button onClick={() => exportCanvas('yourstory.png')}>Export</button>
        <button onClick={exportSlideshow}>Export Slideshow</button>
      </div>

      <Layer data={elements} dataHandler={setElements} />
      <TextWorkFlow  elements={elements} selectelementHandler={setSelectedElement} createElement={createElement} actionhandler={setActionType} elementsHandler={setElements} stage={2} />
      <EditPanel element={selectedElement} elements={elements} elementsHandler={setElements} />
      {
        elementType == "slideshow"? <Slideshow
          slideshow={slideshow}
          setSlideShow={setSlideShow}
          elements={elements}
          setElements={setElements}
          history={history}
          setHistory={setHistory}
          activeSlide={activeSlide}
          setActiveSlide={setActiveSlide}
          Preview={Preview}
         /> : null
      }
    </div>
  );
  
}

export default App;
