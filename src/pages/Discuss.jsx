// // Discussions.jsx
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useSelector } from "react-redux";

// // const API =  "http://localhost:5000/discussions";
// const API = process.env.REACT_APP_BASE_URL?process.env.REACT_APP_BASE_URL + "/main/discussions":"http://localhost:5000/api/v1/main/discussions";
// console.log(API);
// export default function Discussions() {
//   const [discussions, setDiscussions] = useState([]);
//   const user=useSelector((state)=>state.profile.user);
  
//   const [newDiscussion, setNewDiscussion] = useState({
//     category: "",
//     user: user?.email??"", // userId from auth
//     title: "",
//     body: ""
//   });

  
//   useEffect(() => {
//     try{
//       console.log("Fetching discussions from:", API);
//     axios.get(API).then(res =>{
//       console.log("Fetched discussions:", res);
//       //  if(typeof res.data==="array")
//        setDiscussions(res.data);
//       //  setDiscussions(prev=>{
//       //   let temp=res.data;
//       //   temp={...temp,user:user?._id};  
//       //   return temp;
//       //  });
//     });
//   }catch(err){ console.log(err);  window.alert("Error fetching discussions");} 

//   }, []);

//   const createDiscussion = async () => {
//     await axios.post(API, newDiscussion);
     
//     const res = await axios.get(API);
//     //  if(typeof res.data==="array")
//        setDiscussions(res.data);
//     // setDiscussions(res.data);
//   };

//   const upvote = async (id, userId) => {
//     if(!userId){
//       window.alert("Please login to upvote");
//       return;
//     }
//     await axios.put(`${API}/${id}/upvote/${userId}`);
//     const res = await axios.get(API);
//     console.log("Upvoted discussions:", res);
//     //  if(typeof res.data==="array")
//        setDiscussions(res.data);
//     // setDiscussions(res.data);
//   };

//   const addComment = async (id, userId, text) => {
//      if(!userId){
//       window.alert("Please login to upvote");
//       return;
//     }
//     await axios.post(`${API}/${id}/comment`, { user: userId, text });
//     const res = await axios.get(API);
//     //  if(typeof res.data==="array")
//        setDiscussions(res.data);
//     // setDiscussions(res.data);
//   };
 
//   return (
//     <div className="p-6 max-w-3xl mx-auto">
//       <h1 className="text-2xl font-bold mb-4 text-white">Discussions</h1>
//       <p className="text-xl text-white"> Coins {user?.coin}</p>
//       {/* Create Discussion */}
//       <div className="p-4 bg-gray-100 rounded-lg mb-6">
//         <input
//           placeholder="Category"
//           className="border p-2 mb-2 w-full"
//           onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
//         />
//         <input
//           placeholder="Title"
//           className="border p-2 mb-2 w-full"
//           onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
//         />
//         <textarea
//           placeholder="Body"
//           className="border p-2 mb-2 w-full"
//           onChange={(e) => setNewDiscussion({ ...newDiscussion, body: e.target.value })}
//         />
//         <button onClick={createDiscussion} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Post
//         </button>
//       </div>

//       {/* Discussion List */}
//       {discussions?.map((d) => (
//         <div key={d._id} className="p-4 border rounded mb-4 text-white">
//           <h2 className="font-bold">{d.title}</h2>
//           <p className="text-gray-600">{d.body}</p>
//           <p className="text-sm">Category: {d.category}</p>
//           <p className="text-sm">By: {d.user?.name || "Anonymous"}</p>

//           {/* Upvote */}
//           <button
//             className="mt-2 text-blue-500"
//             onClick={() => upvote(d._id, user?._id)}
//           >
//             👍 {d.upvotes.length}
//           </button>

//           {/* Comments */}
//           <div className="mt-2">
//             {d.comments.map((c, idx) => (
//               <p key={idx} className="text-sm">
//                 <b>{c.user?.firstName || "User"}:</b> {c.body}
//               </p>
//             ))}
//             <input
//               placeholder="Add comment"
//               className="border p-1 w-full mt-1 text-black"
//               onKeyDown={(e) => {
//                 if (e.key === "Enter") {
//                   addComment(d._id, user?._id, e.target.value);
//                   e.target.value = "";
//                 }
//               }}
//             />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
// Discussions.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

// const API =  "http://localhost:5000/discussions";
const API = process.env.REACT_APP_BASE_URL?process.env.REACT_APP_BASE_URL + "/main/discussions":"http://localhost:5000/api/v1/main/discussions";
console.log(API);
export default function Discussions() {
  const [discussions, setDiscussions] = useState([]);
  const user=useSelector((state)=>state.profile.user);
  
  const [newDiscussion, setNewDiscussion] = useState({
    category: "",
    user: user?.email, // userId from auth
    title: "",
    body: ""
  });

  
  useEffect(() => {
    try{
      console.log("Fetching discussions from:", API);
      console.log("User in discussions:", user);
      setNewDiscussion({
    category: "",
    user: user?.email, 
    title: "",
    body: ""
  });
    axios.get(API).then(res =>{
      console.log("Fetched discussions:", res);
      //  if(typeof res.data==="array")
       setDiscussions(res.data);
      //  setDiscussions(prev=>{
      //   let temp=res.data;
      //   temp={...temp,user:user?._id};  
      //   return temp;
      //  });
    });
  }catch(err){ console.log(err);  window.alert("Error fetching discussions");} 

  }, []);

  const createDiscussion = async () => {
    await axios.post(API, newDiscussion);
     
    const res = await axios.get(API);
    //  if(typeof res.data==="array")
       setDiscussions(res.data);
    // setDiscussions(res.data);
  };

  const upvote = async (id, userId) => {
    if(!userId){
      window.alert("Please login to upvote");
      return;
    }
    await axios.put(`${API}/${id}/upvote/${userId}`);
    const res = await axios.get(API);
    console.log("Upvoted discussions:", res);
    //  if(typeof res.data==="array")
       setDiscussions(res.data);
    // setDiscussions(res.data);
  };

  const addComment = async (id, userId, text) => {
     if(!userId){
      window.alert("Please login to upvote");
      return;
    }
    await axios.post(`${API}/${id}/comment`, { user: userId, text });
    const res = await axios.get(API);
    //  if(typeof res.data==="array")
       setDiscussions(res.data);
    // setDiscussions(res.data);
  };
 
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-white">Discussions</h1>
      <p className="text-xl text-white"> Coins {user?.coin}</p>
      {/* Create Discussion */}
      <div className="p-4 bg-gray-100 rounded-lg mb-6">
        <input
          placeholder="Category"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setNewDiscussion({ ...newDiscussion, category: e.target.value })}
        />
        <input
          placeholder="Title"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setNewDiscussion({ ...newDiscussion, title: e.target.value })}
        />
        <textarea
          placeholder="Body"
          className="border p-2 mb-2 w-full"
          onChange={(e) => setNewDiscussion({ ...newDiscussion, body: e.target.value })}
        />
        <button onClick={createDiscussion} className="bg-blue-500 text-white px-4 py-2 rounded">
          Post
        </button>
      </div>

      {/* Discussion List */}
      {discussions?.map((d) => (
        <div key={d._id} className="p-4 border rounded mb-4 text-white">
          <h2 className="font-bold">{d.title}</h2>
          <p className="text-gray-600">{d.body}</p>
          <p className="text-sm">Category: {d.category}</p>
          <p className="text-sm">By: {d.user?.name || "Anonymous"}</p>

          {/* Upvote */}
          <button
            className="mt-2 text-blue-500"
            onClick={() => upvote(d._id, user?._id)}
          >
            👍 {d.upvotes.length}
          </button>

          {/* Comments */}
          <div className="mt-2">
            {d.comments.map((c, idx) => (
              <p key={idx} className="text-sm">
                <b>{c.user?.firstName || "User"}:</b> {c.body}
              </p>
            ))}
            <input
              placeholder="Add comment"
              className="border p-1 w-full mt-1 text-black"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  addComment(d._id, user?._id, e.target.value);
                  e.target.value = "";
                }
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

