import {useState,useEffect} from 'react'
import * as Pieces from "@pieces.app/pieces-os-client";
import {ConversationTypeEnum, SeededConversation} from "@pieces.app/pieces-os-client";
// import "./Copilot.css";

import CopilotStreamController from "../../controllers/copilotStreamController";

let GlobalConversationID: string;

export function createNewConversation() {

  let seededConversation: SeededConversation = { type: ConversationTypeEnum.Copilot, name: "Demo Seeded Conversation" }

  new Pieces.ConversationsApi().conversationsCreateSpecificConversationRaw({transferables: true, seededConversation}).then((_c)  => {
    console.log('Conversation created! : Here is the response:');
    console.log(_c);
    if (_c.raw.ok == true && _c.raw.status == 200) {
      console.log('CLEAN RESPONSE BACK.')
      _c.value().then(_conversation => {
        console.log('Returning new conversation values.');
        GlobalConversationID = _conversation.id;
      })
    } 
  })
}


export async function askQuestion({
                                    query,
                                    relevant,
                                  }: {
  query: string;
  relevant: string;
}) {
  const params: Pieces.QGPTQuestionInput = {
    query,
    relevant: {iterable: []},
  };
  const result = new Pieces.QGPTApi().question({qGPTQuestionInput: params});
  return {result, query};
}

export function CopilotChat(): React.JSX.Element {
  const [chatInputData, setData] = useState('');
  const [message, setMessage] = useState<string>('');
  const [chatHistory, setChatHistory] = useState<({ role: string; message: string; })[]>([]);
  const [isloading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (message) {
      setChatHistory((prev) => [...prev, { role: 'copilot', message }]);
    }
  }, [message]);
  
  const handleCopilotChatInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setData(event.target.value);
  };

  const handleuserMessage = async (chatInputData:any, setMessage:any) => { 
    setIsLoading(true);

    setChatHistory((prev)=> [...prev, {role: 'user', message: chatInputData}]);

    CopilotStreamController.getInstance().askQGPT({
      query: chatInputData,
      setMessage,
    })
    
    setData("");
    await setIsLoading(false);
  }

  const handleNewConversation = async () => {
    createNewConversation();
    setChatHistory([]);
    setMessage("")
    setData("")
  };
  return (
    <div className="flex-col">
      { chatHistory.length === 0 ? (<div className="mb-4 overflow-auto">

        <div className="h-[520px]"></div>

      </div>): (<div className="mb-4 overflow-auto h-[520px]">
        {chatHistory.map((message,index)=>(
          <div key={index} className="flex flex-col">
            {message.role === 'user' ? (
              <div className="flex flex-row justify-end">
                <div className="bg-blue-500 text-white p-2 m-2 rounded-lg">
                  {message.message}
                </div>
              </div>
            ) : (
              <div className="flex flex-row justify-start">
                <div className="bg-gray-200 text-gray-800 p-2 m-2 rounded-lg">
                  {message.message}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>)}
      <div className=""></div>
      
      <div className="flex">
          <input 
            type='text'
            className='flex-1 p-2 rounded-l-lg' 
            placeholder="Type your prompt here..." 
            value={chatInputData} 
            onChange={handleCopilotChatInputChange}>
          </input>

          {isloading ? (
            <div className="bg-blue-500 text-white p-2 rounded-lg animate-pulse">
              Loading...
            </div>
          ) : (
          <button className='bg-blue-500 text-white p-2 rounded-r-lg hover:bg-blue-600' onClick={() => handleuserMessage(chatInputData,setMessage) }>Ask</button>
          )}
          
      </div>
      <div className="flex justify-center">
        <button className="rounded-lg text-center text-sm" onClick={handleNewConversation}>Create Fresh Conversation</button>
      </div>
    </div>
  );
}

