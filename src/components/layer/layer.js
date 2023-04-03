import { useState } from 'react';
import './layer.css'

function Layer({data,dataHandler}) {
    console.log(data);
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
  ]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleDragStart = (e, index) => {
    console.log(index);
    setSelectedItem(index);
    setDragging(true);
  };

  const handleDragEnd = (e) => {
    setSelectedItem(null);
    setDragging(false);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    console.log(selectedItem);
    console.log(index);
    if (selectedItem === null || index === selectedItem) {
      return;
    }

    const itemsCopy = [...data].reverse();
    const selectedItemData = itemsCopy[selectedItem];
    const itemData = itemsCopy[index];

    itemsCopy[selectedItem] = itemData;
    itemsCopy[index] = selectedItemData;

    dataHandler([...itemsCopy].reverse());
    setSelectedItem(null);
    setDragging(false);
  };

  return (
    <div className="layer_container">
      <h4>Layers</h4>
      <ul>
        {[...data].reverse().map((item, index) => (
          <li
            key={item.id}
            draggable="true"
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
            onDragOver={(e) => handleDragOver(e, index)}
            className={index === selectedItem ? 'selected' : ''}
          >
            {item.id} - {item.type}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Layer;
