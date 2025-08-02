import React, { useEffect, useState } from 'react';

function AllUsersInfo() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected,setSelected]=useState("Instructor");

  useEffect(() => {
    // Define the GraphQL query
    const query = `
      query {
        getAllUsers {
          id
          name
          email
          accountType
          coursesSoldCount
          coursesSoldValue
          coursesBoughtCount
        }
      }
    `;

    // Make the fetch request
    fetch('http://localhost:5000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.errors) {
          throw new Error(result.errors[0].message);
        }
        console.log("users",result.data.getAllUsers)
        setUsers(result.data.getAllUsers);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className='text-white'>
      <div className='flex w-full justify-center m-3 '>
      <button className='mx-4' onClick={()=>setSelected("Admin")}>Admin</button>
      <button className='mx-4' onClick={()=>setSelected("Student")}>Student</button>
      <button onClick={()=>setSelected("Instructor")}>Teacher</button>
      </div>
      <h2>All Users Info</h2>
      <ul>
        {users.filter((user)=>user.accountType===selected).map((user) => (
          <li key={user.id} style={{ marginBottom: '1rem' }}>
            <strong>{user.name}</strong> ({user.accountType})<br />
            <p>{user.email}</p>
            {user.accountType === 'Instructor' && (
              <>
                Courses Sold: {user.coursesSoldCount || 0}<br />
                Revenue: ₹{user.coursesSoldValue || 0}
              </>
            )}
            {user.accountType === 'Student' && (
              <>
                Courses Bought: {user.coursesBoughtCount || 0}
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllUsersInfo;
