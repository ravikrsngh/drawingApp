
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/lib/css/styles.css";

export default function ColorPickerGfg(){
    const [color, setColor] = useColor("hex", "#121212");
    
    return (
      <div>
          <ColorPicker width={456} height={228} 
                     color={color} 
                     onChange={setColor} hideHSV dark />;
      </div>
    )
  };