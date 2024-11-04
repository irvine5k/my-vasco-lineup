import type { MetaFunction } from "@remix-run/node";
import {DndContext, useDroppable, useDraggable} from '@dnd-kit/core';
import { useState, useRef, useEffect} from "react";
import html2canvas from 'html2canvas';


export const meta: MetaFunction = () => {
  return [
    { title: "My Vasco Lineup" },
    {
      name: "description",
      content: "Create and share your favorite lineup for Vasco da Gama.",
    },
  ];
};

const saveToLocalStorage = (key, jsonData) => {
  localStorage.setItem(key, JSON.stringify(jsonData));
};

const getFromLocalStorage = (key) => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null; // Return parsed data or null if not found
};

export default function Index() {
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const [parents, setParents] = useState( {});

  useEffect(() => {
    const parents = getFromLocalStorage('parents');
    setParents(parents);
  }, []);

  const positions = [
    { name: "GL", top: "85%", left: "50%" },
    { name: "RWB", top: "70%", left: "10%" },
    { name: "LB", top: "75%", left: "35%" },
    { name: "RB", top: "75%", left: "65%" },
    { name: "LWB", top: "70%", left: "90%" },
    { name: "CDM", top: "50%", left: "35%" },
    { name: "CDM2", top: "50%", left: "66%" },
    { name: "CM", top: "35%", left: "50%" },
    { name: "ST", top: "15%", left: "50%" },
    { name: "RW", top: "20%", left: "10%" },
    { name: "LW", top: "20%", left: "90%" },
  ]
  const players = [
    {"name": "Keiller", "imageUrl": "https://media.vasco.com.br/static/2022/03/Keiller.png"},
    {"name": "Léo Jardim" , "imageUrl": "https://media.vasco.com.br/static/2023/04/Leo-J.png"},
    {"name": "Léo Pelé"},
    {"name": "Paulo Henrique"},
    {"name": "José Luis Rodríguez"},
    {"name": "Robert Rojas"},
    {"name": "Victor Luis"},
    {"name": "Lucas Piton"},
    {"name": "Leandrinho"},
    {"name": "Lyncon"},
    {"name": "João Victor"},
    {"name": "Victor Victão"},
    {"name": "Luiz Gustavo"},
    {"name": "Luis Martinez"},
    {"name": "Maicon"},
    {"name": "Mateus Cocão"},
    {"name": "Hugo Moura"},
    {"name": "Jair"},
    {"name": "Matheus Jerônimo"},
    {"name": "JP"},
    {"name": "Gabriel Sá"},
    {"name": "Vegetti"},
    {"name": "Lucas Eduardo"},
    {"name": "Maxime Dominguez"},
    {"name": "Pablo Galdames"},
    {"name": "Lukas Zuccarello"},
    {"name": "Paulinho"},
    {"name": "Juan Sforza"},
    {"name": "Igor"},
    {"name": "Emerson Rodríguez"},
    {"name": "Rayan Vitor"},
    {"name": "David"},
    {"name": "Jean Meneses"},
    {"name": "Philippe Coutinho"},
    {"name": "Guilherme Estrella"},
    {"name": "Adson"},
    {"name": "João Pedro Murilo de Paula"},
    {"name": "Payet", "imageUrl": "/payet.jpg"},
    {"name": "Alex Teixeira"},
    {"name": "Rossi"},
    {"name": "Max Alegria"}
]

  const draggables = players.map((player) => (
    {
    "name": player.name, 
    "component":(<Draggable key={player.name} id={player.name}>  
                  <PlayerCard name={player.name} imageUrl={player.imageUrl}/>
                </Draggable>),
    }
  ));




  return (
    <div className="flex flex-col items-center justify-center p-20 gap-16">
       <h1 className="leading text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
          Create and share your favorite lineup for Vasco da Gama.
        </h1>
      <div className="flex flex-col items-center gap-16">
        <DndContext onDragEnd={handleDragEnd}>
          <div className="flex flex-wrap items-center justify-center space-x-2 space-y-2">
            {draggables.filter((draggable) => Object.values(parents).find(parent => draggable.name === parent) == undefined).map((draggable) => (draggable.component))}
          </div>
          <div ref={fieldRef} className="h-[600px] w-[400px] relative bg-cover bg-center mx-auto bg-[url('/football_field.svg')]">
          {positions.map((position) => (
            <PlayerPosition  key={position.name} id={position.name} name={position.name} top={position.top} left={position.left} player={getPlayer(position)}/>
          ))}
          </div>
        </DndContext>
        <button onClick={handleDownload} className="bg-blue-500 text-white font-bold py-2 px-4 rounded">Download Image</button>
      </div>
    </div>
  );

  function handleDownload() {
    if (fieldRef.current) {
        html2canvas(fieldRef.current).then((canvas) => {
            const link = document.createElement('a');
            link.download = 'div-image.jpg';
            link.href = canvas.toDataURL('image/jpeg');
            link.click();
        });
    }
}

  function getPlayer(position) {
    var player = parents[position.name]
    var component = draggables.find((draggable) => draggable.name === player)?.component

    return component;
  }

  function handleDragEnd(event) {
    const {active, over} = event;

    var updatedParents = {...parents}

    // remove player from position if dropped outside
    if(over == null) {
      for (const key in updatedParents) {
       if (updatedParents[key] == active.id) {
          updatedParents[key] = null;
       }
      }
    }

    // add player to position and maybe swap players if the position has a player and the dropped player has a position
    if(over != null && active != null) {
      var oldChild = updatedParents[over.id];
      updatedParents[over.id] = active.id;

      for (const key in updatedParents) {
        if (updatedParents[key] == active.id && key != over.id) {
          
          updatedParents[key] = oldChild;
        }
      }
    }

    saveToLocalStorage('parents', updatedParents);
    setParents(updatedParents);
  }
}


function Droppable(props) {
  const {isOver, setNodeRef} = useDroppable({
    id: props.id,
  });

  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div>
      <button id={"button" + props.id} ref={setNodeRef} data-dropdown-toggle={"dropdown-" + props.id} style={style}>
        {props.children}
      </button>
    
      <div id={"dropdown-" + props.id} className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
      <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
        <li>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Dashboard</a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Settings</a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Earnings</a>
        </li>
        <li>
          <a href="#" className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">Sign out</a>
        </li>
      </ul>
      </div>
    </div>
  );
}

function Draggable(props) {
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: props.id,
  });
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 40,
  } : undefined;

  
  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}

function PlayerPosition({id, name, top, left, player }) {
  return (
    <div
      className="absolute flex flex-col items-center text-black font-bold"
      style={{ top, left, transform: 'translate(-50%, -50%)' }}
    >
      <Droppable id={id}>
        {player != null ? 
          player :
          <>
            <div className="bg-red-500 w-8 h-8 rounded-full flex items-center justify-center"/>
            <div className="text-xs mt-1 text-center">{name}</div>
          </>}
      </Droppable>
    </div>
  );
}

function PlayerCard({name, imageUrl}) {
  const className = `rounded-md border-2 border-solid border-black w-20 h-20 ${imageUrl ? `bg-[url('${imageUrl}')] bg-cover` : "bg-white"}`
  return (
    <div className={className}>
     {imageUrl ? null : <div className="text-xs mt-1 text-center">{name}</div>}
    </div>
  )
}
