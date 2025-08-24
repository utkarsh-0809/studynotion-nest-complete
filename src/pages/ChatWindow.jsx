// ChatWindow.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import io from 'socket.io-client';
import { jwtDecode } from 'jwt-decode'; // ✅ Correct
import { getFullDetailsOfCourse } from '../services/operations/courseDetailsAPI';

const socket = io('http://localhost:5000'); // Adjust to your backend URL

const ChatWindow =  () => {
    const { id } = useParams();
    const courseId=id;
   const { token } = useSelector((state) => state.auth);
  //  const user = jwtDecode(token);
   const { user } = useSelector((state) => state.profile)
//    const user
// console.log(token)
// console.log(user);
   const userId=user?._id;
   const username=user?.email?.substring(0,10);
   const image=user?.image

  //  const course=useSelector((state)=>state.course)
  //  console.log(course)
  const [course,setCourse]=useState({})
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading,setloading]=useState(0);
  const [edit,setedit]= useState(new Map([]));


   useEffect(() => {
    const fetchCourse = async () => {
      try {
        //  if (!userId || !token) return;
        const data=await getFullDetailsOfCourse(courseId,token);
        console.log(data);
        // console.log(user?._id)
      //  setInstructor?(userId==data.courseDetails.instructor?._id)
        setCourse(data.courseDetails);
        // console.log(course)
        setloading(1);
      } catch (err) {
        // setError(err.message);
        console.log(err)
      }
      // finally {
      //   setloading(1);
      // }
    };

    fetchCourse();
  }, [user]);

  

  useEffect( () => {
    // Join the room when component mounts
    socket.emit('joinCourseRoom', { courseId, userId });

    socket.on('joinedRoom', ({ history }) => {
      // console.log(history.length)
      history?.forEach((val,indx) => {
        edit.set(val._id,val.message);
        history[indx].edit=0;
        // console.log(history[indx])
      });
      console.log("history",history)
      setMessages(history);
      // console.log("messages",hi)
    });

    socket.on('messageDeleted', ({ id }) => {
   
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    });
    socket.on('messageUpdated', ({ id,message }) => {
   
      setMessages((prev) => prev.map((msg) => msg._id !== id?msg:{...msg,message:message}));
      // handledit(indx,0);
    });

    socket.on('receiveCourseMessage', (msg) => {
      // console.log(msg);
      msg.edit=0;
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receiveCourseMessage');
      socket.off('joinedRoom');
    };
  }, []); 

  const sendMessage = () => {
    if (input.trim()) {
      socket.emit('sendCourseMessage', {
        courseId,
        userId,
        username,
        message: input,
        image
      });
      // console.log(input)
      // setMessages((prev) => [...prev, input]);
      // console.log(messages,input)
      setInput('');
    }
  };
  const handleDelete=(id)=>{
    console.log(id)
    console.log(messages)
    socket.emit('deleteMsg',{
      id,
      courseId
    });
  }
  const handledit=(indx,val)=>{
   const updatedMessages = messages.map((msg, index) =>
    index === indx ? { ...msg, edit: val } : msg
  );
  setMessages(updatedMessages);

  }
  const changeText=(id,indx,message)=>{
  // handledit(indx,0);
  socket.emit('editMsg',{
      id,
      courseId,
      message
    });
  handledit(indx,0);
  }
  const handleChange=(msg,indx)=>{
    const newMap = new Map(edit);
    newMap.set(indx, msg);
setedit(newMap);

  }

  return (
    loading==0?<div className='w-full h-full bg-red'>loading...</div>:
   <div className="bg-gray-900 text-white p-4 rounded-2xl shadow-lg w-full max-w-md mx-auto">
    <h3 className="text-lg font-semibold mb-4 text-center text-cyan-400">
      Course Chat - {course.courseName}
    </h3>

  <div className="h-72 overflow-y-scroll border border-gray-700 rounded-md p-3 mb-4 bg-gray-800">
    {messages.length === 0 ? (
      <p className="text-gray-400 text-sm text-center">No messages yet.</p>
    ) : (
      messages.map((msg, idx) => (
        <div key={idx} className="mb-1 flex">
          {/* <span className="font-bold text-white ">{msg.username}</span> */}
           <img
          src={msg?.image?msg.image:""}
          // src={user.image}
          alt={`profile-${user?.firstName}`}
          className="aspect-square w-[30px] rounded-full object-cover"
        />
        {/* { console.log(isInstructor?)} */
          msg.edit==0?
          <p className={`ml-2 ${msg.userId==course.instructor?._id?"text-yellow-500":"text-white"} bg-green-500 `}>{msg.message}</p>
          :
          <input
      value={edit.get(msg._id)}
      
      onChange={(e) => handleChange(e.target.value,msg._id)}
      className="flex-grow px-3 py-2  rounded-md bg-gray-700 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      placeholder="Type a message..."
    />
         }
          
          { ((msg.userId==userId||userId==course.instructor?._id)&&msg.edit==0)?
            (<button
          onClick={() => handleDelete(msg._id)}
          className="ml-4 h-20px w-20px bg-yellow text-red-500 hover:text-red-700"
          title="Delete message"
        >delete</button>)
        :<p></p>

          }
          { ((msg.userId==userId||userId==course.instructor?._id)&&msg.edit==1)?
            (<button
          onClick={() => changeText(msg._id,idx,edit.get(msg._id))}
          className="ml-4 h-20px w-20px bg-yellow text-red-500 hover:text-red-700"
          title="Delete message"
        >send</button>)
        :<p></p>

          }
          { ((msg.userId==userId)&&msg.edit==0)?
          <button
          onClick={() =>handledit(idx,1)}
          className="ml-4 h-20px w-20px bg-yellow text-red-500 hover:text-red-700"
          title="Delete message"
        >edit</button>:
        <p></p>
          }
           { ((msg.userId==userId||userId==course.instructor?._id)&&msg.edit==1)?
          <button
          onClick={() =>handledit(idx,0)}
          className="ml-4 h-20px w-20px bg-yellow text-red-500 hover:text-red-700"
          title="Delete message"
        >cancel</button>:
        <p></p>
          }
          
        </div>
      ))
    )}
  </div>

  <div className="flex gap-2">
    <input
      value={input}
      onChange={(e) => setInput(e.target.value)}
      className="flex-grow px-3 py-2 rounded-md bg-gray-700 text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      placeholder="Type a message..."
    />
    <button
      onClick={sendMessage}
      className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-md font-medium"
    >
      Send
    </button>
  </div>
</div>

  );
};

export default ChatWindow;
